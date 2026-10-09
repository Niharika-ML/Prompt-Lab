import React, { useState } from 'react';
import { Challenge, CategoryId, Difficulty } from '../types';
import { CATEGORIES, CHALLENGES } from '../data/challenges';
import { Target, CheckCircle2, Clock, Trophy, Flame, Filter, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

interface DailyChallengesPageProps {
  onSelectChallenge: (challenge: Challenge) => void;
  completedChallengeIds: string[];
}

export const DailyChallengesPage: React.FC<DailyChallengesPageProps> = ({
  onSelectChallenge,
  completedChallengeIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  // Filter challenges
  const filtered = CHALLENGES.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getDifficultyBadge = (d: Difficulty) => {
    switch (d) {
      case 'beginner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Beginner
          </span>
        );
      case 'intermediate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Intermediate
          </span>
        );
      case 'advanced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Advanced
          </span>
        );
    }
  };

  const featuredChallenge = CHALLENGES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Practice Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Daily Challenges</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Choose a realistic scenario, draft your prompt, generate instant AI outputs, and improve your prompt score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Completed</span>
              <span className="text-lg font-extrabold text-white">
                {completedChallengeIds.length} / {CHALLENGES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Challenge Banner */}
      {featuredChallenge && (
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Daily Featured Challenge
                </span>
                {getDifficultyBadge(featuredChallenge.difficulty)}
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                  +{featuredChallenge.xpReward} XP
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {featuredChallenge.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {featuredChallenge.scenario}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Est: {featuredChallenge.estTime}
                </span>
                <span>•</span>
                <span>Category: {CATEGORIES.find((c) => c.id === featuredChallenge.category)?.name}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectChallenge(featuredChallenge)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer self-start md:self-auto shrink-0"
            >
              <span>Practice This Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mt-10 space-y-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories ({CHALLENGES.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = CHALLENGES.filter((c) => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Difficulty:
          </span>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((challenge) => {
          const isDone = completedChallengeIds.includes(challenge.id);
          const categoryObj = CATEGORIES.find((c) => c.id === challenge.category);

          return (
            <div
              key={challenge.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 ${
                isDone
                  ? 'bg-slate-900/40 border-emerald-500/20 hover:border-emerald-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{categoryObj?.icon}</span>
                    <span className="text-xs font-semibold text-slate-400">{categoryObj?.name}</span>
                  </div>
                  {getDifficultyBadge(challenge.difficulty)}
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {challenge.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {challenge.scenario}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-purple-400">
                    <Trophy className="w-3.5 h-3.5" />
                    +{challenge.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {challenge.estTime}
                  </span>
                </div>

                <button
                  onClick={() => onSelectChallenge(challenge)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </>
                  ) : (
                    <>
                      <span>Practice</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
