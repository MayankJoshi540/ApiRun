import { NextRequest, NextResponse } from 'next/server';
import { executeSingleRequest } from '@/lib/serverRunner';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, method, endpoint, payload, headers, timeoutMs } = body;

    if (typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing code payload.' },
        { status: 400 }
      );
    }

    if (!endpoint || typeof endpoint !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid endpoint path.' },
        { status: 400 }
      );
    }

    const output = await executeSingleRequest({
      code,
      language: language || 'nodejs',
      method: (method || 'GET').toUpperCase(),
      endpoint: endpoint.trim().startsWith('/') ? endpoint.trim() : `/${endpoint.trim()}`,
      body: payload,
      headers: headers || {},
      timeoutMs: typeof timeoutMs === 'number' ? timeoutMs : 3000,
    });

    return NextResponse.json(output, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 500, 
        statusText: 'Internal Server Error',
        error: error?.message || 'Failed to execute custom request in sandbox.',
        data: { error: error?.message || 'Sandbox error' },
        headers: {},
        durationMs: 1,
        logs: []
      },
      { status: 500 }
    );
  }
}
