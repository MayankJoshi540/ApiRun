import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

// Fallback path in /tmp for environments where filesystem writes are needed (Vercel serverless /tmp is writable)
const FALLBACK_TMP_PATH = path.join(os.tmpdir(), 'apirun_feedbacks.json');

function saveToFallbackFile(feedback: FeedbackItem) {
  try {
    let list: FeedbackItem[] = [];
    if (fs.existsSync(FALLBACK_TMP_PATH)) {
      list = JSON.parse(fs.readFileSync(FALLBACK_TMP_PATH, 'utf-8'));
      if (!Array.isArray(list)) list = [];
    }
    list.unshift(feedback);
    fs.writeFileSync(FALLBACK_TMP_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Fallback file write failed:', err);
  }
}

function getFromFallbackFile(): FeedbackItem[] {
  try {
    if (fs.existsSync(FALLBACK_TMP_PATH)) {
      const list = JSON.parse(fs.readFileSync(FALLBACK_TMP_PATH, 'utf-8'));
      if (Array.isArray(list)) return list;
    }
  } catch (err) {
    console.warn('Fallback file read failed:', err);
  }
  return [];
}

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

    const newFeedback: FeedbackItem = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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

    let savedStorage = 'Firestore Database';

    // 1. Save to Firestore if initialized
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'feedbacks'), newFeedback);
        newFeedback.id = docRef.id;
      } catch (firestoreErr) {
        console.warn('Firestore write failed, falling back to temp file storage:', firestoreErr);
        saveToFallbackFile(newFeedback);
        savedStorage = 'Temporary Storage (/tmp)';
      }
    } else {
      saveToFallbackFile(newFeedback);
      savedStorage = 'Temporary Storage (/tmp)';
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your feedback! It has been saved successfully.',
        feedbackId: newFeedback.id,
        savedTo: savedStorage,
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

export async function GET() {
  try {
    let feedbacks: FeedbackItem[] = [];

    if (db) {
      try {
        const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as FeedbackItem;
          feedbacks.push({
            ...data,
            id: docSnap.id,
          });
        });
      } catch (err) {
        console.warn('Firestore getDocs failed, checking fallback file:', err);
        feedbacks = getFromFallbackFile();
      }
    } else {
      feedbacks = getFromFallbackFile();
    }

    return NextResponse.json({
      total: feedbacks.length,
      feedbacks,
    });
  } catch (error: any) {
    console.error('Error reading feedbacks:', error);
    return NextResponse.json(
      { error: 'Failed to read feedback list.' },
      { status: 500 }
    );
  }
}
