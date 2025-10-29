'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  options: string[];
  category: 'logical' | 'creative' | 'analytical' | 'social' | 'practical';
}

const questions: Question[] = [
  {
    id: 1,
    question: "What type of activities do you enjoy most?",
    options: [
      "Solving puzzles and mathematical problems",
      "Drawing, writing, or creating art",
      "Working with people and helping others",
      "Building or fixing things with your hands"
    ],
    category: 'analytical'
  },
  {
    id: 2,
    question: "In a group project, you usually:",
    options: [
      "Take charge and organize everyone",
      "Come up with creative ideas and solutions",
      "Research and analyze the information",
      "Support others and maintain team harmony"
    ],
    category: 'social'
  },
  {
    id: 3,
    question: "Which subject interests you the most?",
    options: [
      "Mathematics and Physics",
      "Literature and Arts",
      "History and Social Studies",
      "Biology and Chemistry"
    ],
    category: 'logical'
  },
  {
    id: 4,
    question: "Your ideal work environment would be:",
    options: [
      "A quiet office where you can focus",
      "A creative studio with flexible hours",
      "A collaborative space with team interaction",
      "A hands-on workshop or laboratory"
    ],
    category: 'practical'
  },
  {
    id: 5,
    question: "When facing a problem, you tend to:",
    options: [
      "Break it down logically step by step",
      "Think outside the box for unique solutions",
      "Discuss it with others to get different perspectives",
      "Try different approaches until something works"
    ],
    category: 'analytical'
  },
  {
    id: 6,
    question: "What motivates you the most?",
    options: [
      "Achieving personal goals and recognition",
      "Expressing yourself creatively",
      "Making a positive impact on society",
      "Learning new skills and knowledge"
    ],
    category: 'creative'
  },
  {
    id: 7,
    question: "In your free time, you prefer:",
    options: [
      "Reading books or solving brain teasers",
      "Painting, music, or creative hobbies",
      "Volunteering or social activities",
      "Sports or outdoor activities"
    ],
    category: 'social'
  },
  {
    id: 8,
    question: "Which career aspect is most important to you?",
    options: [
      "Job security and stable income",
      "Creative freedom and flexibility",
      "Helping others and making a difference",
      "Continuous learning and growth"
    ],
    category: 'practical'
  }
];

const streamRecommendations = {
  analytical: {
    stream: "Science (PCM)",
    careers: ["Engineering", "Data Science", "Research", "Architecture"],
    description: "You have strong analytical and logical thinking skills, perfect for technical fields."
  },
  creative: {
    stream: "Arts/Commerce",
    careers: ["Design", "Marketing", "Media", "Entrepreneurship"],
    description: "Your creative mindset makes you ideal for innovative and artistic careers."
  },
  social: {
    stream: "Arts/Commerce",
    careers: ["Psychology", "Social Work", "Teaching", "Management"],
    description: "Your people skills and empathy make you great for service-oriented careers."
  },
  logical: {
    stream: "Science (PCM/PCB)",
    careers: ["Medicine", "Engineering", "Research", "Technology"],
    description: "Your logical reasoning abilities suit you well for scientific and technical fields."
  },
  practical: {
    stream: "Commerce/Vocational",
    careers: ["Business", "Finance", "Operations", "Skilled Trades"],
    description: "Your practical approach makes you perfect for business and hands-on careers."
  }
};

export default function AptitudeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed
        setShowResults(true);
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, number> = {
      logical: 0,
      creative: 0,
      analytical: 0,
      social: 0,
      practical: 0
    };

    questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        categoryScores[question.category]++;
      }
    });

    const topCategory = Object.keys(categoryScores).reduce((a, b) => 
      categoryScores[a] > categoryScores[b] ? a : b
    ) as keyof typeof streamRecommendations;

    return streamRecommendations[topCategory];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const result = calculateResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">EduGuide</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Quiz Complete! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Based on your responses, here&apos;s your personalized recommendation:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recommended Stream: <span className="text-blue-600">{result.stream}</span>
            </h2>
            <p className="text-gray-700 mb-6">{result.description}</p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Career Opportunities:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {result.careers.map((career, index) => (
                <div key={index} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-center font-medium">
                  {career}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/colleges" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Find Colleges for This Stream
              </Link>
              <Link 
                href="/careers" 
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
              >
                Explore Career Paths
              </Link>
              <Link 
                href="/quiz" 
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
              >
                Retake Quiz
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Research colleges offering your recommended stream</li>
              <li>Check admission requirements and cut-offs</li>
              <li>Set up timeline notifications for important dates</li>
              <li>Explore scholarship opportunities</li>
              <li>Connect with career counselors for detailed guidance</li>
            </ol>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduGuide</span>
            </Link>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-purple-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswer === index
                      ? 'border-purple-600 bg-purple-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
