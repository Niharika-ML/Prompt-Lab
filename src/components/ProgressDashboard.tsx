import React, { useState } from 'react';
import { UserProgress, PracticeHistoryItem } from '../types';
import { INITIAL_BADGES } from '../data/challenges';
import {
  Trophy,
  Flame,
  Award,
  Clock,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Zap,
  BookOpen,
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  onResetProgress: () => void;
  onReviewPrompt: (item: PracticeHistoryItem) => void;
  getLevelInfo: (xp: number) => {
    title: string;
    level: number;
    nextXP: number;
    currentTierXP: number;
    progress: number;
  };
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onResetProgress,
  onReviewPrompt,
  getLevelInfo,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const levelInfo = getLevelInfo(progress.totalXP);

  const tiers = [
    { title: 'Prompt Beginner', level: 1, reqXP: 0 },
    { title: 'Prompt Explorer', level: 2, reqXP: 100 },
    { title: 'Prompt Builder', level: 3, reqXP: 300 },
    { title: 'Prompt Creator', level: 4, reqXP: 650 },
    { title: 'Prompt Pro', level: 5, reqXP: 1200 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Learning Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Your Prompt Journey</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Track your prompt practice frequency, skill level tier, unlocked achievement badges, and history.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {showConfirmReset ? (
            <div className="flex items-center gap-2 bg-rose-950/40 p-2 rounded-xl border border-rose-500/30">
              <span className="text-xs text-rose-300">Reset all stats?</span>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear practice history and stats"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Practiced</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{progress.promptsPracticed}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Total prompts run</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Challenges</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{progress.completedChallengeIds.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Real-world tasks</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Improved</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{progress.promptsImproved}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Prompt upgrades</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Streak</span>
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{progress.currentStreak}d</span>
          <span className="text-[11px] text-slate-500 block mt-1">Daily consistency</span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 backdrop-blur-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-indigo-300 mb-2">
            <span>Total XP</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{progress.totalXP}</span>
          <span className="text-[11px] text-purple-300 block mt-1">Level {levelInfo.level} Prompter</span>
        </div>
      </div>

      {/* 3. Level Progression Tier Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Current Rank</span>
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>{levelInfo.title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Tier {levelInfo.level} of 5
              </span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Next Milestone</span>
            <span className="text-sm font-bold text-indigo-300">
              {progress.totalXP >= 1200 ? 'Max Level Reached!' : `${levelInfo.nextXP - progress.totalXP} XP to next level`}
            </span>
          </div>
        </div>

        {/* Level step indicator */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {tiers.map((t) => {
            const isReached = progress.totalXP >= t.reqXP;
            const isCurrent = levelInfo.level === t.level;
            return (
              <div key={t.level} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-4 ring-indigo-500/20'
                      : isReached
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isReached ? <CheckCircle2 className="w-4 h-4" /> : t.level}
                </div>
                <span className={`text-[11px] font-semibold hidden sm:block ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                  {t.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{t.reqXP} XP</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1000"
            style={{ width: `${Math.min(100, levelInfo.progress)}%` }}
          />
        </div>
      </div>

      {/* 4. Achievement Badges Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Achievement Badges</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Earn trophies and bonus XP as you build your prompt writing habits.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            {progress.unlockedBadgeIds.length} / {INITIAL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_BADGES.map((b) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-slate-900/80 border-indigo-500/30 shadow-lg shadow-indigo-950/30'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                      : 'bg-slate-800/60 border border-slate-800'
                  }`}
                >
                  {isUnlocked ? b.icon : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {b.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-purple-400 font-mono">
                      +{b.xpBonus} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
                  {isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-2 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Practice History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Recent Practice History</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your previous prompts, quality scores, and improvements.
            </p>
          </div>
        </div>

        {progress.history.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
            <p className="text-sm text-slate-400">No practice sessions recorded yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Head over to the Practice tab to write your first prompt and see your score!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.history.map((item) => (
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
                    onClick={() => onReviewPrompt(item)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Load into practice workspace"
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
