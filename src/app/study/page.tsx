'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  Search,
  Filter,
  Star,
  Clock,
  Trophy,
  FileText,
  BookOpenCheck,
  Target,
  Bookmark,
  Grid3X3,
  List
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface StudyMaterial {
  id: number;
  title: string;
  description: string;
  subject: string;
  type: 'video' | 'pdf' | 'quiz' | 'notes' | 'practice';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  views: number;
  rating: number;
  downloadCount?: number;
  author: string;
  thumbnail: string;
  tags: string[];
  url: string;
  isPremium: boolean;
  isBookmarked: boolean;
  lastUpdated: string;
}

const sampleMaterials: StudyMaterial[] = [
  {
    id: 1,
    title: "Complete JEE Mathematics - Calculus Mastery",
    description: "Comprehensive video series covering differential and integral calculus with solved examples and practice problems",
    subject: "Mathematics",
    type: "video",
    level: "advanced",
    duration: "8h 30m",
    views: 45320,
    rating: 4.8,
    author: "Dr. Ramesh Kumar",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250",
    tags: ["Calculus", "JEE", "Mathematics", "Problem Solving"],
    url: "#",
    isPremium: false,
    isBookmarked: true,
    lastUpdated: "2024-12-15"
  },
  {
    id: 2,
    title: "Organic Chemistry Reaction Mechanisms",
    description: "Detailed explanation of organic reactions with mechanism diagrams and memorization techniques",
    subject: "Chemistry",
    type: "pdf",
    level: "intermediate",
    duration: "2h read",
    views: 28450,
    rating: 4.6,
    downloadCount: 15420,
    author: "Prof. Priya Sharma",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250",
    tags: ["Organic Chemistry", "Reactions", "NEET", "Mechanisms"],
    url: "#",
    isPremium: true,
    isBookmarked: false,
    lastUpdated: "2024-12-10"
  },
  {
    id: 3,
    title: "Physics Problem Solving Strategies",
    description: "Interactive quiz series testing your understanding of physics concepts with detailed explanations",
    subject: "Physics",
    type: "quiz",
    level: "intermediate",
    duration: "1h 45m",
    views: 32100,
    rating: 4.7,
    author: "Team PhysicsHub",
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=250",
    tags: ["Physics", "Problem Solving", "JEE", "Practice"],
    url: "#",
    isPremium: false,
    isBookmarked: true,
    lastUpdated: "2024-12-12"
  },
  {
    id: 4,
    title: "English Grammar and Composition",
    description: "Complete guide to English grammar rules with examples and practice exercises",
    subject: "English",
    type: "notes",
    level: "beginner",
    duration: "3h read",
    views: 18900,
    rating: 4.5,
    author: "Ms. Anjali Verma",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250",
    tags: ["Grammar", "English", "Writing", "Composition"],
    url: "#",
    isPremium: false,
    isBookmarked: false,
    lastUpdated: "2024-12-08"
  },
  {
    id: 5,
    title: "Biology Mock Test Series",
    description: "Comprehensive practice tests covering all NEET biology topics with instant feedback",
    subject: "Biology",
    type: "practice",
    level: "advanced",
    duration: "3h test",
    views: 41200,
    rating: 4.9,
    author: "BioPrep Academy",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250",
    tags: ["Biology", "NEET", "Mock Test", "Practice"],
    url: "#",
    isPremium: true,
    isBookmarked: true,
    lastUpdated: "2024-12-14"
  },
  {
    id: 6,
    title: "Computer Science Algorithms",
    description: "Data structures and algorithms explained with coding examples and complexity analysis",
    subject: "Computer Science",
    type: "video",
    level: "advanced",
    duration: "12h 20m",
    views: 67800,
    rating: 4.8,
    author: "CodeMaster Pro",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250",
    tags: ["Algorithms", "Data Structures", "Programming", "Coding"],
    url: "#",
    isPremium: true,
    isBookmarked: false,
    lastUpdated: "2024-12-11"
  }
];

const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];
const types = ['All', 'video', 'pdf', 'quiz', 'notes', 'practice'];
const levels = ['All', 'beginner', 'intermediate', 'advanced'];

const typeIcons = {
  video: Video,
  pdf: FileText,
  quiz: Target,
  notes: BookOpenCheck,
  practice: Trophy
};

const typeColors = {
  video: 'bg-red-100 text-red-700',
  pdf: 'bg-blue-100 text-blue-700',
  quiz: 'bg-green-100 text-green-700',
  notes: 'bg-purple-100 text-purple-700',
  practice: 'bg-orange-100 text-orange-700'
};

export default function StudyMaterialsPage() {
  const [materials] = useState(sampleMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchTerm || 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'All' || material.subject === selectedSubject;
    const matchesType = selectedType === 'All' || material.type === selectedType;
    const matchesLevel = selectedLevel === 'All' || material.level === selectedLevel;

    return matchesSearch && matchesSubject && matchesType && matchesLevel;
  });

  const featuredMaterials = materials.filter(m => m.rating >= 4.7).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduGuide</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Bookmark className="h-6 w-6 text-gray-600" />
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {materials.filter(m => m.isBookmarked).length} Saved
              </span>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Materials</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access high-quality educational resources, video lectures, practice tests, and study notes 
              curated by expert educators
            </p>
          </div>

          {/* Featured Materials */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Content</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredMaterials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    {/* <Image
                      src={material.thumbnail}
                      width={400}height={250}
                      alt={material.title}
                      className="w-full h-48 object-cover"
                    /> */}
                    {material.isPremium && (
                      <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        PREMIUM
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[material.type]}`}>
                        {material.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{material.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{material.rating}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{material.views.toLocaleString()} views</span>
                      </div>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{material.duration}</span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Start Learning
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-gray-500  pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center  text-gray-500 space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center  text-gray-500 space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    aria-label="List view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-4 gap-4 pt-4 border-t"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full  text-gray-500 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select subject"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full  text-gray-500 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select material type"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-2 border  text-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select difficulty level"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level === 'All' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedSubject('All');
                      setSelectedType('All');
                      setSelectedLevel('All');
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredMaterials.length} results
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            <select className="p-2 border border-gray-300 text-gray-500 rounded-lg text-sm" aria-label="Sort by">
              <option>Sort by Relevance</option>
              <option>Sort by Rating</option>
              <option>Sort by Views</option>
              <option>Sort by Date</option>
            </select>
          </div>

          {/* Materials List */}
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredMaterials.map((material, index) => {
              const IconComponent = typeIcons[material.type];
              
              if (viewMode === 'list') {
                return (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex space-x-6">
                      <div className="relative flex-shrink-0">
                        {/* <Image
                          src={material.thumbnail}
                          alt={material.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        /> */}
                        {material.isPremium && (
                          <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 flex-1">{material.title}</h3>
                          <Bookmark 
                            className={`h-5 w-5 ml-2 cursor-pointer ${material.isBookmarked ? 'text-blue-600 fill-current' : 'text-gray-400'}`}
                          />
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[material.type]}`}>
                            {material.type.toUpperCase()}
                          </span>
                          <span>by {material.author}</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                            <span>{material.rating}</span>
                          </div>
                          <span>{material.views.toLocaleString()} views</span>
                          <span>{material.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {material.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            View Material
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    {/* <Image
                      src={material.thumbnail}
                      alt={material.title}
                      className="w-full h-48 object-cover"
                    /> */}
                    {material.isPremium && (
                      <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        PREMIUM
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[material.type]}`}>
                        <IconComponent className="h-3 w-3 inline mr-1" />
                        {material.type.toUpperCase()}
                      </span>
                    </div>
                    <button 
                      className="absolute top-3 left-3"
                      title={material.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                      aria-label={material.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                    >
                      <Bookmark 
                        className={`h-5 w-5 ${material.isBookmarked ? 'text-white fill-current' : 'text-white/70'}`}
                      />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">{material.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
                    <p className="text-sm text-gray-500 mb-3">by {material.author}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-500">{material.rating}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{material.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {material.duration}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {material.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Start Learning
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No materials found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
