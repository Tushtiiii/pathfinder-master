import { NextResponse } from 'next/server';

// Deprecated legacy login route — removed in favor of NextAuth and Kinde/OAuth flow.
export async function POST() {
	return NextResponse.json({ error: 'deprecated' }, { status: 410 });
}

export async function GET() {
	return NextResponse.json({ error: 'deprecated' }, { status: 410 });
}
