import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models';

// GET /api/profile - Get user profile
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email }).select('-passwordHash -passwordSalt');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT /api/profile - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, age, gender, class: userClass, location, state, interests, streamPreference, careerGoals, strengths, achievements } = body;

    await connectToDatabase();
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          name,
          age,
          gender,
          class: userClass,
          location,
          state,
          interests,
          streamPreference,
          careerGoals,
          strengths,
          achievements
        }
      },
      { new: true, runValidators: true }
    ).select('-passwordHash -passwordSalt');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
