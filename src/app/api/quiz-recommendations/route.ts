import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User, QuizResult } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    const { answers, questions } = await req.json();

    if (!answers || !questions) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Prepare prompt for AI
    const quizSummary = questions.map((q: any, index: number) => {
      return `Q${index + 1}: ${q.question}\nAnswer: ${q.options[answers[index]]}\nCategory: ${q.category}`;
    }).join('\n\n');

    const prompt = `Based on the following aptitude quiz results, provide personalized recommendations for an Indian high school student:

${quizSummary}

Please provide:
1. Recommended stream (Science PCM/PCB, Commerce, Arts, or Vocational)
2. 5-7 specific career paths that match their aptitude
3. 3-5 specific Indian colleges/universities that would be best suited
4. A brief personality assessment (2-3 sentences)
5. Key strengths identified from the quiz

Format the response as JSON with the following structure:
{
  "stream": "recommended stream",
  "careers": ["career1", "career2", ...],
  "colleges": ["college1", "college2", ...],
  "assessment": "personality assessment text",
  "strengths": ["strength1", "strength2", ...]
}`;

    // Use Groq API
    const apiKey = process.env.GROQ_API_KEY || process.env.AI_API_KEY;
    
    if (!apiKey) {
      // Fallback to rule-based recommendations if no API key
      return getFallbackRecommendations(answers, questions);
    }

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert Indian education counselor who provides personalized career and college recommendations based on aptitude tests. You have deep knowledge of Indian colleges, universities, entrance exams, and career paths.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || '';
    
    if (!aiResponse) {
      return getFallbackRecommendations(answers, questions);
    }

    console.log('AI Response:', aiResponse);
    
    // Parse AI response
    let recommendations;
    try {
      // Try to extract JSON from markdown code blocks if present
      let jsonText = aiResponse;
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      
      recommendations = JSON.parse(jsonText);
      
      // Validate the response has required fields
      if (!recommendations.stream || !recommendations.careers || !recommendations.colleges) {
        console.error('Invalid AI response structure:', recommendations);
        return getFallbackRecommendations(answers, questions);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', aiResponse);
      // If AI doesn't return valid JSON, extract from text
      recommendations = parseAITextResponse(aiResponse);
    }

    // Save quiz results to database if user is logged in
    try {
      const session = await getServerSession();
      if (session && session.user?.email) {
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        
        if (user) {
          await QuizResult.create({
            userId: user._id,
            answers,
            results: recommendations,
            streamRecommendation: recommendations.stream,
            careerRecommendations: recommendations.careers
          });
        }
      }
    } catch (dbError) {
      console.error('Error saving quiz results:', dbError);
      // Don't fail the request if DB save fails
    }

    return NextResponse.json(recommendations);

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: (error as Error).message },
      { status: 500 }
    );
  }
}

function getFallbackRecommendations(answers: number[], questions: any[]) {
  const categoryScores: Record<string, number> = {
    logical: 0,
    creative: 0,
    analytical: 0,
    social: 0,
    practical: 0
  };

  questions.forEach((question: any, index: number) => {
    if (answers[index] !== undefined) {
      categoryScores[question.category]++;
    }
  });

  const topCategory = Object.keys(categoryScores).reduce((a, b) =>
    categoryScores[a] > categoryScores[b] ? a : b
  );

  const recommendations: Record<string, any> = {
    analytical: {
      stream: "Science (PCM)",
      careers: ["Software Engineer", "Data Scientist", "Mechanical Engineer", "Civil Engineer", "Robotics Engineer", "Research Scientist"],
      colleges: ["IIT Delhi", "IIT Bombay", "BITS Pilani", "NIT Trichy", "IIIT Hyderabad"],
      assessment: "You have strong analytical and problem-solving skills. Your ability to break down complex problems and think logically makes you well-suited for technical and engineering fields.",
      strengths: ["Logical Thinking", "Problem Solving", "Analytical Skills", "Attention to Detail"]
    },
    creative: {
      stream: "Arts/Design",
      careers: ["Graphic Designer", "UI/UX Designer", "Content Creator", "Marketing Manager", "Architect", "Fashion Designer"],
      colleges: ["NID Ahmedabad", "NIFT Delhi", "Pearl Academy", "MIT Institute of Design", "Symbiosis Institute of Design"],
      assessment: "You have a creative and innovative mindset. Your ability to think outside the box and visualize unique solutions makes you ideal for creative industries.",
      strengths: ["Creative Thinking", "Innovation", "Visual Design", "Artistic Expression"]
    },
    social: {
      stream: "Arts/Commerce",
      careers: ["Psychologist", "Social Worker", "Teacher", "HR Manager", "Counselor", "NGO Manager"],
      colleges: ["Delhi University", "Tata Institute of Social Sciences", "Jamia Millia Islamia", "Christ University", "Fergusson College"],
      assessment: "You have excellent interpersonal skills and empathy. Your ability to understand and connect with people makes you perfect for service-oriented and people-focused careers.",
      strengths: ["Communication", "Empathy", "Leadership", "Team Collaboration"]
    },
    logical: {
      stream: "Science (PCM/PCB)",
      careers: ["Doctor", "Biotechnology Specialist", "Research Scientist", "Pharmaceutical Scientist", "Forensic Scientist"],
      colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER Puducherry", "IIT Bombay", "IISc Bangalore"],
      assessment: "You possess strong logical reasoning and scientific thinking abilities. Your methodical approach and curiosity about how things work suit you well for medical and scientific fields.",
      strengths: ["Logical Reasoning", "Scientific Thinking", "Research Skills", "Critical Analysis"]
    },
    practical: {
      stream: "Commerce/Vocational",
      careers: ["Business Analyst", "Financial Advisor", "Entrepreneur", "Operations Manager", "Chartered Accountant"],
      colleges: ["Shri Ram College of Commerce", "St. Xavier's College Mumbai", "Loyola College Chennai", "IIM Ahmedabad (after graduation)", "ISB Hyderabad (after graduation)"],
      assessment: "You have a practical and results-oriented approach. Your ability to apply knowledge in real-world situations and focus on tangible outcomes makes you ideal for business and finance careers.",
      strengths: ["Practical Thinking", "Business Acumen", "Decision Making", "Goal Orientation"]
    }
  };

  return NextResponse.json(recommendations[topCategory] || recommendations.analytical);
}

function parseAITextResponse(text: string) {
  // Basic parsing if AI returns text instead of JSON
  return {
    stream: extractSection(text, 'stream'),
    careers: extractList(text, 'career'),
    colleges: extractList(text, 'college'),
    assessment: extractSection(text, 'assessment'),
    strengths: extractList(text, 'strength')
  };
}

function extractSection(text: string, keyword: string): string {
  const regex = new RegExp(`${keyword}[:\\s]+([^\\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractList(text: string, keyword: string): string[] {
  const lines = text.split('\n');
  const items: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes(keyword)) {
      inSection = true;
      continue;
    }
    if (inSection && (line.match(/^\d+\./) || line.match(/^[-•]/))) {
      items.push(line.replace(/^\d+\./, '').replace(/^[-•]/, '').trim());
    }
    if (inSection && items.length > 0 && line.trim() === '') {
      break;
    }
  }

  return items.slice(0, 7);
}
