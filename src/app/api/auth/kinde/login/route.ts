import { NextResponse } from 'next/server';

export async function GET() {
  const KINDE_ISSUER = process.env.KINDE_ISSUER;
  const CLIENT_ID = process.env.KINDE_CLIENT_ID;
  const REDIRECT = process.env.KINDE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/auth/kinde/callback`;

  if (!KINDE_ISSUER || !CLIENT_ID) {
    return NextResponse.json({ error: 'Kinde not configured' }, { status: 500 });
  }

  const scope = encodeURIComponent('openid profile email');
  const redirectUri = encodeURIComponent(REDIRECT);

  const url = `${KINDE_ISSUER.replace(/\/$/, '')}/authorize?response_type=code&client_id=${encodeURIComponent(
    CLIENT_ID,
  )}&redirect_uri=${redirectUri}&scope=${scope}`;

  return NextResponse.redirect(url);
}
