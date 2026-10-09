import React from 'react';
import { PromptAnalysis, DimensionStatus } from '../types';
import { ScoreCard } from './ScoreCard';
import { Info, Lightbulb } from 'lucide-react';

interface PromptAnalysisSectionProps {
  analysis: PromptAnalysis | null;
  beginnerMode: boolean;
  isLoading: boolean;
}

export const PromptAnalysisSection: React.FC<PromptAnalysisSectionProps> = ({
  analysis,
  beginnerMode,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
        <div className="h-32 bg-slate-800/60 rounded-xl mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-28 bg-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getStatusBadge = (status: DimensionStatus) => {
    switch (status) {
      case 'strong':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            ✓ Strong
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            ⚠ Needs Improvement
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            ✕ Missing
          </span>
        );
    }
  };

  const dimensionList = [
    { key: 'task', data: analysis.dimensions.task, desc: 'What you want created' },
    { key: 'role', data: analysis.dimensions.role, desc: 'Who AI should act as' },
    { key: 'context', data: analysis.dimensions.context, desc: 'Background & situation' },
    { key: 'tone', data: analysis.dimensions.tone, desc: 'Voice, style & feeling' },
    { key: 'audience', data: analysis.dimensions.audience, desc: 'Who reads or consumes this' },
    { key: 'constraints', data: analysis.dimensions.constraints, desc: 'Word limits, budget & limits' },
    { key: 'outputFormat', data: analysis.dimensions.outputFormat, desc: 'Structure, table, bullets' },
    { key: 'examples', data: analysis.dimensions.examples, desc: 'Reference sample models' },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <ScoreCard analysis={analysis} beginnerMode={beginnerMode} />

      {/* 8 Dimensions Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>8 Prompt Dimensions Analysis</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Live Assessment
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates instruction depth, contextual clarity, audience targeting, and guardrails.
            </p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Not every prompt needs all 8 elements!</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dimensionList.map(({ key, data, desc }) => (
            <div
              key={key}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                data.status === 'strong'
                  ? 'bg-slate-950/50 border-emerald-500/20 hover:border-emerald-500/40'
                  : data.status === 'needs_improvement'
                  ? 'bg-slate-950/50 border-amber-500/20 hover:border-amber-500/40'
                  : 'bg-slate-950/50 border-rose-500/20 hover:border-rose-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm tracking-tight">{data.label}</h4>
                    <span className="text-[10px] text-slate-400 block">{desc}</span>
                  </div>
                  {getStatusBadge(data.status)}
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {data.feedback}
                </p>
              </div>

              {data.suggestion && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-indigo-300 bg-indigo-950/20 p-2 rounded-lg border border-indigo-500/20">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{data.suggestion}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Top Suggestions Summary */}
        {analysis.topSuggestions?.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Recommended Next Steps for Your Prompt</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.topSuggestions.map((sug, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-900/90 text-indigo-200 border border-indigo-500/30">
                      → {sug}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
