'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ClientMount from '@/components/ClientMount';
import { 
  BookOpen, 
  Bell, 
  BellRing, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Star,
  Filter,
  Search,
  Clock,
  MapPin,
  ExternalLink,
  Settings,
  Trash2,
  Eye,
  Share,
  Building
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'admission' | 'scholarship' | 'exam' | 'reminder' | 'update' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  timestamp: string;
  source: string;
  actionUrl?: string;
  expiresAt?: string;
  location?: string;
  metadata?: Record<string, string>;
}

const sampleNotifications: Notification[] = [
  {
    id: 1,
    title: "JEE Main Registration Reminder",
    message: "Only 5 days left to register for JEE Main 2025. Don't miss the deadline!",
    type: "reminder",
    priority: "high",
    isRead: false,
    timestamp: "2025-01-05T10:30:00Z",
    source: "Timeline Tracker",
    actionUrl: "/timeline",
    expiresAt: "2025-01-10T23:59:59Z",
    metadata: {
      "exam": "JEE Main 2025",
      "deadline": "January 10, 2025"
    }
  },
  {
    id: 2,
    title: "New Scholarship Available",
    message: "Tamil Nadu Merit Scholarship applications are now open. You meet the eligibility criteria!",
    type: "scholarship",
    priority: "high",
    isRead: false,
    timestamp: "2025-01-04T14:15:00Z",
    source: "Scholarship Alerts",
    actionUrl: "/timeline",
    location: "Tamil Nadu",
    metadata: {
      "amount": "₹50,000",
      "deadline": "February 28, 2025"
    }
  },
  {
    id: 3,
    title: "Quiz Completed Successfully",
    message: "Congratulations! You scored 85% in the Mathematics practice quiz. Keep up the great work!",
    type: "achievement",
    priority: "medium",
    isRead: true,
    timestamp: "2025-01-03T16:45:00Z",
    source: "Study Platform",
    actionUrl: "/quiz",
    metadata: {
      "score": "85%",
      "subject": "Mathematics"
    }
  },
  {
    id: 4,
    title: "College Application Update",
    message: "Your application to Anna University has been received and is under review.",
    type: "admission",
    priority: "medium",
    isRead: true,
    timestamp: "2025-01-02T11:20:00Z",
    source: "College Portal",
    location: "Chennai",
    metadata: {
      "college": "Anna University",
      "status": "Under Review"
    }
  },
  {
    id: 5,
    title: "New Study Material Added",
    message: "Advanced Physics Problem Solving videos have been added to your recommended list.",
    type: "update",
    priority: "low",
    isRead: false,
    timestamp: "2025-01-01T09:00:00Z",
    source: "Study Materials",
    actionUrl: "/study",
    metadata: {
      "subject": "Physics",
      "type": "Video Series"
    }
  },
  {
    id: 6,
    title: "NEET Registration Opens Tomorrow",
    message: "NEET UG 2025 registration will begin tomorrow at 9:00 AM. Be ready!",
    type: "exam",
    priority: "high",
    isRead: true,
    timestamp: "2024-12-31T18:30:00Z",
    source: "Exam Alerts",
    actionUrl: "/timeline",
    metadata: {
      "exam": "NEET UG 2025",
      "opens": "January 1, 2025"
    }
  },
  {
    id: 7,
    title: "Profile Completion Reminder",
    message: "Complete your profile to get personalized college and career recommendations.",
    type: "reminder",
    priority: "low",
    isRead: false,
    timestamp: "2024-12-30T12:00:00Z",
    source: "Profile System",
    actionUrl: "/profile",
    metadata: {
      "completion": "75%"
    }
  }
];

const typeIcons = {
  admission: Calendar,
  scholarship: Star,
  exam: BookOpen,
  reminder: BellRing,
  update: Info,
  achievement: CheckCircle
};

const typeColors = {
  admission: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
  scholarship: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
  exam: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' },
  reminder: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' },
  update: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'text-cyan-600' },
  achievement: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-600' }
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showRead, setShowRead] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = !selectedType || notification.type === selectedType;
    const matchesPriority = !selectedPriority || notification.priority === selectedPriority;
    const matchesRead = showRead || !notification.isRead;
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesPriority && matchesRead && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduGuide</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Settings className="h-6 w-6 text-gray-600 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  {unreadCount} Unread
                </span>
                {urgentCount > 0 && (
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {urgentCount} Urgent
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientMount>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-xl text-gray-600">Stay updated with important alerts and deadlines</p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              )}
              <Bell className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total</p>
                  <p className="text-3xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Unread</p>
                  <p className="text-3xl font-bold">{unreadCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Urgent</p>
                  <p className="text-3xl font-bold">{urgentCount}</p>
                </div>
                <BellRing className="h-8 w-8 text-orange-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">This Week</p>
                  <p className="text-3xl font-bold">{notifications.filter(n => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(n.timestamp) > weekAgo;
                  }).length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-200" />
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-4 gap-4 pt-4 border-t"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select notification type"
                  >
                    <option value="">All Types</option>
                    <option value="admission">Admissions</option>
                    <option value="scholarship">Scholarships</option>
                    <option value="exam">Exams</option>
                    <option value="reminder">Reminders</option>
                    <option value="update">Updates</option>
                    <option value="achievement">Achievements</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select priority level"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showRead}
                      onChange={(e) => setShowRead(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show read notifications</span>
                  </label>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedType('');
                      setSelectedPriority('');
                      setSearchTerm('');
                      setShowRead(true);
                    }}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => {
              const IconComponent = typeIcons[notification.type];
              const colors = typeColors[notification.type];
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 ${colors.border} ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${colors.bg}`}>
                      <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className={`text-lg font-bold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityColors[notification.priority]}`}>
                              {notification.priority.toUpperCase()}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                            <span>•</span>
                            <span>{notification.source}</span>
                            {notification.location && (
                              <>
                                <span>•</span>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{notification.location}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {notification.metadata && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {Object.entries(notification.metadata).map(([key, value]) => (
                                <span key={key} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  <strong>{key}:</strong> {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Mark as read"
                              aria-label="Mark as read"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Share notification"
                            aria-label="Share notification"
                          >
                            <Share className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete notification"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {notification.actionUrl && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            {notification.expiresAt && (
                              <span>Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
                            )}
                          </div>
                          <Link
                            href={notification.actionUrl}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <span>Take Action</span>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
          </motion.div>
        </ClientMount>
      </div>
    </div>
  );
}
