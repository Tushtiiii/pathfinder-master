import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { User } from '../../../../../lib/models';
import crypto from 'crypto';

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
  // const state = url.searchParams.get('state');

    if (!code) return NextResponse.json({ error: 'code missing' }, { status: 400 });

    const KINDE_ISSUER = process.env.KINDE_ISSUER;
  if (!KINDE_ISSUER) return NextResponse.json({ error: 'Kinde issuer not configured' }, { status: 500 });
    const TOKEN_URL = `${KINDE_ISSUER.replace(/\/$/, '')}/oauth/token`;
    const CLIENT_ID = process.env.KINDE_CLIENT_ID;
    const CLIENT_SECRET = process.env.KINDE_CLIENT_SECRET;
    const REDIRECT = process.env.KINDE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/auth/kinde/callback`;

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', REDIRECT);
    body.set('client_id', CLIENT_ID || '');
    if (CLIENT_SECRET) body.set('client_secret', CLIENT_SECRET);

    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      console.error('token error', txt);
      return NextResponse.json({ error: 'token exchange failed' }, { status: 502 });
    }

    const tokenJson = await tokenRes.json();
    const idToken = tokenJson.id_token as string;

    // decode id_token (JWT) to get user info
    const parts = idToken.split('.');
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const email = payload.email as string;
    const name = payload.name as string || '';

    // Ensure DB connection and user exists
    await connectToDatabase();
    let user = await User.findOne({ email }).exec();
    if (!user) {
      user = new User({ email, name });
      await user.save();
    }

    // Create a minimal signed session cookie (HMAC) — for demo only
    const sessionPayload = JSON.stringify({ userId: user._id.toString(), iat: Date.now() });
    const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
    const sig = crypto.createHmac('sha256', secret).update(sessionPayload).digest('hex');
    const cookieValue = Buffer.from(sessionPayload).toString('base64') + '.' + sig;

    const res = NextResponse.redirect(process.env.KINDE_POST_LOGIN_REDIRECT || '/dashboard');
    res.cookies.set({
      name: 'session',
      value: cookieValue,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error('kinde callback error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
