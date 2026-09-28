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

// Fallback path in /tmp for environments where filesystem writes are needed
const FALLBACK_TMP_PATH = path.join(os.tmpdir(), 'apirun_feedbacks_db.json');

function readFallbackFeedbacks(): FeedbackItem[] {
  try {
    if (fs.existsSync(FALLBACK_TMP_PATH)) {
      const raw = fs.readFileSync(FALLBACK_TMP_PATH, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Fallback file read error:', err);
  }
  return [];
}

function writeFallbackFeedbacks(list: FeedbackItem[]) {
  try {
    fs.writeFileSync(FALLBACK_TMP_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Fallback file write failed:', err);
  }
}

// GET: Retrieve all feedback items (from Firestore / DB)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get('type') || 'all'; // all, suggestions, bugs
    const statusFilter = searchParams.get('status') || 'all'; // all, open, closed
    const sortBy = searchParams.get('sort') || 'hot'; // hot, top, new

    let feedbacks: FeedbackItem[] = [];

    if (db) {
      try {
        const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'), limit(200));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          feedbacks.push({
            id: docSnap.id,
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
        feedbacks = readFallbackFeedbacks();
      }
    } else {
      feedbacks = readFallbackFeedbacks();
    }

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

    return NextResponse.json({
      success: true,
      total: feedbacks.length,
      counts,
      feedbacks: filtered,
    });
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

    // Everyone is stored as anonymous by default
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

    let savedStorage = 'Firestore Database';

    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'feedbacks'), newFeedback);
        newFeedback.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addDoc failed, writing to fallback store:', err);
        const list = readFallbackFeedbacks();
        list.unshift(newFeedback);
        writeFallbackFeedbacks(list);
        savedStorage = 'Local Fallback Storage';
      }
    } else {
      const list = readFallbackFeedbacks();
      list.unshift(newFeedback);
      writeFallbackFeedbacks(list);
      savedStorage = 'Local Fallback Storage';
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully!',
        feedback: newFeedback,
        savedTo: savedStorage,
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
    const { action, feedbackId, userId, userName, userRole, content, status, closingNote } = body;

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

      const isModerator = userRole === 'admin' || userName?.toLowerCase().includes('moderator') || userName?.toLowerCase().includes('admin');

      const newComment: FeedbackComment = {
        id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: userId || undefined,
        userName: isModerator ? 'Moderator' : 'Anonymous',
        userRole: isModerator ? 'admin' : 'user',
        content: content.trim(),
        isAnonymous: !isModerator,
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

    // ACTION 3: Close or Reopen Feedback Ticket
    if (action === 'status' || action === 'close' || action === 'reopen') {
      const nextStatus: 'open' | 'closed' = (action === 'reopen' || status === 'open') ? 'open' : 'closed';
      const actorName = userRole === 'admin' ? 'Moderator' : 'Anonymous';

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
            userRole: userRole === 'admin' ? 'admin' : 'user',
            content: `[Resolution]: ${closingNote.trim()}`,
            isAnonymous: userRole !== 'admin',
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
                userRole: userRole === 'admin' ? 'admin' : 'user',
                content: `[Resolution]: ${closingNote.trim()}`,
                isAnonymous: userRole !== 'admin',
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

// DELETE: Moderator Delete Feedback permanently
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const feedbackId = searchParams.get('id');

    if (!feedbackId) {
      return NextResponse.json({ error: 'Feedback id is required for deletion' }, { status: 400 });
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
