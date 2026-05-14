import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ACCESS_TOKEN = process.env.LOG_ACCESS_TOKEN || '';

export async function GET(request: Request) {
  try {
    if (!ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Missing LOG_ACCESS_TOKEN env var' }, { status: 500 });
    }

    const incomingUrl = new URL(request.url);
    const limit = incomingUrl.searchParams.get('limit');
    const page = incomingUrl.searchParams.get('page');
    const notificationType = incomingUrl.searchParams.get('notification_type');

    const upstreamUrl = new URL('http://4.224.186.213/evaluation-service/notifications');
    if (limit) upstreamUrl.searchParams.set('limit', limit);
    if (page) upstreamUrl.searchParams.set('page', page);
    if (notificationType) upstreamUrl.searchParams.set('notification_type', notificationType);

    const upstream = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      cache: 'no-store',
    });

    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await upstream.json();
      return NextResponse.json(body, { status: upstream.status });
    }

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'Content-Type': contentType || 'text/plain' },
    });
  } catch (error) {
    console.error('Notifications API route failed:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}