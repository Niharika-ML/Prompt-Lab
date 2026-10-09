import React from 'react';
import { PageView, Language } from '../types';
import { getTranslation } from '../data/translations';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Bot,
  Image as ImageIcon,
  Video as VideoIcon,
  Wand2,
  Target,
  Flame,
  Award,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Layers,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
  onStartPracticing: () => void;
  language?: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onStartPracticing,
  language = 'en',
}) => {
  const t = getTranslation(language);

  const mainFeatures = [
    {
      icon: '🧠',
      title: 'Prompt Learning',
      desc: 'Master the 8 core prompt dimensions (Role, Task, Context, Tone, Audience, Constraints, Format, Examples).',
    },
    {
      icon: '🤖',
      title: 'AI Text Generation',
      desc: 'Execute real prompts against cutting-edge Gemini AI models to get intelligent, context-aware responses.',
    },
    {
      icon: '🎨',
      title: 'Image Creation',
      desc: 'Turn your exact descriptive prompt into a visual image representation using dedicated image generation models.',
    },
    {
      icon: '🎬',
      title: 'Video Creation',
      desc: 'Transform narrative prompts into cinematic video concepts with integrated playback, regeneration, and download tools.',
    },
    {
      icon: '✨',
      title: 'Prompt Improvement',
      desc: 'Transform vague prompts into rich, high-performing instructions and see the dramatic difference in output quality.',
    },
    {
      icon: '🎯',
      title: 'Beginner / Intermediate / Advanced Levels',
      desc: 'Calibrated progression matching your skill stage—from foundational clarity to complex enterprise workflows.',
    },
    {
      icon: '🔥',
      title: 'Daily Streak',
      desc: 'Build a consistent daily practice habit with automated streak tracking and motivational milestones.',
    },
    {
      icon: '🏆',
      title: 'XP and Progress',
      desc: 'Earn experience points for each prompt tested, refined, and mastered, unlocking mastery badges along the way.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Write Prompt',
      desc: 'Draft your initial idea using prompt building blocks or real-world tasks.',
    },
    {
      step: '02',
      title: 'Analyze Prompt',
      desc: 'Instantly diagnose clarity, specificity, and missing parameters.',
    },
    {
      step: '03',
      title: 'Generate Output',
      desc: 'Execute live text, image, or video output matching your exact prompt intent.',
    },
    {
      step: '04',
      title: 'Improve Prompt',
      desc: 'Apply AI-guided coaching to inject roles, boundaries, and formats.',
    },
    {
      step: '05',
      title: 'Generate Better Output',
      desc: 'Re-run the enhanced prompt and inspect the side-by-side difference.',
    },
    {
      step: '06',
      title: 'Learn and Practice',
      desc: 'Level up through daily challenges, save favorite prompts, and earn XP.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 selection:bg-blue-600/30 selection:text-blue-200">
      {/* 1. Header Hero */}
      <div className="text-center max-w-3xl mx-auto pt-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/25 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>About PromptLab</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Don't Just Use AI.{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Learn How to Talk to It.
          </span>
        </h1>

        <p className="text-lg text-slate-300 font-medium">
          “Write better prompts. Create better results.”
        </p>

        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          PromptLab is an interactive prompt engineering playground designed to help anyone—from beginners to professionals—master how to communicate with modern artificial intelligence.
        </p>
      </div>

      {/* 2. What is PromptLab? & Why PromptLab was created? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xl">
            💡
          </div>
          <h2 className="text-2xl font-bold text-white">What is PromptLab?</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            PromptLab is an all-in-one interactive platform where you learn, practice, test, and master prompt engineering. Instead of just reading passive advice, PromptLab provides an active laboratory where you write prompts, generate real AI outputs (text, images, and video), analyze prompt quality, and see the immediate difference that structured prompting makes.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-xl">
            🚀
          </div>
          <h2 className="text-2xl font-bold text-white">Why PromptLab was created?</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Most people get underwhelming results from AI because they type vague, one-line questions. AI models thrive on specificity, persona, constraints, and structured formats. We created PromptLab to bridge the gap between human ideas and AI capabilities, empowering everyone to talk to AI with clarity and confidence.
          </p>
        </div>
      </div>

      {/* 3. The Core Workflow */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            How PromptLab Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            The Core Practice Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every session guides you step-by-step from an initial draft to mastery:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <span className="font-mono text-2xl font-black text-indigo-500/40 block mb-2">
                  {item.step}
                </span>
                <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Main Features */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Main Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A comprehensive suite of tools built for real-world prompt mastery:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-panel-interactive border border-slate-800/90 flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3 className="font-bold text-white text-sm mb-1.5">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Who Can Use It? */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-purple-950/30 border border-slate-800 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            Audience
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Who Can Use PromptLab?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-xl block mb-2">🎓</span>
            <h4 className="font-bold text-white mb-1">Students & Academics</h4>
            <p className="text-slate-400">Master essay outlining, study schedules, research prompts, and conceptual breakdowns.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-xl block mb-2">💼</span>
            <h4 className="font-bold text-white mb-1">Working Professionals</h4>
            <p className="text-slate-400">Draft high-impact emails, business summaries, negotiation strategies, and reports.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-xl block mb-2">🎨</span>
            <h4 className="font-bold text-white mb-1">Creators & Designers</h4>
            <p className="text-slate-400">Formulate precise visual prompts for posters, social captions, and video concepts.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-xl block mb-2">💻</span>
            <h4 className="font-bold text-white mb-1">Developers & Engineers</h4>
            <p className="text-slate-400">Create robust architectural prompts, regex queries, API specs, and debugging scripts.</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStartPracticing}
            className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>🚀 Start Practicing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('learn')}
            className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>📚 Explore Learn Modules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
