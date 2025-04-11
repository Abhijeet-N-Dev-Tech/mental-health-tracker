export interface User {
  id: number;
  name: string;
  email: string;
  googleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  logId: number;
  type: 'exercise' | 'reading' | 'meditation' | 'work' | 'hobby' | 'walking' | 'running' | 'yoga' | 'other';
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  id: number;
  message: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  anxiety: number;
  stress: number;
  sleepHours: number;
  sleepQuality: 'poor' | 'average' | 'good';
  socialFrequency: 'none' | 'low' | 'moderate' | 'high';
  symptoms: string;
  userId: number;
  logDate: string;
  createdAt: string;
  updatedAt: string;
  activities: Activity[];
}
