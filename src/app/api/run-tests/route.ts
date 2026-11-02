import { NextRequest, NextResponse } from 'next/server';
import { executeInNodeVM } from '@/lib/serverRunner';
import { challenges } from '@/data/challenges';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, code, language, timeoutMs } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Missing challengeId parameter.' },
        { status: 400 }
      );
    }

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json(
        { error: `Challenge with ID "${challengeId}" not found.` },
        { status: 404 }
      );
    }

    if (typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing code payload.' },
        { status: 400 }
      );
    }

    // Execute within Node.js Isolated VM Sandbox
    const output = await executeInNodeVM({
      challenge,
      code,
      language: language || 'nodejs',
      timeoutMs: typeof timeoutMs === 'number' ? timeoutMs : 3000,
    });

    return NextResponse.json(output, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to execute test suite in server sandbox.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    engine: 'APIRun Node.js VM Isolated Execution Runner v2.0',
    timestamp: new Date().toISOString(),
  });
}
