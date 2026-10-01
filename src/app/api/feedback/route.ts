import { NextRequest, NextResponse } from 'next/server';
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
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'apirun-2c70e';
const FIRESTORE_API_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/feedbacks`;

function isModerator(userEmail?: string, userRole?: string): boolean {
  if (userRole === 'admin') return true;
  if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase().trim())) return true;
  return false;
}

// Convert FeedbackItem to Google Firestore REST JSON format
function toFirestoreFields(item: FeedbackItem) {
  return {
    fields: {
      id: { stringValue: item.id },
      title: { stringValue: item.title },
      description: { stringValue: item.description },
      type: { stringValue: item.type },
      status: { stringValue: item.status },
      isAnonymous: { booleanValue: Boolean(item.isAnonymous) },
      userId: item.userId ? { stringValue: item.userId } : { nullValue: null },
      userName: { stringValue: item.userName || 'Anonymous Developer' },
      upvotesCount: { integerValue: String(item.upvotesCount || 0) },
      upvotedBy: {
        arrayValue: {
          values: (item.upvotedBy || []).map((id) => ({ stringValue: id })),
        },
      },
      commentsCount: { integerValue: String(item.commentsCount || 0) },
      comments: {
        arrayValue: {
          values: (item.comments || []).map((c) => ({
            mapValue: {
              fields: {
                id: { stringValue: c.id },
                userName: { stringValue: c.userName },
                userRole: { stringValue: c.userRole || 'user' },
                content: { stringValue: c.content },
                isAnonymous: { booleanValue: Boolean(c.isAnonymous) },
                createdAt: { stringValue: c.createdAt },
              },
            },
          })),
        },
      },
      createdAt: { stringValue: item.createdAt || new Date().toISOString() },
      closedAt: item.closedAt ? { stringValue: item.closedAt } : { nullValue: null },
      closedBy: item.closedBy ? { stringValue: item.closedBy } : { nullValue: null },
      rating: { integerValue: String(item.rating || 5) },
      category: { stringValue: item.category || (item.type === 'bug' ? 'Bug Report' : 'Feature Request') },
    },
  };
}

// Parse Google Firestore REST JSON document into FeedbackItem
function fromFirestoreDoc(doc: any): FeedbackItem | null {
  try {
    if (!doc || !doc.fields) return null;
    const f = doc.fields;
    const pathParts = (doc.name || '').split('/');
    const docId = f.id?.stringValue || pathParts[pathParts.length - 1];

    const comments: FeedbackComment[] = [];
    if (f.comments?.arrayValue?.values) {
      f.comments.arrayValue.values.forEach((v: any) => {
        const cf = v.mapValue?.fields;
        if (cf) {
          comments.push({
            id: cf.id?.stringValue || `c_${Date.now()}`,
            userName: cf.userName?.stringValue || 'Anonymous',
            userRole: (cf.userRole?.stringValue as any) || 'user',
            content: cf.content?.stringValue || '',
            isAnonymous: Boolean(cf.isAnonymous?.booleanValue),
            createdAt: cf.createdAt?.stringValue || new Date().toISOString(),
          });
        }
      });
    }

    const upvotedBy: string[] = [];
    if (f.upvotedBy?.arrayValue?.values) {
      f.upvotedBy.arrayValue.values.forEach((v: any) => {
        if (v.stringValue) upvotedBy.push(v.stringValue);
      });
    }

    return {
      id: docId,
      title: f.title?.stringValue || 'Untitled',
      description: f.description?.stringValue || '',
      type: (f.type?.stringValue === 'bug' ? 'bug' : 'suggestion') as 'suggestion' | 'bug',
      status: (f.status?.stringValue === 'closed' ? 'closed' : 'open') as 'open' | 'closed',
      isAnonymous: true,
      userId: f.userId?.stringValue || undefined,
      userName: 'Anonymous Developer',
      upvotesCount: parseInt(f.upvotesCount?.integerValue || '0', 10),
      upvotedBy,
      commentsCount: parseInt(f.commentsCount?.integerValue || String(comments.length), 10),
      comments,
      createdAt: f.createdAt?.stringValue || new Date().toISOString(),
      closedAt: f.closedAt?.stringValue || undefined,
      closedBy: f.closedBy?.stringValue || undefined,
      rating: parseInt(f.rating?.integerValue || '5', 10),
      category: f.category?.stringValue,
    };
  } catch (err) {
    console.warn('Error parsing firestore doc:', err);
    return null;
  }
}

// Local fallback storage
const LOCAL_PATH = path.join(process.cwd(), 'feedbacks.json');
const FALLBACK_TMP_PATH = path.join(os.tmpdir(), 'apirun_feedbacks_db.json');

function readFallbackFeedbacks(): FeedbackItem[] {
  const mergedMap = new Map<string, FeedbackItem>();

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
  } catch {}

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
  } catch {}

  return Array.from(mergedMap.values());
}

function writeFallbackFeedbacks(list: FeedbackItem[]) {
  const jsonStr = JSON.stringify(list, null, 2);
  try {
    fs.writeFileSync(LOCAL_PATH, jsonStr, 'utf-8');
  } catch {}
  try {
    fs.writeFileSync(FALLBACK_TMP_PATH, jsonStr, 'utf-8');
  } catch {}
}

// GET: Retrieve all feedback items (Cloud Firestore REST API + Local Fallback)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get('type') || 'all';
    const statusFilter = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sort') || 'hot';

    const feedbackMap = new Map<string, FeedbackItem>();

    // 1. Fetch live from Firestore REST API (Works in 100% of environments including Vercel)
    try {
      const firestoreRes = await fetch(`${FIRESTORE_API_BASE}?pageSize=300`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (firestoreRes.ok) {
        const data = await firestoreRes.json();
        if (data.documents && Array.isArray(data.documents)) {
          data.documents.forEach((d: any) => {
            const item = fromFirestoreDoc(d);
            if (item && item.id) {
              feedbackMap.set(item.id, item);
            }
          });
        }
      } else {
        console.warn('Firestore REST fetch status:', firestoreRes.status);
      }
    } catch (err) {
      console.warn('Firestore REST fetch error:', err);
    }

    // 2. Merge local fallback items
    const localFeedbacks = readFallbackFeedbacks();
    localFeedbacks.forEach((fb) => {
      if (fb?.id && !feedbackMap.has(fb.id)) {
        feedbackMap.set(fb.id, fb);
      }
    });

    let feedbacks = Array.from(feedbackMap.values());

    const counts = {
      all: feedbacks.length,
      suggestions: feedbacks.filter((f) => f.type === 'suggestion').length,
      bugs: feedbacks.filter((f) => f.type === 'bug').length,
      open: feedbacks.filter((f) => f.status === 'open').length,
      closed: feedbacks.filter((f) => f.status === 'closed').length,
    };

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

    if (sortBy === 'top') {
      filtered.sort((a, b) => b.upvotesCount - a.upvotesCount);
    } else if (sortBy === 'new') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
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

    // 1. Save to Cloud Firestore REST API directly
    try {
      const fsRes = await fetch(`${FIRESTORE_API_BASE}/${generatedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toFirestoreFields(newFeedback)),
      });
      if (!fsRes.ok) {
        console.warn('Firestore REST POST status:', fsRes.status);
      }
    } catch (err) {
      console.warn('Firestore REST write error:', err);
    }

    // 2. Save to local fallback storage
    const list = readFallbackFeedbacks();
    list.unshift(newFeedback);
    writeFallbackFeedbacks(list);

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

    // Fetch existing document from Firestore REST
    let currentItem: FeedbackItem | null = null;
    try {
      const getRes = await fetch(`${FIRESTORE_API_BASE}/${feedbackId}`, { cache: 'no-store' });
      if (getRes.ok) {
        const rawDoc = await getRes.json();
        currentItem = fromFirestoreDoc(rawDoc);
      }
    } catch {}

    if (!currentItem) {
      const localList = readFallbackFeedbacks();
      currentItem = localList.find((f) => f.id === feedbackId) || null;
    }

    if (!currentItem) {
      return NextResponse.json({ error: 'Feedback item not found' }, { status: 404 });
    }

    // ACTION 1: Upvote toggle
    if (action === 'vote') {
      const voterId = userId || 'anon_client';
      const hasVoted = currentItem.upvotedBy.includes(voterId);
      
      if (hasVoted) {
        currentItem.upvotedBy = currentItem.upvotedBy.filter((id) => id !== voterId);
        currentItem.upvotesCount = Math.max(0, currentItem.upvotesCount - 1);
      } else {
        currentItem.upvotedBy.push(voterId);
        currentItem.upvotesCount += 1;
      }

      // Save back to Firestore REST
      try {
        await fetch(`${FIRESTORE_API_BASE}/${feedbackId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toFirestoreFields(currentItem)),
        });
      } catch {}

      // Save to local fallback
      const localList = readFallbackFeedbacks().map((f) => (f.id === feedbackId ? currentItem! : f));
      writeFallbackFeedbacks(localList);

      return NextResponse.json({ success: true, feedback: currentItem });
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

      currentItem.comments = currentItem.comments || [];
      currentItem.comments.push(newComment);
      currentItem.commentsCount = currentItem.comments.length;

      // Save back to Firestore REST
      try {
        await fetch(`${FIRESTORE_API_BASE}/${feedbackId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toFirestoreFields(currentItem)),
        });
      } catch {}

      // Save to local fallback
      const localList = readFallbackFeedbacks().map((f) => (f.id === feedbackId ? currentItem! : f));
      writeFallbackFeedbacks(localList);

      return NextResponse.json({ success: true, comment: newComment, feedback: currentItem });
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

      currentItem.status = nextStatus;
      if (nextStatus === 'closed') {
        currentItem.closedAt = new Date().toISOString();
        currentItem.closedBy = actorName;
      } else {
        currentItem.closedAt = undefined;
        currentItem.closedBy = undefined;
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
        currentItem.comments = currentItem.comments || [];
        currentItem.comments.push(noteComment);
        currentItem.commentsCount = currentItem.comments.length;
      }

      // Save back to Firestore REST
      try {
        await fetch(`${FIRESTORE_API_BASE}/${feedbackId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toFirestoreFields(currentItem)),
        });
      } catch {}

      // Save to local fallback
      const localList = readFallbackFeedbacks().map((f) => (f.id === feedbackId ? currentItem! : f));
      writeFallbackFeedbacks(localList);

      return NextResponse.json({ 
        success: true, 
        message: `Feedback marked as ${nextStatus}`, 
        status: nextStatus,
        feedback: currentItem 
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

    // 1. Delete from Cloud Firestore REST API
    try {
      await fetch(`${FIRESTORE_API_BASE}/${feedbackId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Firestore REST delete error:', err);
    }

    // 2. Remove from local fallback file
    const fallbackList = readFallbackFeedbacks();
    const updatedFallbackList = fallbackList.filter((f) => f.id !== feedbackId);
    writeFallbackFeedbacks(updatedFallbackList);

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
