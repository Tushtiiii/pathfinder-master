"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  BookOpen,
  Calendar,
  Bell,
  Star,
  TrendingUp,
  AlertCircle,
  Users,
  Award,
  Target,
  Book,
  School,
  Trophy,
  ChevronRight,
  ArrowRight,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface DashboardStats {
  totalQuizzes: number;
  averageScore: number;
  savedColleges: number;
  upcomingDeadlines: number;
  unreadNotifications: number;
  studyHours: number;
  completionRate: number;
  rank: number;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface RecentActivity {
  id: number;
  type: 'quiz' | 'college' | 'material' | 'reminder';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

interface SavedCollege {
  _id: string;
  name: string;
  location: string;
  type: string;
  rating?: number;
}

interface SavedMaterial {
  materialId: number;
  savedAt: string;
}

interface QuizResult {
  _id: string;
  answers: any[];
  results?: any;
  streamRecommendation?: string;
  careerRecommendations?: string[];
  createdAt: string;
}

const initialStats: DashboardStats = {
  totalQuizzes: 0,
  averageScore: 0,
  savedColleges: 0,
  upcomingDeadlines: 3,
  unreadNotifications: 5,
  studyHours: 0,
  completionRate: 0,
  rank: 0
};

const quickActions: QuickAction[] = [
  {
    title: "Take Aptitude Quiz",
    description: "Discover your strengths and career paths",
    href: "/quiz",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    title: "Explore Colleges",
    description: "Find the perfect institution for you",
    href: "/colleges",
    icon: School,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Career Paths",
    description: "Explore different career opportunities",
    href: "/careers",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    title: "Timeline Tracker",
    description: "Stay on top of important deadlines",
    href: "/timeline",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    title: "Study Materials",
    description: "Access curated learning resources",
    href: "/study",
    icon: Book,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  },
  {
    title: "View Profile",
    description: "Manage your personal information",
    href: "/profile",
    icon: Users,
    color: "text-pink-600",
    bgColor: "bg-pink-100"
  }
];



const upcomingEvents = [
  {
    id: 1,
    title: 'JEE Main Registration',
    date: '2025-01-10',
    daysLeft: 5,
    type: 'exam'
  },
  {
    id: 2,
    title: 'NEET Application',
    date: '2025-02-01',
    daysLeft: 27,
    type: 'exam'
  },
  {
    id: 3,
    title: 'Tamil Nadu Scholarship',
    date: '2025-02-28',
    daysLeft: 54,
    type: 'scholarship'
  }
];

export default function DashboardClient() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(initialStats);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [savedMaterials, setSavedMaterials] = useState<SavedMaterial[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getQuizScorePercentage = (quiz: QuizResult) => {
    if (!quiz?.results) {
      return null;
    }

    const topScore = typeof quiz.results.topCategoryScore === 'number' ? quiz.results.topCategoryScore : null;
    const totalQuestions = typeof quiz.results.totalQuestions === 'number' ? quiz.results.totalQuestions : null;

    if (topScore === null || totalQuestions === null || totalQuestions <= 0) {
      return null;
    }

    return Math.round((topScore / totalQuestions) * 100);
  };

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard resources in parallel with shared request options
      const requestOptions: RequestInit = {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      };

      const [collegesRes, materialsRes, quizRes] = await Promise.all([
        fetch('/api/saved-colleges', requestOptions),
        fetch('/api/saved-materials', requestOptions),
        fetch('/api/quiz-results', requestOptions)
      ]);

      const [collegesData, materialsData, quizData] = await Promise.all([
        collegesRes.ok ? collegesRes.json() : collegesRes.json().then((data) => {
          console.error('Failed to load saved colleges:', data);
          return [];
        }).catch((error) => {
          console.error('Failed to parse saved colleges response:', error);
          return [];
        }),
        materialsRes.ok ? materialsRes.json() : materialsRes.json().then((data) => {
          console.error('Failed to load saved materials:', data);
          return [];
        }).catch((error) => {
          console.error('Failed to parse saved materials response:', error);
          return [];
        }),
        quizRes.ok ? quizRes.json() : quizRes.json().then((data) => {
          console.error('Failed to load quiz results:', data);
          return [];
        }).catch((error) => {
          console.error('Failed to parse quiz results response:', error);
          return [];
        })
      ]);

      if (Array.isArray(collegesData)) {
        setSavedColleges(collegesData);
      }

      if (Array.isArray(materialsData)) {
        setSavedMaterials(materialsData);
      }

      if (Array.isArray(quizData)) {
        setQuizResults(quizData);
      }

      // Calculate stats
      const totalQuizzes = Array.isArray(quizData) ? quizData.length : 0;
      let avgScore = 0;

      if (Array.isArray(quizData) && quizData.length > 0) {
        const scoreSum = quizData.reduce((sum: number, quiz: QuizResult) => {
          const quizScore = getQuizScorePercentage(quiz);
          return sum + (quizScore ?? 0);
        }, 0);

        avgScore = Math.round(scoreSum / quizData.length);
      }
      
      setStats({
        totalQuizzes,
        averageScore: avgScore,
        savedColleges: Array.isArray(collegesData) ? collegesData.length : 0,
        upcomingDeadlines: 3,
        unreadNotifications: 5,
        studyHours: Array.isArray(materialsData) ? materialsData.length * 2 : 0,
        completionRate: totalQuizzes > 0 ? 85 : 50,
        rank: totalQuizzes > 0 ? 1247 : 0
      });

      // Build recent activities from real data
      const activities: RecentActivity[] = [];
      let activityId = 1;

      // Add quiz activities
      if (Array.isArray(quizData)) {
        quizData.slice(0, 2).forEach(quiz => {
          const quizScore = getQuizScorePercentage(quiz);
          activities.push({
            id: activityId++,
            type: 'quiz',
            title: 'Aptitude Quiz Completed',
            description: quiz.streamRecommendation ? `Recommended: ${quiz.streamRecommendation}` : 'Quiz completed successfully',
            timestamp: formatTimeAgo(new Date(quiz.createdAt)),
            ...(quizScore !== null ? { score: quizScore } : {})
          });
        });
      }

      // Add college activities
      if (Array.isArray(collegesData)) {
        collegesData.slice(0, 2).forEach(college => {
          activities.push({
            id: activityId++,
            type: 'college',
            title: college.name,
            description: `Saved to your college list`,
            timestamp: 'Recently'
          });
        });
      }

      // Add material activities
      if (Array.isArray(materialsData)) {
        materialsData.slice(0, 2).forEach(material => {
          activities.push({
            id: activityId++,
            type: 'material',
            title: 'Study Material',
            description: 'Saved to your materials',
            timestamp: formatTimeAgo(new Date(material.savedAt))
          });
        });
      }

      setRecentActivities(activities.slice(0, 4));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduGuide</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/notifications" className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.unreadNotifications}
                  </span>
                )}
              </Link>
              <Link href="/profile">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  You
                </div>
              </Link>
              <button onClick={() => {
                if (window.confirm('Are you sure you want to log out?')) {
                  signOut({ callbackUrl: '/' });
                }
              }} className="p-2 rounded-full hover:bg-gray-100">
                <LogOut className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
            <p className="text-gray-600">Here&apos;s what&apos;s happening with your education journey.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
              <div className="text-sm text-gray-600">Quizzes Taken</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-2xl font-bold text-purple-600">{stats.savedColleges}</div>
              <div className="text-sm text-gray-600">Saved Colleges</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-2xl font-bold text-orange-600">{stats.upcomingDeadlines}</div>
              <div className="text-sm text-gray-600">Deadlines</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-2xl font-bold text-red-600">{stats.unreadNotifications}</div>
              <div className="text-sm text-gray-600">Alerts</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-2xl font-bold text-indigo-600">{stats.studyHours}</div>
              <div className="text-sm text-gray-600">Study Hours</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-2xl font-bold text-pink-600">#{stats.rank}</div>
              <div className="text-sm text-gray-600">Rank</div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Link href={action.href}>
                          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-blue-200">
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-lg ${action.bgColor}`}>
                                <IconComponent className={`h-6 w-6 ${action.color}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                                <p className="text-gray-600 text-sm">{action.description}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <Link href="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
                <div className="bg-white rounded-xl shadow-lg">
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      Loading activities...
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No recent activity. Start exploring colleges, take a quiz, or save study materials!
                    </div>
                  ) : (
                    recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`p-6 ${index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {activity.type === 'quiz' && <Target className="h-5 w-5 text-purple-600" />}
                          {activity.type === 'college' && <School className="h-5 w-5 text-blue-600" />}
                          {activity.type === 'material' && <Book className="h-5 w-5 text-green-600" />}
                          {activity.type === 'reminder' && <Bell className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">{activity.title}</h3>
                            <span className="text-sm text-gray-500">{activity.timestamp}</span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                          {activity.score && (
                            <div className="mt-2">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                Score: {activity.score}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )))}
                </div>
              </section>
              {/* Saved Colleges */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Colleges</h2>
                  <Link href="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
                <div className="bg-white rounded-xl shadow-lg">
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      Loading colleges...
                    </div>
                  ) : savedColleges.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No saved colleges yet. <Link href="/colleges" className="text-blue-600 hover:underline">Browse colleges</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {savedColleges.slice(0, 3).map((college, index) => (
                        <motion.div
                          key={college._id || college.name || `college-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{college.name}</h3>
                              <p className="text-sm text-gray-600">{college.location}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {college.rating && (
                                <div className="flex items-center text-sm">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                                  <span>{college.rating}</span>
                                </div>
                              )}
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {college.type}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Saved Study Materials */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Study Materials</h2>
                  <Link href="/study" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  {isLoading ? (
                    <div className="text-center text-gray-500">
                      Loading materials...
                    </div>
                  ) : savedMaterials.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No saved materials yet. <Link href="/study" className="text-blue-600 hover:underline">Explore resources</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Saved Resources</span>
                        <span className="font-bold text-blue-600">{savedMaterials.length}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        You have saved {savedMaterials.length} study {savedMaterials.length === 1 ? 'material' : 'materials'}
                      </p>
                      <Link href="/study" className="block w-full text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        View All Materials
                      </Link>
                    </div>
                  )}
                </div>
              </section>

              {/* Quiz Results Summary */}
              {quizResults.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Quiz Results</h2>
                    <Link href="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View all
                    </Link>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Quizzes</span>
                        <span className="font-bold text-purple-600">{quizResults.length}</span>
                      </div>
                      {quizResults[0]?.results?.summary && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">Latest Summary:</p>
                          <p className="text-sm text-gray-700">{quizResults[0].results.summary}</p>
                        </div>
                      )}
                      {quizResults[0]?.streamRecommendation && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">Latest Recommendation:</p>
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {quizResults[0].streamRecommendation}
                          </span>
                        </div>
                      )}
                      {quizResults[0]?.careerRecommendations && quizResults[0].careerRecommendations.length > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">Suggested Careers:</p>
                          <div className="flex flex-wrap gap-2">
                            {quizResults[0].careerRecommendations.slice(0, 3).map((career, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {career}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <Link href="/quiz" className="block w-full text-center bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium mt-4">
                        Retake Quiz
                      </Link>
                    </div>
                  </div>
                </section>
              )}            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Urgent Deadlines */}
              <section>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      Urgent Deadlines
                    </h3>
                    <Link href="/timeline" className="text-blue-600 hover:text-blue-700 text-sm">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${event.daysLeft <= 7 ? 'bg-red-100 text-red-700' :
                            event.daysLeft <= 30 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                            {event.daysLeft}d left
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs">{event.date}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Progress Overview */}
              <section>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
                    Progress Overview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Profile Completion</span>
                        <span className="font-medium">{stats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.completionRate}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Quiz Performance</span>
                        <span className="font-medium">{stats.averageScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.averageScore}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Overall Rank</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-gray-900">#{stats.rank}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Tips */}
              <section>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Today&apos;s Tip
                  </h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Complete your aptitude quiz to get personalized college and career recommendations
                    tailored to your interests and strengths.
                  </p>
                  <Link href="/quiz">
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center">
                      Take Quiz <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
