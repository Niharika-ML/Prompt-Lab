import React from 'react';
import { PromptAnalysis } from '../types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ScoreCardProps {
  analysis: PromptAnalysis;
  beginnerMode: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ analysis, beginnerMode }) => {
  const { score, scoreLabel, scoreBreakdown } = analysis;

  // Circular gauge values
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400 stroke-emerald-400';
    if (val >= 68) return 'text-sky-400 stroke-sky-400';
    if (val >= 50) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const getScoreBg = (val: number) => {
    if (val >= 85) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (val >= 68) return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    if (val >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        {/* Circular Meter */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-white">{score}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">/ 100</span>
            </div>
          </div>

          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 border backdrop-blur-md shadow-inner ${getScoreBg(score)}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Quality Score</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{scoreLabel}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
              {beginnerMode
                ? 'Dynamic educational score based on your prompt\'s clarity, context, guardrails, and role assignment.'
                : 'Algorithmic assessment of instruction precision, context anchoring, audience definition, and format schema.'}
            </p>
          </div>
        </div>

        {/* Quick Strengths */}
        <div className="w-full md:w-auto flex flex-col gap-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Key Strengths Identified</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {analysis.keyStrengths?.map((str, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {str}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown Factor Sliders */}
      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Score Breakdown</span>
          <span className="text-[11px] font-normal text-slate-500">Key Pillars</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: 'task', label: 'Task', val: scoreBreakdown.task },
            { key: 'context', label: 'Context', val: scoreBreakdown.context },
            { key: 'clarity', label: 'Clarity', val: scoreBreakdown.clarity },
            { key: 'constraints', label: 'Constraints', val: scoreBreakdown.constraints },
            { key: 'outputFormat', label: 'Format', val: scoreBreakdown.outputFormat },
          ].map((item) => (
            <div key={item.key} className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="font-bold text-white">{item.val}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.val >= 80 ? 'bg-emerald-400' : item.val >= 60 ? 'bg-sky-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
