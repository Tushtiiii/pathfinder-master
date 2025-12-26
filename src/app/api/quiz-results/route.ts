import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '../../../lib/mongodb';
import { User, QuizResult } from '../../../lib/models';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).select('_id');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const quizResults = await QuizResult.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(quizResults);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz results' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { answers, results, streamRecommendation, careerRecommendations } = await req.json();

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: 'answers array is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).select('_id');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const created = await QuizResult.create({
      userId: user._id,
      answers,
      results: results ?? {},
      streamRecommendation: streamRecommendation ?? null,
      careerRecommendations: Array.isArray(careerRecommendations) ? careerRecommendations : [],
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error storing quiz result:', error);
    return NextResponse.json({ error: 'Failed to store quiz result' }, { status: 500 });
  }
}
