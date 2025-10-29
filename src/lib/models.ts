import { Schema, model, models } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  class: { type: String },
  location: { type: String },
  state: { type: String },
  interests: [{ type: String }], // Array of interests
}, {
  timestamps: true,
  collection: 'users'
});

// Quiz Result Schema
const QuizResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Schema.Types.Mixed }], // Array of answers
  results: { type: Schema.Types.Mixed }, // Object with category scores and recommendations
  streamRecommendation: { type: String },
  careerRecommendations: [{ type: String }], // Array of recommended careers
}, {
  timestamps: true,
  collection: 'quiz_results'
});

// College Schema
const CollegeSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  type: { type: String, required: true }, // Arts, Science, Commerce, Engineering, Medical, Mixed
  established: { type: Number, required: true },
  students: { type: Number },
  rating: { type: Number },
  facilities: [{ type: String }], // Array
  programs: [{ type: String }], // Array
  fees: { type: Schema.Types.Mixed }, // Object with different category fees
  cutoffs: { type: Schema.Types.Mixed }, // Object with different category cutoffs
  medium: [{ type: String }], // Array of instruction mediums
  latitude: { type: Number },
  longitude: { type: Number },
  website: { type: String },
  phone: { type: String },
  email: { type: String },
}, {
  timestamps: true,
  collection: 'colleges'
});

// Saved College Schema
const SavedCollegeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true },
}, {
  timestamps: true,
  collection: 'saved_colleges'
});

SavedCollegeSchema.index({ userId: 1, collegeId: 1 }, { unique: true });

// Career Schema
const CareerSchema = new Schema({
  title: { type: String, required: true },
  stream: { type: String, required: true },
  degree: { type: String, required: true },
  description: { type: String, required: true },
  salaryRange: { type: Schema.Types.Mixed }, // Object with entry, mid, senior levels
  jobGrowth: { type: Number, required: true },
  skills: [{ type: String }], // Array
  industries: [{ type: String }], // Array
  jobTitles: [{ type: String }], // Array
  educationPath: [{ type: String }], // Array
  certifications: [{ type: String }], // Array
}, {
  timestamps: true,
  collection: 'careers'
});

// Timeline Schema
const TimelineSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true }, // admission, scholarship, exam, counseling
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  institution: { type: String },
  location: { type: String },
  state: { type: String },
  url: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'timeline_events'
});

// Notification Schema
const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // timeline, recommendation, general
  isRead: { type: Boolean, default: false },
  data: { type: Schema.Types.Mixed }, // Object with additional data
}, {
  timestamps: true,
  collection: 'notifications'
});

// Recommendation Schema
const RecommendationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // course, college, career, study_material
  title: { type: String, required: true },
  description: { type: String, required: true },
  data: { type: Schema.Types.Mixed }, // Object with recommendation details
  score: { type: Number, required: true }, // AI confidence score
  isViewed: { type: Boolean, default: false },
  isActedOn: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: 'recommendations'
});

// Study Material Schema
const StudyMaterialSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  stream: { type: String, required: true }, // Science, Commerce, Arts
  class: { type: String, required: true }, // 11, 12, graduation
  type: { type: String, required: true }, // book, video, notes, practice
  url: { type: String },
  content: { type: String }, // For stored content
  tags: [{ type: String }], // Array
  difficulty: { type: String, required: true }, // beginner, intermediate, advanced
  rating: { type: Number },
  downloads: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'study_materials'
});

// Scholarship Schema
const ScholarshipSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String, required: true },
  amount: { type: String, required: true },
  applicationUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  organization: { type: String, required: true },
  category: [{ type: String }], // Array: merit, need-based, minority, etc.
  streams: [{ type: String }], // Array: applicable streams
  states: [{ type: String }], // Array: applicable states
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'scholarships'
});

// Exam Schema
const ExamSchema = new Schema({
  name: { type: String, required: true },
  fullName: { type: String },
  description: { type: String, required: true },
  type: { type: String, required: true }, // entrance, competitive, board
  conductingBody: { type: String, required: true },
  applicationDate: { type: Date },
  examDate: { type: Date },
  resultDate: { type: Date },
  eligibility: { type: String, required: true },
  syllabus: { type: String },
  pattern: { type: Schema.Types.Mixed }, // Object with exam pattern details
  fees: { type: Schema.Types.Mixed }, // Object with different category fees
  website: { type: String },
  streams: [{ type: String }], // Array: applicable streams
  courses: [{ type: String }], // Array: courses admission through this exam
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'exams'
});

// Export models
export const User = models.User || model('User', UserSchema);
export const QuizResult = models.QuizResult || model('QuizResult', QuizResultSchema);
export const College = models.College || model('College', CollegeSchema);
export const SavedCollege = models.SavedCollege || model('SavedCollege', SavedCollegeSchema);
export const Career = models.Career || model('Career', CareerSchema);
export const Timeline = models.Timeline || model('Timeline', TimelineSchema);
export const Notification = models.Notification || model('Notification', NotificationSchema);
export const Recommendation = models.Recommendation || model('Recommendation', RecommendationSchema);
export const StudyMaterial = models.StudyMaterial || model('StudyMaterial', StudyMaterialSchema);
export const Scholarship = models.Scholarship || model('Scholarship', ScholarshipSchema);
export const Exam = models.Exam || model('Exam', ExamSchema);