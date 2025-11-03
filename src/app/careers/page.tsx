'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Users,
  Award,
  Building,
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CareerPath {
  id: number;
  title: string;
  stream: string;
  degree: string;
  description: string;
  salaryRange: {
    entry: number;
    mid: number;
    senior: number;
  };
  jobGrowth: number;
  skills: string[];
  industries: string[];
  jobTitles: string[];
  educationPath: string[];
  certifications: string[];
}

const careerPaths: CareerPath[] = [
  {
    id: 1,
    title: "Software Engineering",
    stream: "Science (PCM)",
    degree: "B.Tech Computer Science / B.E",
    description: "Design, develop, and maintain software applications and systems. Work with cutting-edge technologies to solve complex problems.",
    salaryRange: { entry: 500000, mid: 1200000, senior: 2500000 },
    jobGrowth: 22,
    skills: ["Programming", "Problem Solving", "System Design", "Database Management"],
    industries: ["Technology", "Finance", "Healthcare", "E-commerce", "Gaming"],
    jobTitles: ["Software Developer", "Full Stack Developer", "Backend Engineer", "Frontend Developer", "DevOps Engineer"],
    educationPath: ["Class 12 (PCM)", "B.Tech/B.E Computer Science", "Optional: M.Tech/MBA"],
    certifications: ["AWS Certified", "Google Cloud Professional", "Oracle Certified", "Microsoft Azure"]
  },
  {
    id: 2,
    title: "Data Science & Analytics",
    stream: "Science (PCM) / Commerce",
    degree: "B.Tech / B.Sc Statistics / BCA",
    description: "Extract insights from data to drive business decisions. Use statistical analysis and machine learning to solve real-world problems.",
    salaryRange: { entry: 600000, mid: 1500000, senior: 3000000 },
    jobGrowth: 31,
    skills: ["Statistics", "Python/R", "Machine Learning", "Data Visualization", "SQL"],
    industries: ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing"],
    jobTitles: ["Data Scientist", "Data Analyst", "ML Engineer", "Business Intelligence Analyst"],
    educationPath: ["Class 12 (PCM/Commerce)", "B.Tech/B.Sc/BCA", "Specialized Courses", "M.Sc Data Science (Optional)"],
    certifications: ["Google Data Analytics", "IBM Data Science", "Microsoft Power BI", "Tableau Certified"]
  },
  {
    id: 3,
    title: "Digital Marketing",
    stream: "Arts / Commerce",
    degree: "BBA / B.Com / BA Mass Comm",
    description: "Create and execute online marketing strategies. Manage social media, content, and digital advertising campaigns.",
    salaryRange: { entry: 300000, mid: 800000, senior: 1800000 },
    jobGrowth: 19,
    skills: ["Social Media", "Content Creation", "SEO/SEM", "Analytics", "Creative Design"],
    industries: ["Digital Agencies", "E-commerce", "Media", "Technology", "Consulting"],
    jobTitles: ["Digital Marketing Executive", "Social Media Manager", "Content Strategist", "SEO Specialist"],
    educationPath: ["Class 12 (Any Stream)", "BBA/B.Com/BA", "Digital Marketing Courses"],
    certifications: ["Google Ads", "Facebook Blueprint", "HubSpot", "Google Analytics"]
  },
  {
    id: 4,
    title: "Healthcare & Medicine",
    stream: "Science (PCB)",
    degree: "MBBS / BDS / B.Pharma / B.Sc Nursing",
    description: "Provide medical care and improve public health. Work in hospitals, clinics, or research institutions.",
    salaryRange: { entry: 400000, mid: 1000000, senior: 2000000 },
    jobGrowth: 15,
    skills: ["Medical Knowledge", "Patient Care", "Diagnosis", "Surgery", "Research"],
    industries: ["Hospitals", "Clinics", "Pharmaceuticals", "Research", "Public Health"],
    jobTitles: ["Doctor", "Surgeon", "Pharmacist", "Nurse", "Medical Researcher"],
    educationPath: ["Class 12 (PCB)", "NEET Entrance", "MBBS/BDS/B.Pharma", "MD/MS (Optional)"],
    certifications: ["Medical Council Registration", "Specialized Certifications", "International Certifications"]
  },
  {
    id: 5,
    title: "Finance & Banking",
    stream: "Commerce / Arts",
    degree: "B.Com / BBA / CA / CS",
    description: "Manage financial operations, investments, and banking services. Help individuals and organizations with financial planning.",
    salaryRange: { entry: 350000, mid: 900000, senior: 2200000 },
    jobGrowth: 12,
    skills: ["Financial Analysis", "Risk Assessment", "Investment Planning", "Accounting", "Regulatory Compliance"],
    industries: ["Banks", "Insurance", "Investment Firms", "Consulting", "Corporate Finance"],
    jobTitles: ["Financial Analyst", "Investment Banker", "Chartered Accountant", "Risk Manager"],
    educationPath: ["Class 12 (Commerce)", "B.Com/BBA", "CA/CS/CFA", "MBA Finance (Optional)"],
    certifications: ["CA", "CS", "CFA", "FRM", "CMA"]
  },
  {
    id: 6,
    title: "Teaching & Education",
    stream: "Any Stream",
    degree: "B.Ed / Subject-specific degree",
    description: "Shape future generations through teaching and educational leadership. Work in schools, colleges, or educational institutions.",
    salaryRange: { entry: 250000, mid: 500000, senior: 1000000 },
    jobGrowth: 8,
    skills: ["Subject Expertise", "Communication", "Classroom Management", "Curriculum Development"],
    industries: ["Schools", "Colleges", "Coaching Centers", "Online Education", "Government"],
    jobTitles: ["Teacher", "Professor", "Principal", "Education Consultant", "Curriculum Designer"],
    educationPath: ["Class 12", "Subject Bachelor's Degree", "B.Ed", "M.Ed (Optional)"],
    certifications: ["Teaching Certification", "Subject-specific Certifications", "Educational Leadership"]
  }
];

const salaryData = [
  { experience: '0-2 years', salary: 400000 },
  { experience: '3-5 years', salary: 800000 },
  { experience: '6-10 years', salary: 1400000 },
  { experience: '10+ years', salary: 2200000 },
];

const growthData = [
  { field: 'Data Science', growth: 31 },
  { field: 'Software Eng.', growth: 22 },
  { field: 'Digital Marketing', growth: 19 },
  { field: 'Healthcare', growth: 15 },
  { field: 'Finance', growth: 12 },
  { field: 'Teaching', growth: 8 },
];

export default function CareersPage() {
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [selectedStream, setSelectedStream] = useState('');

  const filteredCareers = selectedStream 
    ? careerPaths.filter(career => career.stream.includes(selectedStream))
    : careerPaths;

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Path Explorer</h1>
          <p className="text-xl text-gray-600 mb-8">Discover career opportunities and map your educational journey</p>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl text-gray-700 font-bold mb-2">Average Salary Growth</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="experience" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => [`₹${(value/100000).toFixed(1)}L`, 'Salary']} />
                  <Line type="monotone" dataKey="salary" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <ArrowUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl text-gray-700 font-bold mb-2">Job Growth by Field</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="field" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Growth']} />
                  <Bar dataKey="growth" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl text-gray-700 font-bold mb-2">Top Skills in Demand</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Programming</span>
                  <span className="text-purple-600 font-medium">95%</span>
                </li>
                <li className="flex justify-between">
                  <span>Data Analysis</span>
                  <span className="text-purple-600 font-medium">88%</span>
                </li>
                <li className="flex justify-between">
                  <span>Communication</span>
                  <span className="text-purple-600 font-medium">82%</span>
                </li>
                <li className="flex justify-between">
                  <span>Problem Solving</span>
                  <span className="text-purple-600 font-medium">79%</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stream Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg  text-gray-700 font-bold mb-4">Filter by Stream:</h3>
            <div className="flex flex-wrap gap-3 text-gray-700">
              <button
                onClick={() => setSelectedStream('')}
                className={`px-4 py-2 rounded-lg border ${!selectedStream ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                All Streams
              </button>
              <button
                onClick={() => setSelectedStream('Science (PCM)')}
                className={`px-4 py-2 rounded-lg border ${selectedStream === 'Science (PCM)' ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Science (PCM)
              </button>
              <button
                onClick={() => setSelectedStream('Science (PCB)')}
                className={`px-4 py-2 rounded-lg border ${selectedStream === 'Science (PCB)' ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Science (PCB)
              </button>
              <button
                onClick={() => setSelectedStream('Commerce')}
                className={`px-4 py-2 rounded-lg border ${selectedStream === 'Commerce' ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Commerce
              </button>
              <button
                onClick={() => setSelectedStream('Arts')}
                className={`px-4 py-2 rounded-lg border ${selectedStream === 'Arts' ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Arts
              </button>
            </div>
          </div>

          {/* Career Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCareers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedCareer(career)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{career.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{career.stream}</span>
                      <span>{career.degree}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <p className="text-gray-600 mb-4">{career.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-green-600 mb-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-semibold">Salary Range</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{(career.salaryRange.entry/100000).toFixed(1)}L - ₹{(career.salaryRange.senior/100000).toFixed(1)}L
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-purple-600 mb-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-semibold">Job Growth</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {career.jobGrowth}% projected growth
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Key Skills:</h5>
                  <div className="flex flex-wrap gap-2">
                    {career.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                    {career.skills.length > 3 && (
                      <span className="text-gray-500 text-sm">+{career.skills.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{career.industries.length} industries</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{career.jobTitles.length} job roles</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Career Details Modal */}
          {selectedCareer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCareer(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedCareer.title}</h2>
                    <p className="text-lg text-gray-600">{selectedCareer.stream} → {selectedCareer.degree}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCareer(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Education Path</h3>
                    <div className="space-y-3">
                      {selectedCareer.educationPath.map((step, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                            {idx + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold mb-4 mt-8">Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.industries.map((industry, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          {industry}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold mb-4 mt-8">Certifications</h3>
                    <ul className="space-y-2">
                      {selectedCareer.certifications.map((cert, idx) => (
                        <li key={idx} className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-2" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Salary Progression</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span>Entry Level (0-2 years)</span>
                        <span className="font-bold text-green-600">₹{(selectedCareer.salaryRange.entry/100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span>Mid Level (3-7 years)</span>
                        <span className="font-bold text-blue-600">₹{(selectedCareer.salaryRange.mid/100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span>Senior Level (8+ years)</span>
                        <span className="font-bold text-purple-600">₹{(selectedCareer.salaryRange.senior/100000).toFixed(1)}L</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 mt-8">Job Titles</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedCareer.jobTitles.map((title, idx) => (
                        <div key={idx} className="flex items-center p-2 border border-gray-200 rounded">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{title}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold mb-4 mt-8">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.skills.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-center space-x-4">
                    <Link href="/colleges" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Find Relevant Colleges
                    </Link>
                    <Link href="/quiz" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                      Take Aptitude Quiz
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
