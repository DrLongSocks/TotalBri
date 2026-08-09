import { NextResponse, type NextRequest } from 'next/server';
import { get } from '@vercel/blob';
import { requireAdminSession } from '@/lib/auth/require-admin';
import { serverEnv } from '@/lib/env.server';

// Private blobs aren't directly browsable — they require an authenticated
// fetch through a server route (see Vercel's private-storage quickstart).
// This is that route: admin-gated, then proxies the PDF through.
export async function GET(request: NextRequest) {
  await requireAdminSession();

  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  const result = await get(url, { access: 'private', token: serverEnv.BLOB_READ_WRITE_TOKEN });
  if (result?.statusCode !== 200) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
