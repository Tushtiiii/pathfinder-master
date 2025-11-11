"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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

const sampleStats: DashboardStats = {
  totalQuizzes: 12,
  averageScore: 78,
  savedColleges: 8,
  upcomingDeadlines: 3,
  unreadNotifications: 5,
  studyHours: 45,
  completionRate: 85,
  rank: 1247
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

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    type: 'quiz',
    title: 'Mathematics Aptitude Quiz',
    description: 'Completed with 85% score',
    timestamp: '2 hours ago',
    score: 85
  },
  {
    id: 2,
    type: 'college',
    title: 'Anna University',
    description: 'Added to saved colleges',
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    type: 'material',
    title: 'Physics Problem Solving',
    description: 'Started watching video series',
    timestamp: '1 day ago'
  },
  {
    id: 4,
    type: 'reminder',
    title: 'JEE Main Registration',
    description: 'Reminder set for deadline',
    timestamp: '2 days ago'
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
  const [stats] = useState(sampleStats);

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
                  {recentActivities.map((activity, index) => (
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
                  ))}
                </div>
              </section>
            </div>

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
