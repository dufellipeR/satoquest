export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  hint?: string;
}

export interface LessonStep {
  id: string;
  title: string;
  explanation: string;
  keyTakeaway: string;
  codeSnippet?: string;
  practicalTip?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  durationMin: number;
  xpReward: number;
  steps: LessonStep[];
  quiz: QuizQuestion[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  badgeId: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'curriculum' | 'gamification' | 'wallet';
  unlockedAt?: string;
}

export interface Transaction {
  id: string;
  type: 'reward' | 'withdrawal';
  method?: 'lightning' | 'onchain';
  amount: number;
  description: string;
  timestamp: number;
  txHash?: string;
  feeSats?: number;
  destination?: string;
  status: 'confirmed' | 'pending';
}

export interface EcosystemTool {
  id: string;
  name: string;
  category: 'Explorer' | 'Carteira' | 'Lightning' | 'Privacidade' | 'Hardware';
  tagline: string;
  description: string;
  whyUseIt: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  url: string;
  iconName: string;
  recommendedFor: string;
}

export interface UserState {
  name: string;
  xp: number;
  level: number;
  satsBalance: number;
  spinsAvailable: number;
  streakDays: number;
  completedLessonIds: string[];
  unlockedBadgeIds: string[];
  transactions: Transaction[];
  lastActiveDate: string;
}
