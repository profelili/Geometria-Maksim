export type Language = 'es' | 'en' | 'pt' | 'ru';

export type TextSize = 'normal' | 'large' | 'xlarge';

export interface StudentProfile {
  name: string;
  course: string;
  avatar: string;
  id: string;
  createdAt: string;
}

export interface ExerciseAnswer {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
  attempts: number;
  lastAttemptAt: string;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  exercisesCompleted: number;
  timeSpentMinutes: number;
}

export interface UserProgress {
  profile: StudentProfile;
  answers: Record<string, ExerciseAnswer>;
  streakCount: number;
  lastActiveDate: string;
  dailyGoal: number; // e.g. 5 exercises per day
  dailyGoalProgress: number;
  weeklyActivity: DayActivity[];
  unlockedAchievements: string[];
  theme: 'light' | 'dark';
  language: Language;
  textSize: TextSize;
  highContrast: boolean;
  cloudSyncEnabled: boolean;
  lastCloudSync?: string;
}

export interface Achievement {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface TeacherRecord {
  id: string;
  studentName: string;
  studentCourse: string;
  avatar: string;
  timestamp: string;
  scoreOutOf10: number;
  correctCount: number;
  totalAnswered: number;
  totalExercises: number;
  percentage: number;
}

export interface Exercise {
  id: string;
  page: number;
  sectionId: string;
  questionNumber: string;
  subQuestion?: string;
  instructionKey: string;
  promptKey: string;
  unit?: string;
  expectedAnswers: string[]; // Accepts multiple acceptable forms (e.g. "9.42", "9,42")
  hintKey: string;
  explanationKey: string;
  visualType?: 'pentamino' | 'grid_units' | 'conversions' | 'patio' | 'parallelogram' | 'trapezoid' | 'rhomboid' | 'circle' | 'integration';
  placeholder?: string;
}

export interface ModuleSection {
  id: string;
  pages: string;
  titleKey: string;
  subtitleKey: string;
  category: 'pentaminoes' | 'units' | 'parallelograms' | 'trapezoids' | 'rhomboids' | 'circles' | 'integration';
  visualType: 'pentamino' | 'grid_units' | 'conversions' | 'patio' | 'parallelogram' | 'trapezoid' | 'rhomboid' | 'circle' | 'integration';
  exercises: Exercise[];
}
