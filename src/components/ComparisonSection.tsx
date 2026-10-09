import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';
import { Copy, Check, Sparkles, Layers, Award, CheckCircle2 } from 'lucide-react';

interface ComparisonSectionProps {
  originalPrompt: string;
  originalOutput: string;
  improvedPrompt: string;
  improvedOutput: string;
  onCopyText: (text: string, id: string) => void;
  copiedId: string | null;
  elementsImproved?: string[];
  language?: Language;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  originalPrompt,
  originalOutput,
  improvedPrompt,
  improvedOutput,
  onCopyText,
  copiedId,
  elementsImproved = [
    'More Context',
    'Better Specificity',
    'Clearer Instructions',
    'Better Tone',
    'Better Constraints',
    'Better Format',
  ],
  language = 'en',
}) => {
  const t = getTranslation(language);

  return (
    <div className="rounded-2xl glass-panel p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{t.seeTheDifference}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.comparisonSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs font-medium text-blue-200 self-start sm:self-auto">
          <Award className="w-4 h-4 text-blue-400" />
          <span>Notice how specific constraints directly elevate output quality.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Original */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/60 p-5 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <h4 className="font-bold text-slate-300 text-sm tracking-tight">{t.initialPromptHeading} & {t.initialOutputHeading}</h4>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Before</span>
          </div>

          <div className="space-y-4 flex-1">
            {/* Original Prompt */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                {t.initialPromptHeading}
              </span>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                {originalPrompt}
              </div>
            </div>

            {/* Original Output */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.initialOutputHeading}
                </span>
                <button
                  onClick={() => onCopyText(originalOutput, 'orig_out')}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === 'orig_out' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === 'orig_out' ? t.copied : t.copy}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs leading-relaxed flex-1 max-h-80 overflow-y-auto whitespace-pre-wrap">
                {originalOutput || 'No output generated yet.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Improved */}
        <div className="flex flex-col rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-950/80 p-5 overflow-hidden shadow-lg shadow-blue-950/30">
          <div className="flex items-center justify-between pb-3 border-b border-blue-500/20 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h4 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                <span>{t.refinedPromptHeading} & {t.refinedOutputHeading}</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </h4>
            </div>
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              After Upgrade
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {/* Improved Prompt */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300 block mb-1">
                {t.refinedPromptHeading}
              </span>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/30 text-blue-100 font-mono text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                {improvedPrompt}
              </div>
            </div>

            {/* Improved Output */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                  {t.refinedOutputHeading}
                </span>
                <button
                  onClick={() => onCopyText(improvedOutput, 'imp_out')}
                  className="text-[11px] text-blue-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === 'imp_out' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === 'imp_out' ? t.copied : t.copy}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 text-slate-200 text-xs leading-relaxed flex-1 max-h-80 overflow-y-auto whitespace-pre-wrap">
                {improvedOutput || 'Click "Generate Improved Output" to view the upgraded response.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 WHAT CHANGED? (Requirement 12) */}
      <div className="pt-6 border-t border-slate-800/80">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span>{t.whatChanged}</span>
          <span className="text-xs font-normal text-slate-400">Key differences that elevated the AI's response</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {elementsImproved.map((elem, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-2 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+ {elem.replace(/^\+\s*/, '')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
