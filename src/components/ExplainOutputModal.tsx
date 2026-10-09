import React from 'react';
import { OutputExplanation, Language } from '../types';
import { getTranslation } from '../data/translations';
import { X, Search, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface ExplainOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: OutputExplanation | null;
  isLoading: boolean;
  language?: Language;
}

export const ExplainOutputModal: React.FC<ExplainOutputModalProps> = ({
  isOpen,
  onClose,
  explanation,
  isLoading,
  language = 'en',
}) => {
  const t = getTranslation(language);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-indigo-500/30 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{t.outputBreakdownTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Beginner-friendly explanation of how the model interpreted your instructions.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm font-semibold text-white">Analyzing AI generation decisions...</span>
            <p className="text-xs text-slate-400">Comparing your prompt against model output logic.</p>
          </div>
        ) : !explanation ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No explanation available yet. Generate an output first!
          </div>
        ) : (
          <div className="space-y-6 text-xs leading-relaxed">
            {/* 1. What the AI understood */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                {t.whatAiUnderstood}
              </span>
              <p className="text-slate-200">{explanation.whatAiUnderstood}</p>
            </div>

            {/* 2. Which parts of the prompt it followed */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.instructionsFollowed}</span>
              </span>
              <ul className="space-y-1.5">
                {explanation.partsFollowed?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. What information was missing */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{t.missingGuardrails}</span>
              </span>
              <ul className="space-y-1.5">
                {explanation.missingInformation?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Why result looks this way */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>{t.whyResultLooksThisWay}</span>
              </span>
              <p className="text-slate-300">{explanation.whyResultLooksThisWay}</p>
            </div>

            {/* 5. What user can change */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-slate-950 border border-indigo-500/30">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-purple-400" />
                <span>{t.easyChanges}</span>
              </span>
              <div className="space-y-2">
                {explanation.suggestedChanges?.map((ch, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-slate-200">
                    <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
