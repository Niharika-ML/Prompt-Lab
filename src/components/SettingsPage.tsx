import React from 'react';
import { Language } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Globe,
  HelpCircle,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

interface SettingsPageProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  beginnerMode: boolean;
  onToggleBeginnerMode: (val: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  language,
  onSelectLanguage,
  beginnerMode,
  onToggleBeginnerMode,
}) => {
  const { user, isGuest, logout, openAuthModal } = useAuth();

  const languages: Array<{ code: Language; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English (US)' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी (Hindi)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>App Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your PromptLab learning experience, language, and account options.
        </p>
      </div>

      {/* 1. Language Preferences */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Interface Language</h3>
            <p className="text-xs text-slate-400">
              Select your preferred language for explanations, hints, and navigation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => onSelectLanguage(l.code)}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                language === l.code
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">{l.native}</span>
                <span className="text-[10px] text-slate-500">{l.label}</span>
              </div>
              {language === l.code && <Check className="w-4 h-4 text-indigo-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Beginner Mode Toggle */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>Beginner Mode</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                beginnerMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {beginnerMode ? 'Enabled' : 'Disabled'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Provides plain-language explanations (e.g. "Role means: AI ni evarila act cheyyalo cheppadam"), building block tooltips, and encouraging feedback instead of technical jargon.
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggleBeginnerMode(!beginnerMode)}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
            beginnerMode ? 'bg-indigo-600' : 'bg-slate-800'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              beginnerMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 3. Account Settings */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Account Status</h3>
            <p className="text-xs text-slate-400">
              {isGuest
                ? 'You are practicing as a Guest. Connect an account to sync prompts across devices.'
                : `Logged in as ${user.email}`}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          {isGuest ? (
            <button
              onClick={() => openAuthModal('signup')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Sign Up or Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out (Switch to Guest)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
