import React, { useState } from 'react';
import { LESSONS } from '../data/lessons';
import { Lesson } from '../types';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Play,
  Lightbulb,
} from 'lucide-react';

interface LearningPageProps {
  onStartPracticeWithPrompt?: (prompt: string) => void;
  onCompleteLesson?: (lessonId: string) => void;
  completedLessonIds?: string[];
}

export const LearningPage: React.FC<LearningPageProps> = ({
  onStartPracticeWithPrompt,
  onCompleteLesson,
  completedLessonIds = [],
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(LESSONS[0].id);

  // Interactive formula toggles
  const [activeFormulaElements, setActiveFormulaElements] = useState({
    role: true,
    task: true,
    context: true,
    tone: false,
    audience: true,
    constraints: true,
    outputFormat: false,
  });

  const toggleFormulaElement = (elem: keyof typeof activeFormulaElements) => {
    setActiveFormulaElements((prev) => ({ ...prev, [elem]: !prev[elem] }));
  };

  const getDynamicFormulaPrompt = () => {
    const parts: string[] = [];
    if (activeFormulaElements.role) parts.push('Act as a senior food design consultant.');
    if (activeFormulaElements.task) parts.push('Draft promotional poster copy for our signature Hyderabadi Chicken Biryani weekend festival.');
    if (activeFormulaElements.context) parts.push('The restaurant is celebrating its 5th anniversary with a free dessert promotion.');
    if (activeFormulaElements.tone) parts.push('Keep the tone warm, festive, and appetite-inducing.');
    if (activeFormulaElements.audience) parts.push('Tailor for local families and college students.');
    if (activeFormulaElements.constraints) parts.push('Keep under 100 words and include booking contact details.');
    if (activeFormulaElements.outputFormat) parts.push('Format as Catchy Headline, 2-line sensory description, Offer details, and Call to action.');

    if (parts.length === 0) {
      return '(Select one or more building blocks above to assemble your prompt in real-time)';
    }
    return parts.join(' ');
  };

  const currentLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Learn Prompt Engineering
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
          Master how to communicate with generative AI models through 12 bite-sized, practical lessons with Bad vs. Better prompt examples.
        </p>
      </div>

      {/* 2. Interactive Formula Card */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 via-slate-900/90 to-purple-950/20 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-indigo-500/20 gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">The Golden Equation</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              Interactive Prompt Formula
            </h2>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Click any pill below to toggle and assemble live!</span>
          </div>
        </div>

        {/* Visual Formula Equation */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold text-center font-mono">
          <span className="text-blue-400">ROLE</span>
          <span className="text-slate-500">+</span>
          <span className="text-indigo-400">TASK</span>
          <span className="text-slate-500">+</span>
          <span className="text-purple-400">CONTEXT</span>
          <span className="text-slate-500">+</span>
          <span className="text-amber-400">TONE</span>
          <span className="text-slate-500">+</span>
          <span className="text-cyan-400">AUDIENCE</span>
          <span className="text-slate-500">+</span>
          <span className="text-emerald-400">CONSTRAINTS</span>
          <span className="text-slate-500">+</span>
          <span className="text-sky-400">OUTPUT FORMAT</span>
        </div>

        <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 text-center font-medium">
          💡 <em>"You don't always need every element. Use the ones that help your specific task."</em>
        </div>

        {/* Toggle Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-6">
          {[
            { key: 'role' as const, label: 'Role', sub: 'Who AI acts as' },
            { key: 'task' as const, label: 'Task', sub: 'What to execute' },
            { key: 'context' as const, label: 'Context', sub: 'Background info' },
            { key: 'tone' as const, label: 'Tone', sub: 'Voice & mood' },
            { key: 'audience' as const, label: 'Audience', sub: 'Who reads it' },
            { key: 'constraints' as const, label: 'Constraints', sub: 'Limits & rules' },
            { key: 'outputFormat' as const, label: 'Format', sub: 'Visual structure' },
          ].map((item) => {
            const active = activeFormulaElements[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleFormulaElement(item.key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  active
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold block">{item.label}</span>
                <span className="text-[10px] text-slate-400 block mt-1">{item.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Live Assembled Preview */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Live Assembled Prompt Result</span>
            {onStartPracticeWithPrompt && (
              <button
                onClick={() => onStartPracticeWithPrompt(getDynamicFormulaPrompt())}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Test in Playground</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30 font-mono text-xs text-indigo-100 leading-relaxed min-h-[90px] shadow-inner select-all">
            {getDynamicFormulaPrompt()}
          </div>
        </div>
      </div>

      {/* 3. The 12 Comprehensive Lessons List */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">12 Core Prompting Lessons</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any lesson to view the concept explanation, bad vs. better prompt comparison, and practice.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
            {completedLessonIds.length} / {LESSONS.length} Completed
          </span>
        </div>

        <div className="space-y-4">
          {LESSONS.map((lesson) => {
            const isExpanded = expandedLessonId === lesson.id;
            const isCompleted = completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-900/90 border-indigo-500/40 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : lesson.number}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{lesson.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{lesson.shortDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-purple-400 font-mono hidden sm:inline">
                      +{lesson.xpReward} XP
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5">
                    {/* Concept */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                        The Concept
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">{lesson.conceptExplanation}</p>
                    </div>

                    {/* Bad vs Better Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Bad Prompt */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                          <XCircle className="w-4 h-4" />
                          <span>Bad Prompt (Vague)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
                          "{lesson.badPrompt}"
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          <strong>Why it fails:</strong> {lesson.badPromptWhy}
                        </p>
                      </div>

                      {/* Better Prompt */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Better Prompt (Engineered)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-100">
                          "{lesson.betterPrompt}"
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          <strong>Why it works:</strong> {lesson.betterPromptWhy}
                        </p>
                      </div>
                    </div>

                    {/* Pro Tips */}
                    {lesson.proTips?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Pro Tips:</span>
                        </span>
                        <ul className="space-y-1">
                          {lesson.proTips.map((tip, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-indigo-400">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-between">
                      {onCompleteLesson && (
                        <button
                          onClick={() => onCompleteLesson(lesson.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                        >
                          {isCompleted ? '✓ Lesson Completed' : 'Mark as Completed (+15 XP)'}
                        </button>
                      )}

                      {onStartPracticeWithPrompt && (
                        <button
                          onClick={() => onStartPracticeWithPrompt(lesson.betterPrompt)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer ml-auto"
                        >
                          <span>Practice this in Playground</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
