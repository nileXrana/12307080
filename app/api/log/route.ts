import { NextResponse } from 'next/server';

const ACCESS_TOKEN = process.env.LOG_ACCESS_TOKEN || '';

type Stack = 'backend' | 'frontend';
type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type Package =
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain'
  | 'handler' | 'repository' | 'route' | 'service'
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  | 'auth' | 'config' | 'middleware' | 'utils';

interface LogRequestBody {
  stack: Stack;
  level: Level;
  pkg: Package;
  message: string;
}

// Forward the request to the upstream logging service and return its response

function isLogRequestBody(value: unknown): value is LogRequestBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.stack === 'backend' || candidate.stack === 'frontend') &&
    (candidate.level === 'debug' || candidate.level === 'info' || candidate.level === 'warn' || candidate.level === 'error' || candidate.level === 'fatal') &&
    typeof candidate.pkg === 'string' &&
    typeof candidate.message === 'string'
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isLogRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid log request body.' },
        { status: 400 }
      );
    }

    // Fail early if token is missing
    if (!ACCESS_TOKEN) {
      console.error('Missing LOG_ACCESS_TOKEN in environment');
      return NextResponse.json({ error: 'Missing LOG_ACCESS_TOKEN env var' }, { status: 500 });
    }

    // Forward to upstream logging service
    const upstream = await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack: body.stack,
        level: body.level,
        package: body.pkg,
        message: body.message,
      }),
    });

    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const upstreamBody = await upstream.json();
      return NextResponse.json(upstreamBody, { status: upstream.status });
    }

    const upstreamText = await upstream.text();
    return new NextResponse(upstreamText, {
      status: upstream.status,
      headers: { 'Content-Type': contentType || 'text/plain' },
    });
  } catch (error) {
    console.error('Log API route failed:', error);

    return NextResponse.json(
      { error: 'Failed to forward log request.' },
      { status: 500 }
    );
  }
}