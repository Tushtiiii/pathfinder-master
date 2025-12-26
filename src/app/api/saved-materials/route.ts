import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { User } from '../../../lib/models';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user.savedMaterials || []);
  } catch (error) {
    console.error('Failed to fetch saved materials:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { materialId } = await req.json();
    if (!materialId) {
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const savedMaterials = user.savedMaterials || [];
    const isSaved = savedMaterials.some((m: any) => m.materialId === materialId);

    if (isSaved) {
      // Unsave
      await User.findOneAndUpdate(
        { email: session.user.email },
        { $pull: { savedMaterials: { materialId } } }
      );
      return NextResponse.json({ message: 'Material unsaved successfully' });
    } else {
      // Save
      await User.findOneAndUpdate(
        { email: session.user.email },
        { $addToSet: { savedMaterials: { materialId, savedAt: new Date() } } }
      );
      return NextResponse.json({ message: 'Material saved successfully' });
    }
  } catch (error) {
    console.error('Failed to save material:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
