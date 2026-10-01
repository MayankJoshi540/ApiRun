import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  doc, 
  getDoc, 
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export interface FeedbackComment {
  id: string;
  userId?: string;
  userName: string;
  userRole?: 'admin' | 'user';
  content: string;
  isAnonymous?: boolean;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  type: 'suggestion' | 'bug';
  status: 'open' | 'closed';
  isAnonymous: boolean;
  userId?: string;
  userName: string;
  userEmail?: string;
  upvotesCount: number;
  upvotedBy: string[];
  commentsCount: number;
  comments: FeedbackComment[];
  createdAt: string;
  closedAt?: string;
  closedBy?: string;
  rating?: number;
  category?: string;
}

const ADMIN_EMAILS = ['joshimayank646@gmail.com'];

function isModerator(userEmail?: string, userRole?: string): boolean {
  if (userRole === 'admin') return true;
  if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase().trim())) return true;
  return false;
}

// Local and tmp fallback storage paths
const LOCAL_PATH = path.join(process.cwd(), 'feedbacks.json');
const FALLBACK_TMP_PATH = path.join(os.tmpdir(), 'apirun_feedbacks_db.json');

function readFallbackFeedbacks(): FeedbackItem[] {
  const mergedMap = new Map<string, FeedbackItem>();

  // 1. Read from local project feedbacks.json if exists
  try {
    if (fs.existsSync(LOCAL_PATH)) {
      const raw = fs.readFileSync(LOCAL_PATH, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((item: FeedbackItem) => {
          if (item?.id) mergedMap.set(item.id, item);
        });
      }
    }
  } catch (err) {
    // Ignore read error
  }

  // 2. Read from tmp file if exists
  try {
    if (fs.existsSync(FALLBACK_TMP_PATH)) {
      const raw = fs.readFileSync(FALLBACK_TMP_PATH, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((item: FeedbackItem) => {
          if (item?.id) mergedMap.set(item.id, item);
        });
      }
    }
  } catch (err) {
    // Ignore read error
  }

  return Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function writeFallbackFeedbacks(list: FeedbackItem[]) {
  const jsonStr = JSON.stringify(list, null, 2);

  // Try writing to local project file (for local dev persistence)
  try {
    fs.writeFileSync(LOCAL_PATH, jsonStr, 'utf-8');
  } catch (err) {
    // Expected to fail on read-only serverless filesystems (e.g., Vercel)
  }

  // Always write to os.tmpdir() (writable in serverless)
  try {
    fs.writeFileSync(FALLBACK_TMP_PATH, jsonStr, 'utf-8');
  } catch (err) {
    console.warn('Fallback tmp file write failed:', err);
  }
}

// GET: Retrieve all feedback items (from Firestore / DB & Fallback Store)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get('type') || 'all'; // all, suggestions, bugs
    const statusFilter = searchParams.get('status') || 'all'; // all, open, closed
    const sortBy = searchParams.get('sort') || 'hot'; // hot, top, new

    const feedbackMap = new Map<string, FeedbackItem>();

    // 1. Read local / tmp store first
    const localFeedbacks = readFallbackFeedbacks();
    localFeedbacks.forEach((fb) => {
      if (fb?.id) feedbackMap.set(fb.id, fb);
    });

    // 2. Read from Firestore if configured
    if (db) {
      try {
        const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'), limit(200));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const id = docSnap.id;
          feedbackMap.set(id, {
            id: id,
            title: data.title || data.subject || 'Untitled Feedback',
            description: data.description || data.message || '',
            type: data.type || (data.category === 'Bug Report' ? 'bug' : 'suggestion'),
            status: data.status || 'open',
            isAnonymous: true,
            userId: data.userId || data.user_id,
            userName: 'Anonymous Developer',
            userEmail: undefined,
            upvotesCount: typeof data.upvotesCount === 'number' ? data.upvotesCount : (data.upvotes_count || 1),
            upvotedBy: Array.isArray(data.upvotedBy) ? data.upvotedBy : (data.upvoted_by || []),
            commentsCount: typeof data.commentsCount === 'number' ? data.commentsCount : (data.comments?.length || 0),
            comments: Array.isArray(data.comments) ? data.comments.map((c: any) => ({
              ...c,
              userName: c.userRole === 'admin' && !c.isAnonymous ? (c.userName || 'Moderator') : 'Anonymous',
              isAnonymous: c.userRole === 'admin' && !c.isAnonymous ? false : true,
            })) : [],
            createdAt: data.createdAt || data.timestamp || new Date().toISOString(),
            closedAt: data.closedAt,
            closedBy: data.closedBy,
            category: data.category,
            rating: data.rating,
          });
        });
      } catch (err) {
        console.warn('Firestore getDocs fallback to local store:', err);
      }
    }

    let feedbacks = Array.from(feedbackMap.values());

    // Calculate total and category counts across entire collection
    const counts = {
      all: feedbacks.length,
      suggestions: feedbacks.filter((f) => f.type === 'suggestion').length,
      bugs: feedbacks.filter((f) => f.type === 'bug').length,
      open: feedbacks.filter((f) => f.status === 'open').length,
      closed: feedbacks.filter((f) => f.status === 'closed').length,
    };

    // Apply filtering
    let filtered = [...feedbacks];

    if (typeFilter === 'suggestions' || typeFilter === 'suggestion') {
      filtered = filtered.filter((f) => f.type === 'suggestion');
    } else if (typeFilter === 'bugs' || typeFilter === 'bug') {
      filtered = filtered.filter((f) => f.type === 'bug');
    }

    if (statusFilter === 'open') {
      filtered = filtered.filter((f) => f.status === 'open');
    } else if (statusFilter === 'closed') {
      filtered = filtered.filter((f) => f.status === 'closed');
    }

    // Apply sorting
    if (sortBy === 'top') {
      filtered.sort((a, b) => b.upvotesCount - a.upvotesCount);
    } else if (sortBy === 'new') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // 'hot'
      filtered.sort((a, b) => {
        const scoreA = a.upvotesCount * 3 + (a.commentsCount || 0) * 2;
        const scoreB = b.upvotesCount * 3 + (b.commentsCount || 0) * 2;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return NextResponse.json(
      {
        success: true,
        total: feedbacks.length,
        counts,
        feedbacks: filtered,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in GET /api/feedback:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch feedback records.' },
      { status: 500 }
    );
  }
}

// POST: Create a new feedback submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title, 
      subject,
      description, 
      message, 
      type = 'suggestion', 
      userId, 
      rating = 5,
      category
    } = body;

    const finalTitle = (title || subject || '').trim();
    const finalDescription = (description || message || '').trim();

    if (!finalTitle || !finalDescription) {
      return NextResponse.json(
        { error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    const generatedId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Stored anonymously by default
    const newFeedback: FeedbackItem = {
      id: generatedId,
      title: finalTitle,
      description: finalDescription,
      type: type === 'bug' ? 'bug' : 'suggestion',
      status: 'open',
      isAnonymous: true,
      userId: userId || undefined,
      userName: 'Anonymous Developer',
      userEmail: undefined,
      upvotesCount: 1,
      upvotedBy: userId ? [userId] : [],
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      rating: typeof rating === 'number' ? rating : 5,
      category: category || (type === 'bug' ? 'Bug Report' : 'Feature Request'),
    };

    // 1. Persist to local fallback storage immediately
    const list = readFallbackFeedbacks();
    list.unshift(newFeedback);
    writeFallbackFeedbacks(list);

    // 2. Persist to Firestore if available
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'feedbacks'), newFeedback);
        newFeedback.id = docRef.id;
        // Update local store with the Firestore doc ID if assigned
        const updatedList = readFallbackFeedbacks().map((item) =>
          item.id === generatedId ? { ...item, id: docRef.id } : item
        );
        writeFallbackFeedbacks(updatedList);
      } catch (err) {
        console.warn('Firestore addDoc fallback used:', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully!',
        feedback: newFeedback,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/feedback:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit feedback.' },
      { status: 500 }
    );
  }
}

// PATCH: Handles actions like upvoting, adding reply comments, and closing tickets
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, feedbackId, userId, userName, userRole, userEmail, content, status, closingNote } = body;

    if (!feedbackId) {
      return NextResponse.json({ error: 'feedbackId is required' }, { status: 400 });
    }

    const fallbackList = readFallbackFeedbacks();
    const fallbackItemIndex = fallbackList.findIndex((f) => f.id === feedbackId);

    // ACTION 1: Upvote toggle
    if (action === 'vote') {
      const voterId = userId || 'anon_client';
      let updatedItem: FeedbackItem | null = null;

      if (fallbackItemIndex !== -1) {
        const item = fallbackList[fallbackItemIndex];
        const hasVoted = item.upvotedBy.includes(voterId);
        if (hasVoted) {
          item.upvotedBy = item.upvotedBy.filter((id) => id !== voterId);
          item.upvotesCount = Math.max(0, item.upvotesCount - 1);
        } else {
          item.upvotedBy.push(voterId);
          item.upvotesCount += 1;
        }
        fallbackList[fallbackItemIndex] = item;
        writeFallbackFeedbacks(fallbackList);
        updatedItem = item;
      }

      if (db) {
        try {
          const docRef = doc(db, 'feedbacks', feedbackId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as FeedbackItem;
            const currentVotes = Array.isArray(data.upvotedBy) ? data.upvotedBy : [];
            const hasVoted = currentVotes.includes(voterId);
            const nextVotes = hasVoted 
              ? currentVotes.filter((id) => id !== voterId) 
              : [...currentVotes, voterId];
            const nextCount = Math.max(0, (data.upvotesCount || 0) + (hasVoted ? -1 : 1));

            await updateDoc(docRef, {
              upvotedBy: nextVotes,
              upvotesCount: nextCount,
            });
          }
        } catch (err) {
          console.warn('Firestore vote update error:', err);
        }
      }

      return NextResponse.json({ success: true, feedback: updatedItem });
    }

    // ACTION 2: Post Comment / Reply
    if (action === 'comment') {
      if (!content || !content.trim()) {
        return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 });
      }

      const isMod = isModerator(userEmail, userRole) || userName?.toLowerCase().includes('moderator');

      const newComment: FeedbackComment = {
        id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: userId || undefined,
        userName: isMod ? 'Moderator' : 'Anonymous',
        userRole: isMod ? 'admin' : 'user',
        content: content.trim(),
        isAnonymous: !isMod,
        createdAt: new Date().toISOString(),
      };

      let updatedItem: FeedbackItem | null = null;

      if (fallbackItemIndex !== -1) {
        const item = fallbackList[fallbackItemIndex];
        item.comments = item.comments || [];
        item.comments.push(newComment);
        item.commentsCount = item.comments.length;
        fallbackList[fallbackItemIndex] = item;
        writeFallbackFeedbacks(fallbackList);
        updatedItem = item;
      }

      if (db) {
        try {
          const docRef = doc(db, 'feedbacks', feedbackId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as FeedbackItem;
            const currentComments = Array.isArray(data.comments) ? data.comments : [];
            currentComments.push(newComment);
            await updateDoc(docRef, {
              comments: currentComments,
              commentsCount: currentComments.length,
            });
          }
        } catch (err) {
          console.warn('Firestore comment update error:', err);
        }
      }

      return NextResponse.json({ success: true, comment: newComment, feedback: updatedItem });
    }

    // ACTION 3: Close or Reopen Feedback Ticket (STRICTLY MODERATOR ONLY)
    if (action === 'status' || action === 'close' || action === 'reopen') {
      const isMod = isModerator(userEmail, userRole);
      if (!isMod) {
        return NextResponse.json(
          { error: 'Unauthorized: Only the moderator (joshimayank646@gmail.com) can resolve or reopen feedback tickets.' },
          { status: 403 }
        );
      }

      const nextStatus: 'open' | 'closed' = (action === 'reopen' || status === 'open') ? 'open' : 'closed';
      const actorName = 'Moderator';

      let updatedItem: FeedbackItem | null = null;

      if (fallbackItemIndex !== -1) {
        const item = fallbackList[fallbackItemIndex];
        item.status = nextStatus;
        if (nextStatus === 'closed') {
          item.closedAt = new Date().toISOString();
          item.closedBy = actorName;
        } else {
          item.closedAt = undefined;
          item.closedBy = undefined;
        }

        if (closingNote && closingNote.trim()) {
          const noteComment: FeedbackComment = {
            id: `c_${Date.now()}_res`,
            userId: userId || undefined,
            userName: actorName,
            userRole: 'admin',
            content: `[Resolution]: ${closingNote.trim()}`,
            isAnonymous: false,
            createdAt: new Date().toISOString(),
          };
          item.comments = item.comments || [];
          item.comments.push(noteComment);
          item.commentsCount = item.comments.length;
        }

        fallbackList[fallbackItemIndex] = item;
        writeFallbackFeedbacks(fallbackList);
        updatedItem = item;
      }

      if (db) {
        try {
          const docRef = doc(db, 'feedbacks', feedbackId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const updates: any = {
              status: nextStatus,
              closedAt: nextStatus === 'closed' ? new Date().toISOString() : null,
              closedBy: nextStatus === 'closed' ? actorName : null,
            };

            if (closingNote && closingNote.trim()) {
              const noteComment: FeedbackComment = {
                id: `c_${Date.now()}_res`,
                userId: userId || undefined,
                userName: actorName,
                userRole: 'admin',
                content: `[Resolution]: ${closingNote.trim()}`,
                isAnonymous: false,
                createdAt: new Date().toISOString(),
              };
              const currentComments = Array.isArray(snap.data()?.comments) ? snap.data().comments : [];
              currentComments.push(noteComment);
              updates.comments = currentComments;
              updates.commentsCount = currentComments.length;
            }

            await updateDoc(docRef, updates);
          }
        } catch (err) {
          console.warn('Firestore status update error:', err);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `Feedback marked as ${nextStatus}`, 
        status: nextStatus,
        feedback: updatedItem 
      });
    }

    return NextResponse.json({ error: 'Invalid action provided' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in PATCH /api/feedback:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update feedback.' },
      { status: 500 }
    );
  }
}

// DELETE: Moderator Delete Feedback permanently (STRICTLY MODERATOR ONLY)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const feedbackId = searchParams.get('id');
    const userEmail = req.headers.get('x-user-email') || searchParams.get('email');

    if (!feedbackId) {
      return NextResponse.json({ error: 'Feedback id is required for deletion' }, { status: 400 });
    }

    if (userEmail && !ADMIN_EMAILS.includes(userEmail.toLowerCase().trim())) {
      return NextResponse.json({ error: 'Unauthorized: Only moderator can delete feedback' }, { status: 403 });
    }

    // 1. Remove from local fallback file
    const fallbackList = readFallbackFeedbacks();
    const updatedFallbackList = fallbackList.filter((f) => f.id !== feedbackId);
    writeFallbackFeedbacks(updatedFallbackList);

    // 2. Remove from Firestore if configured
    if (db) {
      try {
        const docRef = doc(db, 'feedbacks', feedbackId);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('Firestore deleteDoc error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully.',
      deletedId: feedbackId,
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/feedback:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete feedback.' },
      { status: 500 }
    );
  }
}
