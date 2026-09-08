import { NextRequest, NextResponse } from 'next/server';
import { runChallengeTests } from '@/utils/challengeRunner';
import { challenges } from '@/data/challenges';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, code, language, serverUrl, isLocalServerMode } = body;

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json(
        { error: `Challenge with ID "${challengeId}" not found.` },
        { status: 404 }
      );
    }

    const output = await runChallengeTests({
      challenge,
      code,
      language: language || 'nodejs',
      serverUrl,
      isLocalServerMode: !!isLocalServerMode,
    });

    return NextResponse.json(output, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to execute test suite on server.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    engine: 'APIRun Next.js Serverless Execution Runner v1.0',
    timestamp: new Date().toISOString(),
  });
}
