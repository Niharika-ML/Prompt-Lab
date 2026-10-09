import React, { useState, useEffect, useRef } from 'react';
import { ImprovementResult, Language, OutputType } from '../types';
import { getTranslation } from '../data/translations';
import { Sparkles, ArrowRight, CheckCircle2, Wand2, ShieldCheck, Edit3, Copy, Check, FileText, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

interface ImprovementSectionProps {
  originalPrompt: string;
  improvement: ImprovementResult | null;
  onApplyImproved: (improvedText: string) => void;
  isLoading: boolean;
  language?: Language;
  outputType?: OutputType;
  onChangeOutputType?: (type: OutputType) => void;
}

export const ImprovementSection: React.FC<ImprovementSectionProps> = ({
  originalPrompt,
  improvement,
  onApplyImproved,
  isLoading,
  language = 'en',
  outputType = 'text',
  onChangeOutputType,
}) => {
  const t = getTranslation(language);
  const [editableText, setEditableText] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (improvement) {
      setEditableText(improvement.improvedPrompt);
    }
  }, [improvement]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText || improvement?.improvedPrompt || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFocusEdit = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-blue-500/30 glass-panel p-8 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20" />
          <div className="h-6 w-48 bg-slate-800 rounded" />
        </div>
        <div className="h-20 bg-slate-800/60 rounded-xl mb-4" />
        <div className="h-10 w-44 bg-blue-600/40 rounded-xl" />
      </div>
    );
  }

  if (!improvement) return null;

  return (
    <div className="rounded-2xl glass-panel p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{t.improvePrompt}</span>
              {improvement.isAlreadyStrong && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> High Quality
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.improvePromptDesc}
            </p>
          </div>
        </div>

        {/* Generate Improved Output Button (Requirement 10 & 11) */}
        <div className="flex flex-wrap items-center gap-3">
          {onChangeOutputType && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeOutputType('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  outputType === 'text'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.text}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeOutputType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  outputType === 'image'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t.image}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeOutputType('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  outputType === 'video'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>{t.video}</span>
              </button>
            </div>
          )}

          <button
            onClick={() => onApplyImproved(editableText || improvement.improvedPrompt)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{t.generateImprovedOutput}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Before vs After Preview Blocks (Requirement 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ORIGINAL PROMPT */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {t.originalPrompt}
            </span>
            <div className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900 p-3.5 rounded-lg border border-slate-800/80 min-h-[90px] whitespace-pre-wrap">
              "{originalPrompt}"
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            Baseline user input
          </span>
        </div>

        {/* IMPROVED PROMPT (Editable) */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.improvedPrompt}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFocusEdit}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-blue-400" />
                  <span>✏️ Edit</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? t.copied : t.copy}</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              rows={4}
              className="w-full p-3.5 rounded-lg bg-slate-950 border border-blue-500/30 text-white font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-500/20">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>{t.editImprovedPrompt}</span>
            </span>

            <button
              type="button"
              onClick={() => onApplyImproved(editableText || improvement.improvedPrompt)}
              className="text-xs font-bold text-blue-300 hover:text-blue-200 cursor-pointer flex items-center gap-1"
            >
              <span>🚀 Run this</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🧠 WHY THIS IS BETTER (Requirement 10) */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <span>{t.whyThisIsBetter}</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {improvement.explanation}
        </p>

        {/* Added Elements Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
          {improvement.elementsAdded?.map((elem, idx) => {
            const cleanLabel = elem.replace(/^[+✓]\s*/, '');
            return (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 text-xs font-medium text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>✓ {cleanLabel.startsWith('Added') ? cleanLabel : `Added ${cleanLabel}`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
