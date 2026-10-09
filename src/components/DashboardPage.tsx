import React from 'react';
import { UserProfile, UserProgress, PageView, PracticeHistoryItem } from '../types';
import { CHALLENGES } from '../data/challenges';
import {
  Sparkles,
  Flame,
  Trophy,
  TrendingUp,
  Bookmark,
  Target,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  Play,
} from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  progress: UserProgress;
  onNavigate: (page: PageView) => void;
  onStartPracticeWithPrompt: (prompt?: string, challengeId?: string) => void;
  getLevelInfo: (xp: number) => {
    title: string;
    level: number;
    nextXP: number;
    currentTierXP: number;
    progress: number;
  };
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  progress,
  onNavigate,
  onStartPracticeWithPrompt,
  getLevelInfo,
}) => {
  const levelInfo = getLevelInfo(progress.totalXP);
  const todaysChallenge = CHALLENGES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>PromptLab Learning Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Ready to sharpen your prompt writing? Practice with real Gemini AI outputs, analyze your prompt dimensions, and level up your skills.
            </p>
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>Jump into Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Stats Bar (Requirement 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Prompts Practiced</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{progress.promptsPracticed}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Generations evaluated</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Prompts Improved</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{progress.promptsImproved}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Upgrades compared</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Current Level</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-white truncate block">{levelInfo.title}</span>
          <span className="text-[11px] text-purple-400 font-mono block mt-1">Tier {levelInfo.level} of 5</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total XP</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{progress.totalXP}</span>
          <span className="text-[11px] text-amber-400 block mt-1">XP earned</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{progress.currentStreak} Days</span>
          <span className="text-[11px] text-slate-500 block mt-1">Keep it rolling!</span>
        </div>
      </div>

      {/* 3. Four Core Action Cards (Requirement 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Continue Practice */}
        <div
          onClick={() => onNavigate('practice')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-indigo-300 transition-colors">
              Continue Practice
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open the interactive prompt playground with real-time AI generation and 8-pillar analysis.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Open Playground</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Today's Challenge */}
        <div
          onClick={() => onStartPracticeWithPrompt(todaysChallenge.sampleStarter, todaysChallenge.id)}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors">
                Today's Challenge
              </h3>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                +{todaysChallenge.xpReward} XP
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {todaysChallenge.title}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Solve Challenge</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Learn Prompting */}
        <div
          onClick={() => onNavigate('learn')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">
              Learn Prompting
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              12 bite-sized lessons explaining Role, Context, Tone, Constraints, and few-shot examples.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Explore 12 Lessons</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* My Saved Prompts */}
        <div
          onClick={() => onNavigate('my-prompts')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors">
                My Saved Prompts
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {progress.savedPrompts.length} Saved
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage your personal library of saved, improved, and favorite prompts.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>View Library</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4. Recent Prompt History (Requirement 3) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Recent Prompt Practice History</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Previous practice sessions, quality scores, and improvements.
            </p>
          </div>

          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {progress.history.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
            <p className="text-sm text-slate-400">No prompts practiced yet.</p>
            <button
              onClick={() => onNavigate('practice')}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Start Practicing Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.challengeTitle}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {item.outputType || 'text'}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 line-clamp-1">
                    "{item.originalPrompt}"
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Quality Score</span>
                    <span
                      className={`text-sm font-bold ${
                        item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-sky-400' : 'text-amber-400'
                      }`}
                    >
                      {item.score} / 100
                    </span>
                  </div>

                  <button
                    onClick={() => onStartPracticeWithPrompt(item.originalPrompt, item.challengeId)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Re-open in Practice Workspace"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
