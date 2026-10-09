import React from 'react';
import { PageView, Language } from '../types';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../data/translations';
import { Sparkles, LogIn, UserPlus, ArrowRight, ShieldCheck, Zap, Award, Flame } from 'lucide-react';

interface AuthWelcomeScreenProps {
  onNavigate: (page: PageView) => void;
  onContinueAsGuest: () => void;
  language: Language;
}

export const AuthWelcomeScreen: React.FC<AuthWelcomeScreenProps> = ({
  onNavigate,
  onContinueAsGuest,
  language,
}) => {
  const t = getTranslation(language);
  const { loginWithGoogle } = useAuth();

  const handleGoogleQuick = async () => {
    await loginWithGoogle();
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#060913] bg-grid-pattern selection:bg-blue-600/30 selection:text-blue-200">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative w-full max-w-lg z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800/90 relative backdrop-blur-2xl text-center space-y-7">
          {/* Top Logo & AI PLAYGROUND pill */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI PLAYGROUND</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                PromptLab
              </h1>
            </div>
          </div>

          {/* Headline & Description */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
              “Learn to Prompt. Create with AI. Get Better Every Day.”
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {t.subtagline || 'Write better prompts, understand AI responses, and create better results.'}
            </p>
          </div>

          {/* Value Props Pills */}
          <div className="grid grid-cols-3 gap-2.5 py-2">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center">
              <Flame className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Daily Streak</span>
              <span className="text-[10px] text-slate-500">Build habit</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center">
              <Zap className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Earn XP</span>
              <span className="text-[10px] text-slate-500">Level up</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center">
              <Award className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Save Prompts</span>
              <span className="text-[10px] text-slate-500">Your library</span>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <LogIn className="w-4 h-4 text-blue-400" />
                <span>🔐 {t.login}</span>
              </button>

              <button
                onClick={() => onNavigate('signup')}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>✨ {t.signUp}</span>
              </button>
            </div>

            <button
              onClick={handleGoogleQuick}
              className="w-full py-3 px-4 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Continue as Guest option with encouragement */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={onContinueAsGuest}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 py-1.5 font-medium hover:underline"
            >
              <span>{t.continueAsGuest}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-normal">
              Creating an account lets you save prompts, track your daily streak, and unlock advanced prompt engineering badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
