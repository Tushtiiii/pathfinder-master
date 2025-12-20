'use client';
import { useState, useEffect } from 'react';
import Colleges from './data';
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

interface DBCollege extends Partial<College> {
  _id?: string;
}


export default function CollegesDirectory() {
  // Start with the local static dataset so the UI works immediately if the API is unavailable
  const [colleges, setColleges] = useState<DBCollege[]>(Colleges as DBCollege[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState<number | null>(null);

  // Use an environment-configurable API URL. Set NEXT_PUBLIC_COLLEGES_API in .env.local
  // If an external API is not configured, fall back to the local API route
  const API_URL = process.env.NEXT_PUBLIC_COLLEGES_API;
  const apiUrl = API_URL ?? '/api/colleges';
  console.log('API_URL:', API_URL, 'using', apiUrl);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const fetchUrl = `${apiUrl}?page=${page}&limit=${limit}`;
        console.log('Fetching colleges from API:', fetchUrl);
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        // The API returns { data: [...], meta: { total, page, limit, totalPages } }
        const items = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        type MetaType = { total?: number; page?: number; limit?: number; totalPages?: number };
        const meta = data && typeof data === 'object' && 'meta' in data ? (data as unknown as { meta?: MetaType }).meta : undefined;

        // Map remote items into the same shape the UI expects when items are raw remote objects
        const mapped = items.map((item: Record<string, unknown>) => {
          const get = (k: string) => {
            const v = item[k];
            if (v === undefined || v === null) return undefined;
            if (typeof v === 'string' || typeof v === 'number') return v;
            return undefined;
          };

          const yearKey = Object.keys(item).find(k => k.toLowerCase().includes('year of establishment')) || 'Year of Establishment';
          const yearVal = get(yearKey) || get('Year of Establishment\n') || get('Year of Establishment');

          const name = (get('College Name') || get('College_Name') || get('University Name') || get('University_Name') || '') as string;
          const location = (get('Location') || get('Address') || '') as string;
          const district = (get('District') || '') as string;
          const state = (get('State') || '') as string;
          const specialised = get('Specialised in') as string | undefined;
          const rating = (get('Rating') as number) || 0;
          const students = (get('Students') as number) || 0;
          const mediumVal = (get('Medium') as string) || '';
          const typeVal = (get('College Type') || get('University Type') || get('CollegeType') || '') as string;

          return {
            name,
            location,
            district,
            state,
            programs: specialised ? [specialised] : [],
            fees: { general: 0, sc_st: 0, obc: 0 },
            cutoffs: { general: 0, sc_st: 0, obc: 0 },
            facilities: [],
            rating,
            students,
            established: yearVal ? parseInt(String(yearVal).trim()) || undefined : undefined,
            medium: mediumVal ? [mediumVal] : [],
            type: typeVal,
            raw: item,
          } as DBCollege;
        });

        setColleges(mapped || []);
        setTotalResults(meta?.total ?? (mapped.length ?? 0));
        setTotalPages(meta?.totalPages ?? 1);
      } catch (err) {
        console.error('Failed to load colleges:', err);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  },[apiUrl, page, limit]);

  const filteredColleges = colleges.filter((college) => {
    const name = (college.name || '').toString().toLowerCase();
    const location = (college.location || '').toString().toLowerCase();
    const programs = (college.programs || []).map(p => p.toString().toLowerCase());
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase()) ||
      programs.some((program: string) => program.includes(searchTerm.toLowerCase()));

    const matchesState = !selectedState || college.state === selectedState;
    const matchesType = !selectedType || college.type === selectedType;

    return matchesSearch && matchesState && matchesType;
  });

  const states = Array.from(new Set(colleges.map((college) => college.state)));
  const types = Array.from(new Set(colleges.map((college) => college.type)));

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
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-700" />
                <input
                  type="text"
                  placeholder="Search colleges, programs, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                    className="w-full text-gray-700 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full text-gray-700 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              {totalResults ?? filteredColleges.length} Colleges Found
            </h2>
            <select className="p-2 border text-gray-700 border-gray-300 rounded-lg" aria-label="Sort colleges by">
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
                key={college._id || college.id || index}
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
                        {(college.programs || []).map((program, idx) => (
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
                          <div>General: ₹{(college.fees?.general || 0).toLocaleString()}</div>
                          <div>SC/ST: ₹{(college.fees?.sc_st || 0).toLocaleString()}</div>
                          <div>OBC: ₹{(college.fees?.obc || 0).toLocaleString()}</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Cut-off (%)</h5>
                        <div className="text-sm text-gray-600">
                          <div>General: {college.cutoffs?.general ?? 0}%</div>
                          <div>SC/ST: {college.cutoffs?.sc_st ?? 0}%</div>
                          <div>OBC: {college.cutoffs?.obc ?? 0}%</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Facilities:</h5>
                      <div className="flex flex-wrap gap-3">
                        {(college.facilities || []).map((facility, idx) => (
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
                        {(college.medium || []).map((lang, idx) => (
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

          {/* Pagination Controls */}
          <nav className="mt-6 flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => {
              const p = i + 1;
              // show a small window around current page
              const show = Math.abs(p - page) <= 3 || p === 1 || p === totalPages;
              if (!show) return <span key={p} className="px-2">...</span>;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-current={p === page}
                  className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </motion.div>
      </div>
    </div>
  );
}
