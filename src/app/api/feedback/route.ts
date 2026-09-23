import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export interface FeedbackItem {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  subject: string;
  message: string;
  userId?: string;
  userAgent?: string;
}

const ADMIN_EMAIL = 'joshimayank646@gmail.com';
const ROOT_FEEDBACKS_PATH = path.join(process.cwd(), 'feedbacks.json');

function readLocalFeedbacks(): FeedbackItem[] {
  try {
    if (fs.existsSync(ROOT_FEEDBACKS_PATH)) {
      const data = fs.readFileSync(ROOT_FEEDBACKS_PATH, 'utf-8');
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch (err) {
    console.warn('Local feedbacks.json read notice:', err);
  }
  return [];
}

function writeLocalFeedbacks(feedbacks: FeedbackItem[]) {
  try {
    fs.writeFileSync(ROOT_FEEDBACKS_PATH, JSON.stringify(feedbacks, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Local feedbacks.json write notice:', err);
  }
}

// 1. POST: Submit and store new feedback in Database & Local JSON
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, rating, category, subject, message, userId } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Feedback message is required.' },
        { status: 400 }
      );
    }

    const generatedId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newFeedback: FeedbackItem = {
      id: generatedId,
      timestamp: new Date().toISOString(),
      name: (name || 'Anonymous Developer').trim(),
      email: (email || 'anonymous@apirun.dev').trim(),
      rating: typeof rating === 'number' ? rating : 5,
      category: (category || 'General Feedback').trim(),
      subject: (subject || 'Platform Feedback').trim(),
      message: message.trim(),
      userId: userId || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    };

    let firestoreId = generatedId;

    // Save to Firestore 'feedbacks' collection
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'feedbacks'), newFeedback);
        firestoreId = docRef.id;
        newFeedback.id = firestoreId;
      } catch (firestoreErr) {
        console.warn('Firestore write fallback:', firestoreErr);
      }
    }

    // Also persist into root feedbacks.json
    const existingList = readLocalFeedbacks();
    existingList.unshift(newFeedback);
    writeLocalFeedbacks(existingList);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your feedback has been securely stored in the database.',
        feedbackId: newFeedback.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save feedback on server.' },
      { status: 500 }
    );
  }
}

// 2. GET: Read feedbacks — Restricted exclusively to joshimayank646@gmail.com
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const requestEmail = (
      req.headers.get('x-admin-email') || 
      url.searchParams.get('adminEmail') || 
      ''
    ).toLowerCase().trim();

    // Security check: Only joshimayank646@gmail.com can fetch and view feedbacks
    if (requestEmail !== ADMIN_EMAIL) {
      return NextResponse.json(
        { 
          error: 'Unauthorized. Access to the feedback inbox is restricted exclusively to joshimayank646@gmail.com.' 
        },
        { status: 403 }
      );
    }

    let feedbacksMap = new Map<string, FeedbackItem>();

    // 1. Fetch from Firestore collection 'feedbacks'
    if (db) {
      try {
        const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'), limit(200));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as FeedbackItem;
          feedbacksMap.set(docSnap.id, {
            ...data,
            id: docSnap.id,
          });
        });
      } catch (err) {
        console.warn('Firestore fetch notice, using local file:', err);
      }
    }

    // 2. Merge local records from feedbacks.json
    const localList = readLocalFeedbacks();
    for (const item of localList) {
      if (!feedbacksMap.has(item.id)) {
        feedbacksMap.set(item.id, item);
      }
    }

    const feedbacks = Array.from(feedbacksMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      total: feedbacks.length,
      feedbacks,
    });
  } catch (error: any) {
    console.error('Error reading feedbacks:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feedback list.' },
      { status: 500 }
    );
  }
}

// 3. DELETE: Remove feedback entry from Firestore & local database
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get('id');
    let requestEmail = (
      req.headers.get('x-admin-email') || 
      url.searchParams.get('adminEmail') || 
      ''
    ).toLowerCase().trim();

    // If payload passed in body
    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
        if (body.adminEmail) requestEmail = body.adminEmail.toLowerCase().trim();
      } catch {}
    }

    // Security check: Only joshimayank646@gmail.com can delete feedbacks
    if (requestEmail !== ADMIN_EMAIL) {
      return NextResponse.json(
        { 
          error: 'Unauthorized. Only joshimayank646@gmail.com has permission to delete feedback records.' 
        },
        { status: 403 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Feedback ID is required to delete.' },
        { status: 400 }
      );
    }

    // 1. Delete from Firestore if db configured
    if (db) {
      try {
        await deleteDoc(doc(db, 'feedbacks', id));
      } catch (firestoreErr) {
        console.warn('Firestore delete document notice:', firestoreErr);
      }
    }

    // 2. Delete from local feedbacks.json
    const currentList = readLocalFeedbacks();
    const updatedList = currentList.filter(item => item.id !== id);
    writeLocalFeedbacks(updatedList);

    return NextResponse.json({
      success: true,
      message: 'Feedback entry successfully deleted from database.',
      deletedId: id,
    });
  } catch (error: any) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete feedback entry.' },
      { status: 500 }
    );
  }
}
