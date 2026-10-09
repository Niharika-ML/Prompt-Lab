import React, { useState, useEffect } from 'react';
import { PageView, Challenge, PracticeHistoryItem, CategoryId, OutputType } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { usePromptLab } from './hooks/usePromptLab';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { AboutPage } from './components/AboutPage';
import { DashboardPage } from './components/DashboardPage';
import { PracticeWorkspace } from './components/PracticeWorkspace';
import { DailyChallengesPage } from './components/DailyChallengesPage';
import { LearningPage } from './components/LearningPage';
import { MyPromptsPage } from './components/MyPromptsPage';
import { ProgressDashboard } from './components/ProgressDashboard';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { AuthModal } from './components/AuthModal';
import { AuthWelcomeScreen } from './components/AuthWelcomeScreen';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { user, isGuest, updateProfile } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [practiceChallengeId, setPracticeChallengeId] = useState<string | undefined>(undefined);
  const [practiceInitialPrompt, setPracticeInitialPrompt] = useState<string | undefined>(undefined);
  const [practiceCategory, setPracticeCategory] = useState<CategoryId | undefined>(undefined);
  const [practiceOutputType, setPracticeOutputType] = useState<OutputType>('text');

  // Track if first-time user has completed auth or selected Continue as Guest
  const [hasPassedWelcome, setHasPassedWelcome] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('promptlab_user_auth_v2');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          if (parsed && !parsed.isGuest) return true;
        } catch (e) {}
      }
      return localStorage.getItem('promptlab_welcome_done') === 'true';
    }
    return false;
  });

  // Dark / Light Mode (Requirement 34)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptlab_theme_v2');
      if (saved) return saved === 'dark';
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('promptlab_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('promptlab_theme_v2', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const {
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
  } = usePromptLab();

  const levelInfo = getLevelInfo(progress.totalXP);

  // Transitions to practice page
  const handleStartPracticing = (
    starterPrompt?: string,
    challengeId?: string,
    category?: CategoryId,
    outputType: OutputType = 'text'
  ) => {
    setPracticeInitialPrompt(starterPrompt);
    setPracticeChallengeId(challengeId);
    setPracticeCategory(category);
    setPracticeOutputType(outputType);
    setCurrentPage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChallenge = (challenge: Challenge) => {
    setPracticeChallengeId(challenge.id);
    setPracticeInitialPrompt(challenge.sampleStarter || '');
    setPracticeCategory(challenge.category);
    if (challenge.outputType) setPracticeOutputType(challenge.outputType);
    setCurrentPage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewPrompt = (item: PracticeHistoryItem) => {
    setPracticeChallengeId(item.challengeId);
    setPracticeInitialPrompt(item.originalPrompt);
    setPracticeCategory(item.category);
    setPracticeOutputType(item.outputType || 'text');
    setCurrentPage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200 transition-colors duration-200">
      {/* Navigation (Requirement 3 & 32) */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalXP={progress.totalXP}
        streak={progress.currentStreak}
        beginnerMode={beginnerMode}
        onToggleBeginnerMode={setBeginnerMode}
        language={language}
        onSelectLanguage={setLanguage}
        levelTitle={levelInfo.title}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Global Auth Modal for quick prompts */}
      <AuthModal />

      {/* Floating Badge Notification */}
      {recentBadgeUnlocked && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-blue-600/40 flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
              New Badge Unlocked!
            </span>
            <span className="text-sm font-extrabold">{recentBadgeUnlocked}</span>
          </div>
        </div>
      )}

      {/* Main Pages (Requirement 1, 2, 3: First Experience Auth, Simple Home, Informative About) */}
      <main className="flex-1">
        {!hasPassedWelcome && isGuest && currentPage !== 'login' && currentPage !== 'signup' ? (
          <AuthWelcomeScreen
            language={language}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueAsGuest={() => {
              setHasPassedWelcome(true);
              localStorage.setItem('promptlab_welcome_done', 'true');
              setCurrentPage('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {currentPage === 'landing' && (
              <LandingPage
                language={language}
                onStartPracticing={handleStartPracticing}
                onExploreChallenges={() => setCurrentPage('challenges')}
                onOpenLearn={() => setCurrentPage('learn')}
                onTryAsGuest={() => handleStartPracticing()}
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentPage === 'login' && (
              <LoginPage
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSuccess={() => {
                  setHasPassedWelcome(true);
                  localStorage.setItem('promptlab_welcome_done', 'true');
                  setCurrentPage('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentPage === 'signup' && (
              <SignUpPage
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSuccess={() => {
                  setHasPassedWelcome(true);
                  localStorage.setItem('promptlab_welcome_done', 'true');
                  setCurrentPage('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                language={language}
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartPracticing={() => handleStartPracticing()}
              />
            )}

            {currentPage === 'dashboard' && (
              <DashboardPage
                user={user}
                progress={progress}
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartPracticeWithPrompt={(prompt, challengeId) =>
                  handleStartPracticing(prompt, challengeId)
                }
                getLevelInfo={getLevelInfo}
              />
            )}

            {currentPage === 'practice' && (
              <PracticeWorkspace
                language={language}
                initialChallengeId={practiceChallengeId}
                initialPrompt={practiceInitialPrompt}
                initialCategory={practiceCategory}
                initialOutputType={practiceOutputType}
                beginnerMode={beginnerMode}
                isGuest={isGuest}
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRecordPractice={recordPractice}
                onRecordImprovement={recordImprovement}
                onSavePrompt={savePrompt}
              />
            )}

            {currentPage === 'challenges' && (
              <DailyChallengesPage
                onSelectChallenge={handleSelectChallenge}
                completedChallengeIds={progress.completedChallengeIds}
              />
            )}

            {currentPage === 'learn' && (
              <LearningPage
                onStartPracticeWithPrompt={(prompt) => handleStartPracticing(prompt)}
                onCompleteLesson={completeLesson}
                completedLessonIds={progress.completedLessonIds}
              />
            )}

            {currentPage === 'my-prompts' && (
              <MyPromptsPage
                savedPrompts={progress.savedPrompts}
                onOpenInPractice={(prompt, cat, type) => handleStartPracticing(prompt, undefined, cat, type)}
                onDeletePrompt={deletePrompt}
                onToggleFavorite={toggleFavoritePrompt}
                onDuplicatePrompt={duplicatePrompt}
              />
            )}

            {currentPage === 'progress' && (
              <ProgressDashboard
                progress={progress}
                onResetProgress={resetProgress}
                onReviewPrompt={handleReviewPrompt}
                getLevelInfo={getLevelInfo}
              />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                user={user}
                progress={progress}
                onUpdateProfile={updateProfile}
                levelTitle={levelInfo.title}
                levelNumber={levelInfo.level}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsPage
                language={language}
                onSelectLanguage={setLanguage}
                beginnerMode={beginnerMode}
                onToggleBeginnerMode={setBeginnerMode}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">PromptLab</span>
            <span>— Don't Just Use AI. Learn How to Talk to It.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => setCurrentPage('landing')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('practice')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Practice
            </button>
            <button
              onClick={() => setCurrentPage('learn')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Learn
            </button>
            <button
              onClick={() => setCurrentPage('challenges')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Challenges
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              About
            </button>
            {isGuest ? (
              <button
                onClick={() => setCurrentPage('login')}
                className="hover:text-blue-400 transition-colors cursor-pointer font-semibold"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('my-prompts')}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                My Prompts
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
