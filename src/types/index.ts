// MongoDB Database Types
// Note: 'id' fields represent MongoDB ObjectIds as strings

export interface User {
  id: string;
  email: string;
  name?: string;
  age?: number;
  gender?: string;
  class?: string;
  location?: string;
  state?: string;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizResult {
  id: string;
  userId: string;
  answers: number[];
  results: {
    categoryScores: Record<string, number>;
    topCategory: string;
    streamRecommendation: string;
    description: string;
    careers: string[];
  };
  streamRecommendation: string;
  careerRecommendations: string[];
  createdAt: Date;
}

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  district: string;
  type: 'Arts' | 'Science' | 'Commerce' | 'Engineering' | 'Medical' | 'Mixed';
  established: number;
  students?: number;
  rating?: number;
  facilities: string[];
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
  medium: string[];
  latitude?: number;
  longitude?: number;
  website?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Career {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  type: 'admission' | 'scholarship' | 'exam' | 'counseling';
  startDate: Date;
  endDate?: Date;
  institution?: string;
  location?: string;
  state?: string;
  url?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'timeline' | 'recommendation' | 'general';
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export interface Recommendation {
  id: string;
  userId: string;
  type: 'course' | 'college' | 'career' | 'study_material';
  title: string;
  description: string;
  data: Record<string, unknown>;
  score: number;
  isViewed: boolean;
  isActedOn: boolean;
  createdAt: Date;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  stream: string;
  class: string;
  type: 'book' | 'video' | 'notes' | 'practice';
  url?: string;
  content?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  downloads: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  amount: string;
  applicationUrl?: string;
  startDate: Date;
  endDate: Date;
  organization: string;
  category: string[];
  streams: string[];
  states: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  name: string;
  fullName?: string;
  description: string;
  type: 'entrance' | 'competitive' | 'board';
  conductingBody: string;
  applicationDate?: Date;
  examDate?: Date;
  resultDate?: Date;
  eligibility: string;
  syllabus?: string;
  pattern?: {
    subjects: string[];
    duration: string;
    questions: number;
    marks: number;
  };
  fees?: {
    general: number;
    sc_st: number;
    obc: number;
  };
  website?: string;
  streams: string[];
  courses: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
