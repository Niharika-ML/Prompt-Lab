import React, { useState } from 'react';
import { OutputType, Language } from '../types';
import { getTranslation } from '../data/translations';
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  Bot,
  Sparkles,
  Bookmark,
  Search,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  Wand2,
  ArrowRight,
} from 'lucide-react';

interface OutputPanelProps {
  outputType: OutputType;
  onChangeOutputType: (type: OutputType) => void;
  onImprovePromptClick?: () => void;
  output: string;
  imageUrl?: string;
  videoUrl?: string;
  isGenerating: boolean;
  isImproving?: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onSavePrompt: () => void;
  onExplainOutput: () => void;
  onCopyPrompt?: () => void;
  isCopied: boolean;
  isPromptCopied?: boolean;
  isSaved?: boolean;
  isFallback?: boolean;
  fallbackNote?: string;
  errorMessage?: string | null;
  errorCode?: number;
  language?: Language;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  outputType,
  onChangeOutputType,
  onImprovePromptClick,
  output,
  imageUrl,
  videoUrl,
  isGenerating,
  isImproving,
  onRegenerate,
  onCopy,
  onDownload,
  onSavePrompt,
  onExplainOutput,
  onCopyPrompt,
  isCopied,
  isPromptCopied,
  isSaved,
  isFallback,
  fallbackNote,
  errorMessage,
  errorCode,
  language = 'en',
}) => {
  const t = getTranslation(language);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Check if error is quota / limit vs other
  const isQuotaLimit = errorCode === 429 || /quota|limit|usage|resource_exhausted/i.test(errorMessage || '');

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel p-5 shadow-2xl relative">
      {/* 1. Header & Output Creation Bar (Requirement 6 & 10) */}
      <div className="flex flex-col gap-3 pb-3 mb-3 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                <span>{t.aiOutput}</span>
                {!isGenerating && (output || imageUrl || videoUrl) && !errorMessage ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t.ready}</span>
                  </span>
                ) : isGenerating ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {t.generating}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500">
                    {t.awaitingInput}
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* CREATE Modes + IMPROVE PROMPT (Requirement 6 & 10) */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden md:inline">
              {t.create}
            </span>
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeOutputType('text')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  outputType === 'text'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.text}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeOutputType('image')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  outputType === 'image'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t.image}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeOutputType('video')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  outputType === 'video'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>{t.video}</span>
              </button>
            </div>

            {/* Fourth Major Action: ✨ IMPROVE PROMPT (Requirement 10) */}
            {onImprovePromptClick && (
              <button
                type="button"
                onClick={onImprovePromptClick}
                disabled={isImproving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Transform your prompt into a high-precision prompt"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.improvePrompt}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Action Toolbar (Requirement 7, 8, 9, 13) */}
      {(output || imageUrl || videoUrl) && !isGenerating && !errorMessage && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Copy Button */}
            <button
              onClick={onCopy}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy output to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? t.copied : t.copy}</span>
            </button>

            {/* Regenerate Button */}
            <button
              onClick={onRegenerate}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Regenerate output"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.regenerate}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={onDownload}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download content"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.download}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={onSavePrompt}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Save to My Prompts library"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
              <span>{isSaved ? t.saved : t.save}</span>
            </button>

            {/* Copy Prompt button for Image / Video mode */}
            {(outputType === 'image' || outputType === 'video') && onCopyPrompt && (
              <button
                onClick={onCopyPrompt}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy prompt text"
              >
                {isPromptCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isPromptCopied ? t.promptCopied : t.copyPrompt}</span>
              </button>
            )}
          </div>

          {/* Explain This Output Button (Requirement 13) */}
          <button
            onClick={onExplainOutput}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 border border-blue-500/30 transition-all flex items-center gap-1.5 font-semibold cursor-pointer shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.explainThisOutput}</span>
          </button>
        </div>
      )}

      {/* 3. Output Content Display */}
      <div className="relative flex-1 flex flex-col min-h-[280px]">
        {isGenerating ? (
          /* Loading States (Requirements 8, 9, 20) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse mb-3">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              {outputType === 'image'
                ? t.creatingImage
                : outputType === 'video'
                ? t.creatingVideo
                : t.generating}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Interpreting your instructions in real-time.
            </p>
          </div>
        ) : errorMessage ? (
          /* Clean Error Card (Requirement 8 & 20 - NEVER raw errors!) */
          <div className="flex-1 p-6 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center mb-3 text-xl">
              ⚠️
            </div>

            <h4 className="font-bold text-white text-sm mb-1.5">
              {isQuotaLimit
                ? t.limitReachedTitle
                : outputType === 'image'
                ? t.imageUnavailableTitle
                : outputType === 'video'
                ? t.videoUnavailableTitle
                : t.errorTitle}
            </h4>

            <p className="text-slate-400 max-w-sm mb-5 leading-relaxed">
              {isQuotaLimit
                ? t.limitReachedDesc
                : outputType === 'image'
                ? t.imageUnavailableDesc
                : outputType === 'video'
                ? t.videoUnavailableDesc
                : t.errorDesc}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={onRegenerate}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.retry}</span>
              </button>

              <button
                onClick={() => onChangeOutputType('text')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/25"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.switchToText}</span>
              </button>
            </div>
          </div>
        ) : outputType === 'image' && imageUrl ? (
          /* Real Image Output (Requirement 8) */
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="relative group overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
              <img
                src={imageUrl}
                alt="Generated AI result"
                className="max-h-[340px] w-auto rounded-xl object-contain"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-3 font-mono">
              {t.generatedImage}
            </span>
          </div>
        ) : outputType === 'video' && videoUrl ? (
          /* Video Output with Player (Requirement 9) */
          <div className="flex-1 flex flex-col space-y-3 bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="relative w-full aspect-video rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden group shadow-lg">
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {t.generatedVideo}
            </span>
          </div>
        ) : outputType === 'text' && output ? (
          /* Real Text Output (Requirement 7) */
          <div className="flex-1 p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-sans overflow-y-auto max-h-[420px] select-text shadow-inner">
            {output}
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-3 text-xl">
              ✍️
            </div>
            <h4 className="text-sm font-semibold text-slate-300">Ready for your prompt</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Write a prompt on the left, choose a creation mode (<strong>[{t.text}]</strong>, <strong>[{t.image}]</strong>, <strong>[{t.video}]</strong>), and click <strong>{t.generateOutput}</strong>.
            </p>
          </div>
        )}

        {isFallback && !isGenerating && output && !errorMessage && (
          <div className="mt-2 px-3 py-1.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{fallbackNote || 'Smart prompt interpretation active.'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
