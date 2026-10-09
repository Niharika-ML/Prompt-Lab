import React from 'react';
import { PageView, Language } from '../types';
import { getTranslation } from '../data/translations';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Play,
  CheckCircle2,
  Zap,
  Target,
  Wand2,
  Layers,
  Flame,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  onStartPracticing: (starterPrompt?: string, challengeId?: string) => void;
  onExploreChallenges?: () => void;
  onOpenLearn?: () => void;
  onTryAsGuest?: () => void;
  onNavigate?: (page: PageView) => void;
  language?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPracticing,
  onNavigate,
  language = 'en',
}) => {
  const t = getTranslation(language);

  const sampleStarters = [
    {
      label: '🍲 Biryani Food Shot',
      prompt: 'A picture of delicious chicken biryani.',
      category: 'cooking' as const,
    },
    {
      label: '🎨 Festival Poster',
      prompt: 'Create a college cultural festival poster.',
      category: 'creative' as const,
    },
    {
      label: '📧 Sick Leave Email',
      prompt: 'Write a sick leave email to my manager for 2 days.',
      category: 'career' as const,
    },
  ];

  return (
    <div className="flex flex-col min-h-[85vh] bg-[#060913] text-slate-100 bg-grid-pattern selection:bg-blue-600/30 selection:text-blue-200">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-28 overflow-hidden">
        {/* Ambient atmospheric gradient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[280px] h-[280px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 text-blue-300 border border-blue-500/25 backdrop-blur-md shadow-lg shadow-blue-500/5 hover:border-blue-400/40 transition-all">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-blue-300 font-bold">
              PromptLab AI Studio
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Interactive Prompt Engineering</span>
          </div>

          {/* Logo Brand Title */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
              <Sparkles className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              PromptLab
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            {language === 'te' ? (
              <>
                AI ని కేవలం వాడడమే కాదు.{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  దానితో ఎలా మాట్లాడాలో నేర్చుకోండి.
                </span>
              </>
            ) : language === 'hi' ? (
              <>
                सिर्फ AI का उपयोग न करें।{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  इससे बात करना सीखें।
                </span>
              </>
            ) : (
              <>
                Don't Just Use AI.{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Learn How to Talk to It.
                </span>
              </>
            )}
          </h1>

          {/* Short description */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {language === 'te'
              ? 'మంచి ప్రాంప్ట్‌లు రాయండి, AI స్పందనలను అర్థం చేసుకోండి మరియు మెరుగైన ఫలితాలను సృష్టించండి.'
              : language === 'hi'
              ? 'बेहतर प्रॉम्प्ट लिखें, AI प्रतिक्रियाओं को समझें और बेहतर परिणाम बनाएं।'
              : 'Write better prompts, understand AI responses, and create better results.'}
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartPracticing()}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{t.startPracticing || '🚀 Start Practicing'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (onNavigate) onNavigate('about');
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/90 hover:bg-slate-800 hover:text-white border border-slate-700/80 transition-all duration-200 shadow-lg cursor-pointer hover:border-slate-600"
            >
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>{t.explorePromptLab || '✨ Explore PromptLab'}</span>
            </button>
          </div>

          {/* Quick Starter Chips */}
          <div className="pt-6">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
              Try a Quick Starter Prompt
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {sampleStarters.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onStartPracticing(item.prompt)}
                  className="px-4 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{item.label}</span>
                  <span className="text-slate-500 text-[10px]">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clean Feature Highlights Strip */}
      <section className="py-12 border-t border-slate-900/80 bg-slate-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">3 Skill Levels</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Calibrated practice from beginner fundamentals to advanced multi-step workflows.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Instant Improvement</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  See the difference when clear roles, constraints, and format guidance are added.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Multimodal Creation</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Turn your prompts into structured text, images, or cinematic video concepts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
