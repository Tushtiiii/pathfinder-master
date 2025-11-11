import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase, default as clientPromise } from '../../../../lib/mongodb';
import { User } from '../../../../lib/models';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'email and password required' }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await User.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');

    const user = new User({ email, name, passwordHash: hash, passwordSalt: salt });
    await user.save();

    // Ensure NextAuth adapter has a corresponding user document (same _id)
    try {
      const client = await clientPromise;
      const db = client.db();
      const usersCol = db.collection('users');
      // Upsert a minimal user record using the same ObjectId so NextAuth adapter and our Mongoose user align
      await usersCol.updateOne(
        { _id: new ObjectId(user._id) },
        {
          $setOnInsert: {
            email,
            name: name || null,
            emailVerified: null,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    } catch (e) {
      console.warn('Could not sync NextAuth user record:', e);
    }

    return NextResponse.json({ ok: true, id: user._id });
  } catch (err) {
    console.error('Signup error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
