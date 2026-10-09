import React, { useState } from 'react';
import { UserProfile, UserProgress } from '../types';
import { CATEGORIES } from '../data/challenges';
import { INITIAL_BADGES } from '../data/challenges';
import {
  User,
  Mail,
  Trophy,
  Flame,
  Award,
  Check,
  Edit2,
  Bookmark,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  progress: UserProgress;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  levelTitle: string;
  levelNumber: number;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  progress,
  onUpdateProfile,
  levelTitle,
  levelNumber,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');

  const handleSave = () => {
    onUpdateProfile({ name, bio });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Niharika'}
              alt={user.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-indigo-500 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {levelNumber}
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user.name}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 self-center sm:self-auto">
                {levelTitle}
              </span>
              {user.isGuest && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                  Guest Session
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user.email}</span>
            </p>

            <p className="text-xs text-slate-300 max-w-lg mt-2 leading-relaxed">
              {user.bio || 'Practicing prompt engineering to talk effectively with generative AI.'}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer self-center sm:self-start"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Edit mode form */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Bio / Goals</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        )}
      </div>

      {/* 2. Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Prompts Practiced</span>
          <span className="text-2xl font-extrabold text-white">{progress.promptsPracticed}</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Prompts Improved</span>
          <span className="text-2xl font-extrabold text-white">{progress.promptsImproved}</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Daily Streak</span>
          <span className="text-2xl font-extrabold text-amber-400">{progress.currentStreak} Days</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Total XP</span>
          <span className="text-2xl font-extrabold text-purple-400">{progress.totalXP}</span>
        </div>
      </div>

      {/* 3. Unlocked Badges Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Earned Badges & Milestones</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_BADGES.map((b) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-indigo-500/30'
                    : 'bg-slate-950/30 border-slate-800/80 opacity-50'
                }`}
              >
                <div className="text-2xl w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
