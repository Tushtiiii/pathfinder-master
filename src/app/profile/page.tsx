'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  BookOpen, 
  Edit3, 
  Save, 
  MapPin, 
  GraduationCap,
  Heart,
  Trophy,
  Target,
  Star,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: string;
  class: string;
  location: string;
  state: string;
  interests: string[];
  streamPreference: string;
  careerGoals: string[];
  strengths: string[];
  achievements: string[];
}

const sampleProfile: UserProfile = {
  name: "Arjun Sharma",
  email: "arjun.sharma@email.com",
  age: 17,
  gender: "Male",
  class: "12th",
  location: "Chennai",
  state: "Tamil Nadu",
  interests: ["Technology", "Mathematics", "Problem Solving", "Innovation"],
  streamPreference: "Science (PCM)",
  careerGoals: ["Software Engineer", "Data Scientist", "Entrepreneur"],
  strengths: ["Logical Thinking", "Programming", "Leadership", "Communication"],
  achievements: ["School Topper in Mathematics", "Won State Level Coding Competition", "Led Tech Club"]
};

const interestOptions = [
  "Technology", "Mathematics", "Science", "Arts", "Music", "Sports", 
  "Literature", "History", "Geography", "Economics", "Business", 
  "Social Work", "Healthcare", "Engineering", "Design", "Writing"
];

const streamOptions = ["Science (PCM)", "Science (PCB)", "Commerce", "Arts", "Vocational"];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(sampleProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSave = () => {
    // Here you would typically save to database
    setIsEditing(false);
  };

  const handleInterestToggle = (interest: string) => {
    if (profile.interests.includes(interest)) {
      setProfile({
        ...profile,
        interests: profile.interests.filter(i => i !== interest)
      });
    } else {
      setProfile({
        ...profile,
        interests: [...profile.interests, interest]
      });
    }
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
              <Link href="/quiz" className="text-blue-600 hover:text-blue-700 font-medium">
                Retake Quiz
              </Link>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.class} Student</p>
                <div className="flex items-center justify-center mt-2 text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}, {profile.state}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 font-medium">Age</span>
                    <span className="text-blue-900 font-bold">{profile.age}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">Stream</span>
                    <span className="text-green-900 font-bold text-sm">{profile.streamPreference}</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-700 font-medium">Interests</span>
                    <span className="text-purple-900 font-bold">{profile.interests.length}</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('interests')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'interests' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Interests & Goals
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'achievements' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'recommendations' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Recommendations
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-6">
                      <User className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            title="Full Name"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-lg">{profile.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email address"
                            title="Email Address"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-lg">{profile.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={profile.age}
                            onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-lg">{profile.age} years</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        {isEditing ? (
                          <select
                            value={profile.class}
                            onChange={(e) => setProfile({...profile, class: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="10th">10th</option>
                            <option value="11th">11th</option>
                            <option value="12th">12th</option>
                            <option value="Graduate">Graduate</option>
                          </select>
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-lg">{profile.class}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-lg">{profile.location}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.state}
                            onChange={(e) => setProfile({...profile, state: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-lg">{profile.state}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stream Preference */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-6">
                      <GraduationCap className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">Stream Preference</h3>
                    </div>
                    
                    {isEditing ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {streamOptions.map((stream) => (
                          <button
                            key={stream}
                            onClick={() => setProfile({...profile, streamPreference: stream})}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              profile.streamPreference === stream
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {stream}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 font-semibold text-lg">{profile.streamPreference}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'interests' && (
                <div className="space-y-6">
                  {/* Interests */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-6">
                      <Heart className="h-6 w-6 text-red-600 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">Interests</h3>
                    </div>
                    
                    {isEditing ? (
                      <div className="grid md:grid-cols-3 gap-3">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => handleInterestToggle(interest)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              profile.interests.includes(interest)
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {profile.interests.map((interest) => (
                          <span
                            key={interest}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Career Goals */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-6">
                      <Target className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">Career Goals</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {profile.careerGoals.map((goal, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600 mr-3" />
                          <span className="text-blue-800 font-medium">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-6">
                      <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">Key Strengths</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {profile.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center p-4 bg-purple-50 rounded-lg">
                          <Star className="h-5 w-5 text-purple-600 mr-3" />
                          <span className="text-purple-800 font-medium">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-6">
                    <Trophy className="h-6 w-6 text-yellow-600 mr-2" />
                    <h3 className="text-2xl font-bold text-gray-900">Achievements & Awards</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500">
                        <Trophy className="h-6 w-6 text-yellow-600 mr-4 mt-1" />
                        <div>
                          <p className="text-gray-800 font-medium">{achievement}</p>
                          <p className="text-gray-600 text-sm mt-1">Academic Year 2024-25</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-6">
                  {/* Recommended Colleges */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Colleges</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { name: "IIT Chennai", match: "95%", reason: "Perfect for PCM + Technology interest" },
                        { name: "NIT Trichy", match: "88%", reason: "Strong engineering programs" },
                        { name: "Anna University", match: "82%", reason: "Local preference + good tech programs" }
                      ].map((college, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{college.name}</h4>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                              {college.match}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{college.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Careers */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Career Recommendations</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Software Engineer", match: "92%", growth: "22%", salary: "₹6-25L" },
                        { title: "Data Scientist", match: "89%", growth: "31%", salary: "₹8-30L" },
                        { title: "Product Manager", match: "78%", growth: "19%", salary: "₹10-35L" }
                      ].map((career, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{career.title}</h4>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                              {career.match} match
                            </span>
                          </div>
                          <div className="flex space-x-4 text-sm text-gray-600">
                            <span>Growth: {career.growth}</span>
                            <span>Salary: {career.salary}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
