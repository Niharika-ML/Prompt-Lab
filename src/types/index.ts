export type Language = 'en' | 'te' | 'hi';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type OutputType = 'text' | 'image' | 'video';

export type CategoryId =
  | 'education'
  | 'career'
  | 'social'
  | 'cooking'
  | 'travel'
  | 'shopping'
  | 'coding'
  | 'image'
  | 'video'
  | 'productivity';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: Difficulty;
  outputType?: OutputType;
  xpReward: number;
  estTime: string;
  scenario: string;
  goal: string;
  sampleStarter: string;
  goodExample: string;
  suggestedElements: Array<'role' | 'task' | 'context' | 'tone' | 'audience' | 'constraints' | 'outputFormat' | 'examples'>;
  hints: string[];
}

export type DimensionStatus = 'strong' | 'needs_improvement' | 'missing';

export interface DimensionAnalysis {
  status: DimensionStatus;
  label: string;
  feedback: string;
  suggestion: string;
}

export interface PromptAnalysis {
  score: number; // 0 - 100
  scoreLabel: string;
  scoreBreakdown: {
    task: number;
    context: number;
    clarity: number;
    constraints: number;
    outputFormat: number;
  };
  dimensions: {
    task: DimensionAnalysis;
    role: DimensionAnalysis;
    context: DimensionAnalysis;
    tone: DimensionAnalysis;
    audience: DimensionAnalysis;
    constraints: DimensionAnalysis;
    outputFormat: DimensionAnalysis;
    examples: DimensionAnalysis;
  };
  overallSummary: string;
  keyStrengths: string[];
  topSuggestions: string[];
}

export interface ImprovementResult {
  improvedPrompt: string;
  explanation: string;
  elementsAdded: string[];
  changesBreakdown: Array<{
    element: string;
    original: string;
    improved: string;
    reason: string;
  }>;
  isAlreadyStrong: boolean;
  optionalTips: string[];
}

export interface OutputExplanation {
  whatAiUnderstood: string;
  partsFollowed: string[];
  missingInformation: string[];
  whyResultLooksThisWay: string;
  suggestedChanges: string[];
}

export interface SavedPrompt {
  id: string;
  userId?: string;
  title: string;
  promptText: string;
  outputType: OutputType;
  category: CategoryId;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  lastScore?: number;
  lastOutput?: string;
  improvedVersion?: string;
  tags?: string[];
}

export interface PracticeHistoryItem {
  id: string;
  userId?: string;
  timestamp: number;
  challengeId?: string;
  challengeTitle: string;
  category: CategoryId;
  outputType: OutputType;
  originalPrompt: string;
  originalOutput: string;
  score: number;
  improvedPrompt?: string;
  improvedOutput?: string;
  elementsImproved?: string[];
  isImproved?: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'practice' | 'streak' | 'improvement' | 'mastery';
  unlockedAt?: number;
  progress: number;
  xpBonus: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isGuest: boolean;
  createdAt: number;
  favoriteCategories: CategoryId[];
  bio?: string;
}

export interface UserProgress {
  totalXP: number;
  promptsPracticed: number;
  challengesCompleted: number;
  promptsImproved: number;
  lessonsCompleted: number;
  currentStreak: number;
  lastPracticedDate: string; // YYYY-MM-DD
  completedChallengeIds: string[];
  completedLessonIds: string[];
  unlockedBadgeIds: string[];
  history: PracticeHistoryItem[];
  savedPrompts: SavedPrompt[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  conceptExplanation: string;
  badPrompt: string;
  badPromptWhy: string;
  betterPrompt: string;
  betterPromptWhy: string;
  proTips: string[];
  practiceChallengeId?: string;
  xpReward: number;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  outputType: OutputType;
  icon: string;
  prompt: string;
  buildingBlocks: {
    role?: string;
    context?: string;
    tone?: string;
    audience?: string;
    constraints?: string;
    format?: string;
    examples?: string;
  };
}

export type PageView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'about'
  | 'dashboard'
  | 'practice'
  | 'challenges'
  | 'learn'
  | 'my-prompts'
  | 'progress'
  | 'profile'
  | 'settings';
