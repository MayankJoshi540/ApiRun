import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FeedbackItem {
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

const FEEDBACK_FILE_PATH = path.join(process.cwd(), 'feedbacks.json');

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

    // Read existing feedbacks from local machine file
    let feedbacks: FeedbackItem[] = [];
    if (fs.existsSync(FEEDBACK_FILE_PATH)) {
      try {
        const fileData = fs.readFileSync(FEEDBACK_FILE_PATH, 'utf-8');
        feedbacks = JSON.parse(fileData);
        if (!Array.isArray(feedbacks)) feedbacks = [];
      } catch (err) {
        console.warn('Could not parse existing feedbacks.json, initializing new array', err);
        feedbacks = [];
      }
    }

    // Append new feedback at the beginning (newest first)
    feedbacks.unshift(newFeedback);

    // Save directly to local machine filesystem
    fs.writeFileSync(FEEDBACK_FILE_PATH, JSON.stringify(feedbacks, null, 2), 'utf-8');

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your feedback! It has been saved successfully.',
        feedbackId: newFeedback.id,
        savedTo: FEEDBACK_FILE_PATH,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving feedback to local filesystem:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save feedback on server.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    let feedbacks: FeedbackItem[] = [];
    if (fs.existsSync(FEEDBACK_FILE_PATH)) {
      const fileData = fs.readFileSync(FEEDBACK_FILE_PATH, 'utf-8');
      feedbacks = JSON.parse(fileData);
    }

    return NextResponse.json({
      total: feedbacks.length,
      feedbacks,
      filePath: FEEDBACK_FILE_PATH,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read feedback list.' },
      { status: 500 }
    );
  }
}
