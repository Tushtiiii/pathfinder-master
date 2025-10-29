'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  MapPin, 
  Search, 
  Filter, 
  Star,
  Users,
  Building,
  Wifi,
  Home,
  FlaskConical,
  BookMarked
} from 'lucide-react';
import Link from 'next/link';

interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  district: string;
  programs: string[];
  fees: {
    general: number;
    sc_st: number;
    obc: number;
  };
  cutoffs: {
    general: number;
    sc_st: number;
    obc: number;
  };
  facilities: string[];
  rating: number;
  students: number;
  established: number;
  medium: string[];
  type: 'Arts' | 'Science' | 'Commerce' | 'Engineering' | 'Medical' | 'Mixed';
}

const sampleColleges: College[] = [
  {
    id: 1,
    name: "Government College of Arts and Science",
    location: "Chennai",
    state: "Tamil Nadu",
    district: "Chennai",
    programs: ["B.A. English", "B.A. History", "B.Sc. Mathematics", "B.Sc. Physics", "B.Com"],
    fees: { general: 5000, sc_st: 2500, obc: 3500 },
    cutoffs: { general: 85, sc_st: 75, obc: 80 },
    facilities: ["Library", "Computer Lab", "Hostel", "Canteen", "Sports Complex"],
    rating: 4.2,
    students: 2500,
    established: 1960,
    medium: ["English", "Tamil"],
    type: "Mixed"
  },
  {
    id: 2,
    name: "Regional Engineering College",
    location: "Trichy",
    state: "Tamil Nadu", 
    district: "Tiruchirappalli",
    programs: ["B.E. Computer Science", "B.E. Mechanical", "B.E. Electrical", "B.E. Civil"],
    fees: { general: 15000, sc_st: 7500, obc: 10000 },
    cutoffs: { general: 95, sc_st: 85, obc: 90 },
    facilities: ["Library", "Computer Lab", "Hostel", "Laboratory", "Workshop", "Internet"],
    rating: 4.5,
    students: 3000,
    established: 1964,
    medium: ["English"],
    type: "Engineering"
  },
  {
    id: 3,
    name: "Government Medical College",
    location: "Madurai",
    state: "Tamil Nadu",
    district: "Madurai",
    programs: ["MBBS", "B.Sc. Nursing", "B.Pharma"],
    fees: { general: 25000, sc_st: 12500, obc: 18000 },
    cutoffs: { general: 98, sc_st: 95, obc: 96 },
    facilities: ["Hospital", "Library", "Hostel", "Laboratory", "Research Center"],
    rating: 4.7,
    students: 1500,
    established: 1954,
    medium: ["English"],
    type: "Medical"
  },
  {
    id: 4,
    name: "Government Commerce College",
    location: "Coimbatore",
    state: "Tamil Nadu",
    district: "Coimbatore", 
    programs: ["B.Com", "BBA", "B.Com (CA)", "M.Com"],
    fees: { general: 4000, sc_st: 2000, obc: 3000 },
    cutoffs: { general: 80, sc_st: 70, obc: 75 },
    facilities: ["Library", "Computer Lab", "Auditorium", "Canteen"],
    rating: 4.0,
    students: 2000,
    established: 1970,
    medium: ["English", "Tamil"],
    type: "Commerce"
  },
  {
    id: 5,
    name: "State Science College",
    location: "Salem",
    state: "Tamil Nadu",
    district: "Salem",
    programs: ["B.Sc. Chemistry", "B.Sc. Biology", "B.Sc. Physics", "B.Sc. Mathematics"],
    fees: { general: 6000, sc_st: 3000, obc: 4000 },
    cutoffs: { general: 88, sc_st: 78, obc: 82 },
    facilities: ["Library", "Laboratory", "Hostel", "Internet", "Sports Ground"],
    rating: 4.3,
    students: 1800,
    established: 1965,
    medium: ["English", "Tamil"],
    type: "Science"
  }
];

export default function CollegesDirectory() {
  const [colleges] = useState(sampleColleges);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.programs.some(program => program.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesState = !selectedState || college.state === selectedState;
    const matchesType = !selectedType || college.type === selectedType;
    
    return matchesSearch && matchesState && matchesType;
  });

  const states = Array.from(new Set(colleges.map(college => college.state)));
  const types = Array.from(new Set(colleges.map(college => college.type)));

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Government Colleges Directory</h1>
          <p className="text-xl text-gray-600 mb-8">Find the perfect government college near you</p>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search colleges, programs, or locations..."
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
                className="grid md:grid-cols-3 gap-4 pt-4 border-t"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select state"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select college type"
                  >
                    <option value="">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedState('');
                      setSelectedType('');
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

          {/* Results */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {filteredColleges.length} Colleges Found
            </h2>
            <select className="p-2 border border-gray-300 rounded-lg" aria-label="Sort colleges by">
              <option>Sort by Rating</option>
              <option>Sort by Fees (Low to High)</option>
              <option>Sort by Cut-off (Low to High)</option>
              <option>Sort by Students</option>
            </select>
          </div>

          {/* College Cards */}
          <div className="space-y-6">
            {filteredColleges.map((college, index) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{college.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{college.location}, {college.district}, {college.state}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="flex items-center mr-4">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-semibold">{college.rating}</span>
                          </div>
                          <div className="flex items-center mr-4">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{college.students} students</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">Est. {college.established}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {college.type}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Programs Offered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {college.programs.map((program, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Annual Fees (₹)</h5>
                        <div className="text-sm text-gray-600">
                          <div>General: ₹{college.fees.general.toLocaleString()}</div>
                          <div>SC/ST: ₹{college.fees.sc_st.toLocaleString()}</div>
                          <div>OBC: ₹{college.fees.obc.toLocaleString()}</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Cut-off (%)</h5>
                        <div className="text-sm text-gray-600">
                          <div>General: {college.cutoffs.general}%</div>
                          <div>SC/ST: {college.cutoffs.sc_st}%</div>
                          <div>OBC: {college.cutoffs.obc}%</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Facilities:</h5>
                      <div className="flex flex-wrap gap-3">
                        {college.facilities.map((facility, idx) => (
                          <div key={idx} className="flex items-center text-gray-600 text-sm">
                            {facility === 'Library' && <BookMarked className="h-4 w-4 mr-1" />}
                            {facility === 'Computer Lab' && <FlaskConical className="h-4 w-4 mr-1" />}
                            {facility === 'Hostel' && <Home className="h-4 w-4 mr-1" />}
                            {facility === 'Internet' && <Wifi className="h-4 w-4 mr-1" />}
                            {!['Library', 'Computer Lab', 'Hostel', 'Internet'].includes(facility) && <Building className="h-4 w-4 mr-1" />}
                            <span>{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Quick Actions</h5>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        Save College
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        Get Directions
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h6 className="font-medium text-gray-900 mb-2">Medium of Instruction:</h6>
                      <div className="flex flex-wrap gap-1">
                        {college.medium.map((lang, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
