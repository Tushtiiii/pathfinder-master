import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export database connection for convenience
export { connectToDatabase, getDatabase } from './mongodb';

export function formatSalary(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString()}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getTimeUntil(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff < 0) return 'Past';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  } else {
    return 'Today';
  }
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getStreamFromSubjects(subjects: string[]): string {
  const hasPhysics = subjects.some(s => s.toLowerCase().includes('physics'));
  const hasMaths = subjects.some(s => s.toLowerCase().includes('mathematics') || s.toLowerCase().includes('maths'));
  const hasBiology = subjects.some(s => s.toLowerCase().includes('biology'));
  const hasChemistry = subjects.some(s => s.toLowerCase().includes('chemistry'));
  
  const hasAccountancy = subjects.some(s => s.toLowerCase().includes('accountancy') || s.toLowerCase().includes('accounts'));
  const hasEconomics = subjects.some(s => s.toLowerCase().includes('economics'));
  const hasBusiness = subjects.some(s => s.toLowerCase().includes('business'));
  
  const hasHistory = subjects.some(s => s.toLowerCase().includes('history'));
  const hasPolitical = subjects.some(s => s.toLowerCase().includes('political'));
  const hasGeography = subjects.some(s => s.toLowerCase().includes('geography'));
  const hasLiterature = subjects.some(s => s.toLowerCase().includes('literature') || s.toLowerCase().includes('english'));
  
  if (hasPhysics && hasMaths && hasChemistry) {
    return 'Science (PCM)';
  } else if (hasPhysics && hasChemistry && hasBiology) {
    return 'Science (PCB)';
  } else if (hasAccountancy || hasEconomics || hasBusiness) {
    return 'Commerce';
  } else if (hasHistory || hasPolitical || hasGeography || hasLiterature) {
    return 'Arts';
  }
  
  return 'General';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export function generateRecommendationScore(
  userProfile: Record<string, unknown>,
  item: Record<string, unknown>,
  type: 'college' | 'career' | 'course'
): number {
  let score = 0;
  
  // Location preference (if user has specified location)
  if (typeof userProfile.location === 'string' && typeof item.location === 'string') {
    if (userProfile.location.toLowerCase() === item.location.toLowerCase()) {
      score += 0.3;
    } else if (typeof userProfile.state === 'string' && userProfile.state === item.state) {
      score += 0.2;
    }
  }
  
  // Stream/Interest matching
  if (Array.isArray(userProfile.interests) && Array.isArray(item.programs)) {
    const matchingInterests = userProfile.interests.filter((interest: unknown) =>
      Array.isArray(item.programs) && 
      typeof interest === 'string' &&
      item.programs.some((program: unknown) =>
        typeof program === 'string' && program.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (userProfile.interests.length > 0) {
      score += (matchingInterests.length / userProfile.interests.length) * 0.4;
    }
  }
  
  // Age/Class appropriateness
  if (typeof userProfile.class === 'string' && type === 'college') {
    if (userProfile.class === '12' && item.type !== 'School') {
      score += 0.2;
    }
  }
  
  // Rating/Quality factor
  if (typeof item.rating === 'number') {
    score += (item.rating / 5) * 0.1;
  }
  
  return Math.min(score, 1); // Cap at 1.0
}

export const STATES_INDIA = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
];

export const COLLEGE_TYPES = [
  'Arts', 'Science', 'Commerce', 'Engineering', 'Medical', 'Mixed', 'Vocational'
];

export const CAREER_CATEGORIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Arts & Design',
  'Business', 'Science & Research', 'Government', 'Media', 'Sports'
];
