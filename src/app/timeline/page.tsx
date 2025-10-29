'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ClientMount from '@/components/ClientMount';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Bell, 
  Filter,
  MapPin,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Star,
  Bookmark,
  Search,
  Building
} from 'lucide-react';
import Link from 'next/link';

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  type: 'admission' | 'scholarship' | 'exam' | 'counseling';
  startDate: string;
  endDate?: string;
  institution: string;
  location: string;
  state: string;
  url?: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  eligibility: string[];
  applicationFee?: number;
  daysLeft: number;
}

const sampleEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "JEE Main 2025 Registration",
    description: "Joint Entrance Examination for admission to NITs, IIITs, and other centrally funded technical institutions",
    type: "exam",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    institution: "National Testing Agency (NTA)",
    location: "Online",
    state: "All India",
    url: "https://jeemain.nta.nic.in",
    isActive: true,
    priority: "high",
    eligibility: ["12th pass with PCM", "Minimum 75% marks"],
    applicationFee: 650,
    daysLeft: 15
  },
  {
    id: 2,
    title: "NEET UG 2025 Application",
    description: "National Eligibility cum Entrance Test for undergraduate medical courses",
    type: "exam",
    startDate: "2025-02-01",
    endDate: "2025-03-01",
    institution: "National Testing Agency (NTA)",
    location: "Various Centers",
    state: "All India",
    url: "https://neet.nta.nic.in",
    isActive: true,
    priority: "high",
    eligibility: ["12th pass with PCB", "Minimum age 17 years"],
    applicationFee: 1600,
    daysLeft: 32
  },
  {
    id: 3,
    title: "Tamil Nadu State Scholarship",
    description: "Merit-based scholarship for students from Tamil Nadu pursuing higher education",
    type: "scholarship",
    startDate: "2025-01-10",
    endDate: "2025-02-28",
    institution: "Government of Tamil Nadu",
    location: "Tamil Nadu",
    state: "Tamil Nadu",
    url: "https://scholarship.tn.gov.in",
    isActive: true,
    priority: "medium",
    eligibility: ["Domicile of Tamil Nadu", "Family income < 2.5 LPA"],
    daysLeft: 55
  },
  {
    id: 4,
    title: "DU Admission 2025",
    description: "Delhi University undergraduate admissions through CUET scores",
    type: "admission",
    startDate: "2025-04-01",
    endDate: "2025-05-15",
    institution: "University of Delhi",
    location: "Delhi",
    state: "Delhi",
    url: "https://du.ac.in",
    isActive: true,
    priority: "medium",
    eligibility: ["CUET qualified", "12th pass"],
    daysLeft: 120
  },
  {
    id: 5,
    title: "Anna University Counseling",
    description: "Engineering counseling for Tamil Nadu state quota seats",
    type: "counseling",
    startDate: "2025-06-15",
    endDate: "2025-07-15",
    institution: "Anna University",
    location: "Chennai",
    state: "Tamil Nadu",
    isActive: true,
    priority: "high",
    eligibility: ["TNEA qualified", "Tamil Nadu domicile"],
    daysLeft: 192
  }
];

const typeColors = {
  admission: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  scholarship: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  exam: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  counseling: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' }
};

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-700'
};

export default function TimelinePage() {
  const [events] = useState(sampleEvents);
  const [selectedType, setSelectedType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesType = !selectedType || event.type === selectedType;
    const matchesState = !selectedState || event.state === selectedState || event.state === 'All India';
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesState && matchesSearch && event.isActive;
  });

  const urgentEvents = filteredEvents.filter(event => event.daysLeft <= 30 && event.daysLeft > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduGuide</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                {urgentEvents.length} Urgent
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientMount>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Timeline Tracker</h1>
              <p className="text-xl text-gray-600">Never miss important admission dates and deadlines</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <div className="text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{urgentEvents.length}</p>
                <p className="text-sm text-gray-600">Urgent Events</p>
              </div>
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
                  <p className="text-blue-100">Admissions</p>
                  <p className="text-3xl font-bold">
                    {events.filter(e => e.type === 'admission' && e.isActive).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Scholarships</p>
                  <p className="text-3xl font-bold">
                    {events.filter(e => e.type === 'scholarship' && e.isActive).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-200" />
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
                  <p className="text-orange-100">Exams</p>
                  <p className="text-3xl font-bold">
                    {events.filter(e => e.type === 'exam' && e.isActive).length}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Counseling</p>
                  <p className="text-3xl font-bold">
                    {events.filter(e => e.type === 'counseling' && e.isActive).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-200" />
              </div>
            </motion.div>
          </div>

          {/* Urgent Events Alert */}
          {urgentEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-bold text-red-900">Urgent Deadlines (Within 30 Days)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {urgentEvents.map((event) => (
                  <div key={event.id} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                        {event.daysLeft} days left
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{event.institution}</p>
                    <p className="text-red-600 font-medium">Deadline: {event.endDate}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, institutions, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="grid md:grid-cols-3 gap-4 pt-4 border-t"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    aria-label="Select event type"
                  >
                    <option value="">All Types</option>
                    <option value="admission">Admissions</option>
                    <option value="exam">Exams</option>
                    <option value="scholarship">Scholarships</option>
                    <option value="counseling">Counseling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    aria-label="Select state"
                  >
                    <option value="">All States</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="All India">All India</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedType('');
                      setSelectedState('');
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[event.type].bg} ${typeColors[event.type].text}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[event.priority]}`}>
                            {event.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{event.institution}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.location}, {event.state}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className={`text-center p-3 rounded-lg mb-3 ${
                          event.daysLeft <= 7 ? 'bg-red-100 text-red-700' :
                          event.daysLeft <= 30 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          <p className="text-2xl font-bold">{event.daysLeft}</p>
                          <p className="text-xs">days left</p>
                        </div>
                        <Bookmark className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Important Dates:</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Start Date:</span>
                            <span className="font-medium">{event.startDate}</span>
                          </div>
                          {event.endDate && (
                            <div className="flex justify-between">
                              <span>End Date:</span>
                              <span className="font-medium text-red-600">{event.endDate}</span>
                            </div>
                          )}
                          {event.applicationFee && (
                            <div className="flex justify-between">
                              <span>Application Fee:</span>
                              <span className="font-medium">₹{event.applicationFee}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Eligibility:</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {event.eligibility.map((criteria, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                              <span>{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          Set Reminder
                        </button>
                        <button className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                          Save Event
                        </button>
                      </div>
                      {event.url && (
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          <span>Visit Official Site</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          </motion.div>
        </ClientMount>
      </div>
    </div>
  );
}
