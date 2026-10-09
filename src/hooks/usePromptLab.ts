import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, Language, Challenge, PracticeHistoryItem, SavedPrompt, OutputType, CategoryId } from '../types';
import { INITIAL_BADGES } from '../data/challenges';
import { playSound } from '../utils/sound';

const STORAGE_KEY_PROGRESS = 'promptlab_user_progress_v2';
const STORAGE_KEY_LANG = 'promptlab_language_v2';
const STORAGE_KEY_BEGINNER = 'promptlab_beginner_mode_v2';

const DEFAULT_PROGRESS: UserProgress = {
  totalXP: 50,
  promptsPracticed: 2,
  challengesCompleted: 1,
  promptsImproved: 1,
  lessonsCompleted: 0,
  currentStreak: 1,
  lastPracticedDate: new Date().toISOString().split('T')[0],
  completedChallengeIds: [],
  completedLessonIds: [],
  unlockedBadgeIds: ['first-prompt'],
  history: [
    {
      id: 'initial_history_1',
      timestamp: Date.now() - 3600000,
      challengeTitle: 'Warm Birthday WhatsApp Invite',
      category: 'social',
      outputType: 'text',
      originalPrompt: 'Write a birthday invite for my friend Arjun turning 25 tomorrow.',
      originalOutput: '🎉 Happy Birthday Arjun! Join us for drinks and food tomorrow at 7 PM.',
      score: 72,
      improvedPrompt: 'Act as a fun, caring best friend. Write an energetic WhatsApp invite for Arjun\'s 25th surprise rooftop gathering tomorrow at 7 PM. Keep under 65 words with secret RSVP.',
      improvedOutput: '🎉 Shhh! Arjun is turning 25! Join us for a secret surprise rooftop dinner tomorrow at 7:00 PM. Reply privately to RSVP! 🤫✨',
      isImproved: true,
    },
  ],
  savedPrompts: [
    {
      id: 'saved_biryani_promo',
      title: 'Chicken Biryani Poster Promo',
      promptText: 'Act as a food marketing designer. Write promotional poster copy for Spice Symphony\'s weekend special Royal Hyderabadi Chicken Biryani. Free dessert with order. Under 100 words.',
      outputType: 'text',
      category: 'shopping',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      isFavorite: true,
      lastScore: 88,
    },
    {
      id: 'saved_interview_star',
      title: 'Fintech PM Behavioral STAR Guide',
      promptText: 'Act as an executive hiring manager. Give me a model answer for a project failure using the STAR method for a Senior PM role in payments.',
      outputType: 'text',
      category: 'career',
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000,
      isFavorite: false,
      lastScore: 92,
    },
  ],
};

export function usePromptLab() {
  const [language, setLanguageState] = useState<Language>('en');
  const [beginnerMode, setBeginnerModeState] = useState<boolean>(true);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [recentBadgeUnlocked, setRecentBadgeUnlocked] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        const today = new Date().toISOString().split('T')[0];
        const lastDate = parsed.lastPracticedDate;
        let streak = parsed.currentStreak || 1;

        if (lastDate && lastDate !== today) {
          const prevDate = new Date();
          prevDate.setDate(prevDate.getDate() - 1);
          const yesterdayStr = prevDate.toISOString().split('T')[0];
          if (lastDate !== yesterdayStr) {
            streak = 1;
          }
        }
        setProgress({
          ...DEFAULT_PROGRESS,
          ...parsed,
          savedPrompts: parsed.savedPrompts || DEFAULT_PROGRESS.savedPrompts,
          currentStreak: streak,
        });
      }

      const storedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
      if (storedLang && ['en', 'te', 'hi'].includes(storedLang)) {
        setLanguageState(storedLang);
      }

      const storedBeginner = localStorage.getItem(STORAGE_KEY_BEGINNER);
      if (storedBeginner !== null) {
        setBeginnerModeState(storedBeginner === 'true');
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
  }, []);

  const saveProgress = useCallback((newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(newProgress));
    } catch (e) {
      console.warn('Failed to persist progress', e);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {}
  }, []);

  const setBeginnerMode = useCallback((enabled: boolean) => {
    setBeginnerModeState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_BEGINNER, String(enabled));
    } catch (e) {}
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#fbbf24'],
    });
  }, []);

  // Gamification badges check
  const checkBadges = useCallback((p: UserProgress): UserProgress => {
    const unlocked = [...p.unlockedBadgeIds];
    let extraXP = 0;
    let newlyUnlocked: string | null = null;

    if (p.promptsPracticed >= 1 && !unlocked.includes('first-prompt')) {
      unlocked.push('first-prompt');
      extraXP += 50;
      newlyUnlocked = 'First Prompt Spark';
    }

    if (p.promptsImproved >= 1 && !unlocked.includes('prompt-improved')) {
      unlocked.push('prompt-improved');
      extraXP += 75;
      newlyUnlocked = 'First Improvement';
    }

    if (p.promptsPracticed >= 10 && !unlocked.includes('10-prompts')) {
      unlocked.push('10-prompts');
      extraXP += 100;
      newlyUnlocked = '10 Prompts Mastered';
    }

    if (p.currentStreak >= 7 && !unlocked.includes('streak-7')) {
      unlocked.push('streak-7');
      extraXP += 150;
      newlyUnlocked = '7-Day Streak Master';
    }

    if (p.challengesCompleted >= 5 && !unlocked.includes('challenges-5')) {
      unlocked.push('challenges-5');
      extraXP += 150;
      newlyUnlocked = 'Prompt Builder';
    }

    if (p.totalXP >= 1000 && !unlocked.includes('ai-creator')) {
      unlocked.push('ai-creator');
      extraXP += 250;
      newlyUnlocked = 'AI Creator';
    }

    if (newlyUnlocked) {
      setRecentBadgeUnlocked(newlyUnlocked);
      playSound('badge');
      triggerConfetti();
      setTimeout(() => setRecentBadgeUnlocked(null), 5000);
    }

    return {
      ...p,
      totalXP: p.totalXP + extraXP,
      unlockedBadgeIds: unlocked,
    };
  }, [triggerConfetti]);

  // Record practice: +5 XP for general prompt, +20 XP if completing challenge
  const recordPractice = useCallback(
    (
      challenge: Challenge | null,
      prompt: string,
      output: string,
      score: number,
      outputType: OutputType = 'text'
    ) => {
      const today = new Date().toISOString().split('T')[0];
      const xpGain = challenge ? 20 : 5;

      const historyItem: PracticeHistoryItem = {
        id: `practice_${Date.now()}`,
        timestamp: Date.now(),
        challengeId: challenge?.id,
        challengeTitle: challenge?.title || 'Free Playground Practice',
        category: challenge?.category || 'education',
        outputType,
        originalPrompt: prompt,
        originalOutput: output,
        score,
      };

      const updatedCompleted = challenge && !progress.completedChallengeIds.includes(challenge.id)
        ? [...progress.completedChallengeIds, challenge.id]
        : progress.completedChallengeIds;

      const newProgress: UserProgress = {
        ...progress,
        totalXP: progress.totalXP + xpGain,
        promptsPracticed: progress.promptsPracticed + 1,
        challengesCompleted: challenge ? updatedCompleted.length : progress.challengesCompleted,
        completedChallengeIds: updatedCompleted,
        lastPracticedDate: today,
        history: [historyItem, ...progress.history.slice(0, 39)],
      };

      const finalProgress = checkBadges(newProgress);
      saveProgress(finalProgress);
      playSound('success');
    },
    [progress, checkBadges, saveProgress]
  );

  // Record improvement: +10 XP
  const recordImprovement = useCallback(
    (
      challenge: Challenge | null,
      originalPrompt: string,
      improvedPrompt: string,
      improvedOutput: string,
      elementsAdded: string[]
    ) => {
      const xpGain = 10;
      const historyCopy = [...progress.history];

      if (historyCopy.length > 0) {
        historyCopy[0] = {
          ...historyCopy[0],
          improvedPrompt,
          improvedOutput,
          elementsImproved: elementsAdded,
          isImproved: true,
        };
      }

      const newProgress: UserProgress = {
        ...progress,
        totalXP: progress.totalXP + xpGain,
        promptsImproved: progress.promptsImproved + 1,
        history: historyCopy,
      };

      const finalProgress = checkBadges(newProgress);
      saveProgress(finalProgress);
      playSound('improve');
      triggerConfetti();
    },
    [progress, checkBadges, saveProgress, triggerConfetti]
  );

  // Complete Lesson: +15 XP
  const completeLesson = useCallback(
    (lessonId: string) => {
      if (progress.completedLessonIds.includes(lessonId)) return;

      const updatedLessons = [...progress.completedLessonIds, lessonId];
      const newProgress: UserProgress = {
        ...progress,
        totalXP: progress.totalXP + 15,
        lessonsCompleted: updatedLessons.length,
        completedLessonIds: updatedLessons,
      };

      const finalProgress = checkBadges(newProgress);
      saveProgress(finalProgress);
      playSound('success');
      triggerConfetti();
    },
    [progress, checkBadges, saveProgress, triggerConfetti]
  );

  // Save prompt to library
  const savePrompt = useCallback(
    (
      title: string,
      promptText: string,
      category: CategoryId,
      outputType: OutputType,
      lastOutput?: string
    ) => {
      const newPrompt: SavedPrompt = {
        id: `saved_${Date.now()}`,
        title,
        promptText,
        category,
        outputType,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
        lastOutput,
      };

      const newProgress: UserProgress = {
        ...progress,
        savedPrompts: [newPrompt, ...progress.savedPrompts],
      };

      saveProgress(newProgress);
      playSound('success');
    },
    [progress, saveProgress]
  );

  const deletePrompt = useCallback(
    (id: string) => {
      const newProgress: UserProgress = {
        ...progress,
        savedPrompts: progress.savedPrompts.filter((p) => p.id !== id),
      };
      saveProgress(newProgress);
      playSound('click');
    },
    [progress, saveProgress]
  );

  const toggleFavoritePrompt = useCallback(
    (id: string) => {
      const newProgress: UserProgress = {
        ...progress,
        savedPrompts: progress.savedPrompts.map((p) =>
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ),
      };
      saveProgress(newProgress);
      playSound('click');
    },
    [progress, saveProgress]
  );

  const duplicatePrompt = useCallback(
    (item: SavedPrompt) => {
      const dup: SavedPrompt = {
        ...item,
        id: `saved_${Date.now()}`,
        title: `${item.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const newProgress: UserProgress = {
        ...progress,
        savedPrompts: [dup, ...progress.savedPrompts],
      };
      saveProgress(newProgress);
      playSound('success');
    },
    [progress, saveProgress]
  );

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    setProgress(DEFAULT_PROGRESS);
  }, []);

  // Compute User Levels (Requirement 14):
  // Level 1 — Prompt Beginner
  // Level 2 — Prompt Explorer
  // Level 3 — Prompt Builder
  // Level 4 — Prompt Pro
  // Level 5 — AI Creator
  const getLevelInfo = useCallback((xp: number) => {
    if (xp < 100) return { title: 'Prompt Beginner', level: 1, nextXP: 100, currentTierXP: 0, progress: (xp / 100) * 100 };
    if (xp < 300) return { title: 'Prompt Explorer', level: 2, nextXP: 300, currentTierXP: 100, progress: ((xp - 100) / 200) * 100 };
    if (xp < 650) return { title: 'Prompt Builder', level: 3, nextXP: 650, currentTierXP: 300, progress: ((xp - 300) / 350) * 100 };
    if (xp < 1200) return { title: 'Prompt Pro', level: 4, nextXP: 1200, currentTierXP: 650, progress: ((xp - 650) / 550) * 100 };
    return { title: 'AI Creator', level: 5, nextXP: 2500, currentTierXP: 1200, progress: 100 };
  }, []);

  return {
    language,
    setLanguage,
    beginnerMode,
    setBeginnerMode,
    progress,
    recentBadgeUnlocked,
    recordPractice,
    recordImprovement,
    completeLesson,
    savePrompt,
    deletePrompt,
    toggleFavoritePrompt,
    duplicatePrompt,
    resetProgress,
    getLevelInfo,
  };
}
