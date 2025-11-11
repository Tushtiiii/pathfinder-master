"use client";

import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Brain,
  TrendingUp,
  School,
  Target,
  Bell,
  Play, 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduGuide</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/quiz" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Quiz</Link>
              <Link href="/colleges" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Colleges</Link>
              <Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Careers</Link>
              <Link href="/timeline" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Timeline</Link>
              <Link href="/study" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Study</Link>
              <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
                Dashboard
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="text-gray-600 hover:text-gray-900"
                aria-label="Open mobile menu"
                title="Open mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Personalized <span className="text-blue-600">Career Journey</span> Starts Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto md:mx-0">
              Discover your perfect career path with AI-powered recommendations,
              comprehensive college information, and personalized guidance tailored just for you.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="/auth" className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                <Play className="mr-2 h-5 w-5" />Get Started
              </Link>
              <Link href="/quiz" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                Take Quiz
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <Image
              src="/pathfinder.avif"
              alt="Illustration showing a student planning their career path"
              width={520}
              height={360}
              sizes="(max-width: 768px) 90vw, 520px"
              className="rounded-lg shadow-xl max-w-full h-auto"
              // Mark this image as priority (LCP) so Next.js preloads it and doesn't lazy-load
              priority
              // when CSS changes only one dimension, include an explicit auto rule to preserve aspect ratio
              style={{ width: 'auto' }}
            />
            {/* <Card className="absolute -bottom-6 -left-6 p-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <GraduationCap className="text-secondary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Students Guided</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="text-students-count">50,000+</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for Your Educational Journey
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Aptitude Testing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl text-gray-900 font-bold mb-2">Aptitude & Interest Assessment</h3>
            <p className="text-gray-600 mb-4">
              Take comprehensive quizzes to discover your strengths, interests, and personality traits.
            </p>
            <Link href="/quiz" className="text-purple-600 font-semibold hover:text-purple-700">
              Start Assessment →
            </Link>
          </motion.div>

          {/* Career Path Mapping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Course-to-Career Mapping</h3>
            <p className="text-gray-600 mb-4">
              Visualize career paths, job opportunities, and growth prospects for different courses.
            </p>
            <Link href="/careers" className="text-green-600 font-semibold hover:text-green-700">
              Explore Careers →
            </Link>
          </motion.div>

          {/* College Directory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
              <School className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Government College Directory</h3>
            <p className="text-gray-600 mb-4">
              Find nearby government colleges with detailed information about programs and facilities.
            </p>
            <Link href="/colleges" className="text-blue-600 font-semibold hover:text-blue-700">
              Find Colleges →
            </Link>
          </motion.div>

          {/* Timeline Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold  text-gray-900 mb-2">Timeline Tracker</h3>
            <p className="text-gray-600 mb-4">
              Never miss important admission dates, scholarship deadlines, or entrance exams.
            </p>
            <Link href="/timeline" className="text-orange-600 font-semibold hover:text-orange-700">
              View Timeline →
            </Link>
          </motion.div>

          {/* Personalization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-pink-100 p-3 rounded-lg w-fit mb-4">
              <Target className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">AI-Powered Recommendations</h3>
            <p className="text-gray-600 mb-4">
              Get personalized course, college, and career recommendations based on your profile.
            </p>
            <Link href="/profile" className="text-pink-600 font-semibold hover:text-pink-700">
              Create Profile →
            </Link>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Notifications</h3>
            <p className="text-gray-600 mb-4">
              Receive timely alerts about opportunities, deadlines, and personalized recommendations.
            </p>
            <Link href="/notifications" className="text-red-600 font-semibold hover:text-red-700">
              Manage Alerts →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-blue-100">Students Guided</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-blue-100">Government Colleges</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">200+</h3>
              <p className="text-blue-100">Career Paths</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">95%</h3>
              <p className="text-blue-100">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">EduGuide</span>
              </div>
              <p className="text-gray-400">
                Empowering students with personalized career guidance and educational pathways.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Aptitude Testing</li>
                <li>Career Mapping</li>
                <li>College Directory</li>
                <li>Timeline Tracker</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Study Materials</li>
                <li>Scholarship Info</li>
                <li>Exam Prep</li>
                <li>Career Guides</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduGuide Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
