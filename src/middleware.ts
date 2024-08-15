import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { parse, serialize } from 'cookie';

const COOKIE_NAME = 'client_id';

export function middleware(req: NextRequest) {
  console.log('middleware');
  const res = NextResponse.next();
  const cookies = parse(req.headers.get('cookie') ?? '');

  // Check if client_id cookie exists
  if (!cookies[COOKIE_NAME]) {
    const clientId = nanoid();
    const cookie = serialize(COOKIE_NAME, clientId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    res.headers.append('Set-Cookie', cookie);
  }

  return res;
}

export const config = {
  matcher: '/',
};
