export interface Hero {
  id: string;
  name: string;
  rank: string;
  region: string;
  description: string;
  years: string;
  photo: string;
  awards: string[];
}

export interface HeroFormData {
  fullName: string;
  birthYear: string;
  deathYear: string;
  rank: string;
  region: string;
  awards: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactRelation: string;
  photo: File | null;
}

export interface HeroFilter {
  region: string;
  award: string;
  rank: string;
  yearFrom: string;
  yearTo: string;
  searchQuery: string;
}

export interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  image?: string;
  location?: string;
}

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  date: Date;
}

export interface Film {
  id: number;
  title: string;
  year: number;
  director: string;
  poster: string;
  rating: number;
  description: string;
  link: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  cover: string;
  description: string;
  link: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  icon: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: 'Новость' | 'Анонс';
  image: string;
  excerpt: string;
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
}> {}

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  savedHeroes: number[];
  quizProgress: Record<string, number>;
} 