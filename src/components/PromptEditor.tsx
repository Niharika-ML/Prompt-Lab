import React, { useRef, useState, useMemo } from 'react';
import {
  Sparkles,
  Trash2,
  Wand2,
  Plus,
  HelpCircle,
  Keyboard,
  LayoutTemplate,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Challenge, Difficulty, Language } from '../types';
import { getTranslation } from '../data/translations';

interface PromptEditorProps {
  prompt: string;
  onChange: (val: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  onLoadExample: (example: string) => void;
  onOpenTemplates: () => void;
  onImproveClick?: () => void;
  isGenerating: boolean;
  challenge: Challenge | null;
  difficulty?: Difficulty;
  beginnerMode?: boolean;
  language?: Language;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onChange,
  onGenerate,
  onClear,
  onLoadExample,
  onOpenTemplates,
  onImproveClick,
  isGenerating,
  challenge,
  difficulty = 'beginner',
  beginnerMode = true,
  language = 'en',
}) => {
  const t = getTranslation(language);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showGuide, setShowGuide] = useState(false);

  const clean = prompt.trim();
  const lower = clean.toLowerCase();
  const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = prompt.length;

  const isVisualPrompt = /(picture|photo|image|poster|illustration|drawing|render|shot|biryani|scene)/i.test(lower);

  // Dynamic Level-Specific Prompt Quality Evaluation (Requirement 2 & 4)
  const qualityEvaluation = useMemo(() => {
    if (!clean) {
      return {
        score: 0,
        task: 'missing' as const,
        role: 'missing' as const,
        context: 'missing' as const,
        tone: 'missing' as const,
        audience: 'missing' as const,
        constraints: 'missing' as const,
        format: 'missing' as const,
        examples: 'missing' as const,
      };
    }

    const hasTask = wordCount >= 2 && /(write|create|draft|explain|generate|plan|summarize|design|build|list|outline|compare|review|picture|photo|recipe|email|message|caption)/i.test(lower);
    const hasRole = /(act as|you are|pretend to be|role:|as an?|expert|specialist|coach|designer|engineer|copywriter|teacher|advisor|chef)/i.test(lower);
    const hasContext = wordCount > 8 || /(because|since|background|context|situation|for my|restaurant|symposium|interview|college|company|mother|friend|dinner)/i.test(lower);
    const hasTone = /(tone|friendly|formal|casual|polite|humorous|warm|energetic|empathetic|professional|gentle|persuasive|bold|appetizing)/i.test(lower);
    const hasAudience = /(audience|for kids|for students|for parents|for beginners|for developers|target audience|for the vp|for clients|for my mother|for my mom)/i.test(lower);
    const hasConstraints = /(under \d+|\d+\s*words|max|limit|within|only|avoid|don't|no |must include|concise|strictly|lighting|texture|composition)/i.test(lower);
    const hasFormat = /(format|table|bullet|list|json|markdown|section|steps?|paragraph|template|poster copy|structured|photograph|resolution)/i.test(lower);
    const hasExamples = /(example|sample|like this|e\.g\.|for instance)/i.test(lower);

    // Scoring weights based on selected level
    let rawScore = 20;

    if (difficulty === 'beginner') {
      // Beginner: Focus mainly on Task, Basic context, Clear instruction
      if (hasTask) rawScore += wordCount > 5 ? 45 : 30;
      if (hasContext) rawScore += 25;
      if (hasAudience || hasTone) rawScore += 10;
    } else if (difficulty === 'intermediate') {
      // Intermediate: Focus on Task, Role, Context, Tone, Audience, Constraints, Format
      if (hasTask) rawScore += 20;
      if (hasRole) rawScore += 15;
      if (hasContext) rawScore += 15;
      if (hasTone) rawScore += 10;
      if (hasAudience) rawScore += 10;
      if (hasConstraints) rawScore += 15;
      if (hasFormat) rawScore += 10;
    } else {
      // Advanced: Focus on Task, Role, Context, Constraints, Examples, Output format, Specificity
      if (hasTask) rawScore += 15;
      if (hasRole) rawScore += 15;
      if (hasContext) rawScore += 15;
      if (hasConstraints) rawScore += 15;
      if (hasFormat) rawScore += 15;
      if (hasExamples) rawScore += 15;
      if (wordCount > 25) rawScore += 10;
    }

    // Special realistic handling: short generic prompt like "A picture of delicious chicken biryani." -> 20 / 100
    if (wordCount < 7 && !hasRole && !hasConstraints && !hasFormat) {
      rawScore = Math.min(25, Math.max(18, wordCount * 4));
    }

    const boundedScore = Math.min(100, Math.max(15, rawScore));

    return {
      score: boundedScore,
      task: hasTask ? (wordCount > 5 ? ('strong' as const) : ('needs_improvement' as const)) : ('missing' as const),
      role: hasRole ? ('strong' as const) : ('missing' as const),
      context: hasContext ? ('strong' as const) : ('missing' as const),
      tone: hasTone ? ('strong' as const) : ('missing' as const),
      audience: hasAudience ? ('strong' as const) : ('missing' as const),
      constraints: hasConstraints ? ('strong' as const) : ('missing' as const),
      format: hasFormat ? ('strong' as const) : ('missing' as const),
      examples: hasExamples ? ('strong' as const) : ('missing' as const),
    };
  }, [clean, lower, wordCount, difficulty]);

  // Insert building block snippet (Requirement 3)
  const insertBuildingBlock = (snippet: string) => {
    let newText = prompt.trim();
    if (newText.length > 0 && !newText.endsWith('.') && !newText.endsWith('!')) {
      newText += '. ';
    } else if (newText.length > 0) {
      newText += ' ';
    }
    newText += `${snippet} `;
    onChange(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newText.length;
        textareaRef.current.selectionEnd = newText.length;
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) {
        onGenerate();
      }
    }
  };

  const getStatusIcon = (status: 'strong' | 'needs_improvement' | 'missing') => {
    if (status === 'strong') return <span className="text-emerald-400 font-bold">✓</span>;
    if (status === 'needs_improvement') return <span className="text-amber-400 font-bold">⚠</span>;
    return <span className="text-rose-400 font-bold">✕</span>;
  };

  // AI Prompt Coach recommendation (Requirement 5)
  const coachFeedback = useMemo(() => {
    if (!clean) return null;

    if (isVisualPrompt) {
      return {
        title: '💡 Your prompt is very general.',
        missing: [
          '❌ Role',
          '❌ Style',
          '❌ Context',
          '❌ Audience',
          '❌ Visual details',
        ],
        suggestions: [
          '+ Add visual style (e.g. realistic food photograph)',
          '+ Add lighting (e.g. warm natural lighting)',
          '+ Add composition (e.g. centered focus, shallow depth of field)',
          '+ Add image dimensions & background setting',
        ],
      };
    }

    if (wordCount < 7 || qualityEvaluation.score < 45) {
      return {
        title: '💡 Your prompt is very general.',
        missing: [
          '❌ Role',
          '❌ Context',
          '❌ Audience',
          '❌ Constraints',
          '❌ Format',
        ],
        suggestions: [
          '+ Add role (e.g. "Act as a professional writer")',
          '+ Add specific context and purpose',
          '+ Add who the audience is',
          '+ Add length limits and desired output format',
        ],
      };
    }

    if (qualityEvaluation.role === 'missing') {
      return {
        title: '💡 Add an expert persona.',
        missing: ['❌ Specialized Role / Persona'],
        suggestions: [
          '+ Add "+ Role" to anchor expertise (e.g. "Act as a career counselor" or "Act as a food stylist")',
        ],
      };
    }

    if (qualityEvaluation.constraints === 'missing') {
      return {
        title: '💡 Set length and style boundaries.',
        missing: ['❌ Hard constraints & bounds'],
        suggestions: [
          '+ Add length ceilings (e.g. "Keep under 100 words")',
          '+ Add negative constraints (what to avoid)',
        ],
      };
    }

    return {
      title: '✨ Great structured prompt!',
      missing: [],
      suggestions: [
        'Your prompt has clear direction. Click Generate Output or test live!',
      ],
    };
  }, [clean, wordCount, qualityEvaluation, isVisualPrompt]);

  return (
    <div className="flex flex-col rounded-2xl glass-panel p-5 shadow-2xl relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
            <span>{t.yourPrompt}</span>
          </h3>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTemplates}
            className="text-xs px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/20 transition-all flex items-center gap-1 cursor-pointer"
            title="Browse ready-made templates"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.templates}</span>
          </button>

          {challenge?.goodExample && (
            <button
              onClick={() => onLoadExample(challenge.goodExample)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
              title="Load a pro example"
            >
              <Wand2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.proExample}</span>
            </button>
          )}

          {prompt && (
            <button
              onClick={onClear}
              className="text-xs px-2.5 py-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex items-center gap-1 cursor-pointer"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clear}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Prompt Building Blocks (Requirement 3) */}
      <div className="mb-3">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.promptBuildingBlocks}</span>
          </span>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{showGuide ? 'Hide Guide' : 'Formula Guide'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => insertBuildingBlock('Act as a professional specialist.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-blue-950/60 text-blue-300 border border-slate-800 hover:border-blue-500/40 transition-colors cursor-pointer"
          >
            {t.role}
          </button>

          <button
            type="button"
            onClick={() => insertBuildingBlock('Create a clear, step-by-step deliverable.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950/60 text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer"
          >
            {t.task}
          </button>

          <button
            type="button"
            onClick={() => insertBuildingBlock('Background context: For an upcoming real-world project.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-purple-950/60 text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-colors cursor-pointer"
          >
            {t.context}
          </button>

          <button
            type="button"
            onClick={() => insertBuildingBlock('Tone: Warm, engaging, and professional.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-amber-950/60 text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            {t.tone}
          </button>

          <button
            type="button"
            onClick={() => insertBuildingBlock('Target audience: Beginners and general readers.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-cyan-950/60 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            {t.audience}
          </button>

          <button
            type="button"
            onClick={() => insertBuildingBlock('Constraints: Keep strictly under 100 words and avoid jargon.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-emerald-950/60 text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            {t.constraints}
          </button>

          <button
            type="button"
            onClick={() => insertBuildingBlock('Format: Structured list with bullet points.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-sky-950/60 text-sky-300 border border-slate-800 hover:border-sky-500/40 transition-colors cursor-pointer"
          >
            {t.format}
          </button>

          <button
            type="button"
            onClick={() => insertBuildingBlock('Example style: Headline -> 3 key benefits -> Call to action.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-rose-950/60 text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors cursor-pointer"
          >
            {t.examples}
          </button>
        </div>
      </div>

      {/* Guide toggle card */}
      {showGuide && (
        <div className="mb-3 p-3.5 rounded-xl bg-slate-950 border border-blue-500/20 text-xs text-slate-300 space-y-1.5">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
            The Complete Prompt Formula:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div><strong className="text-blue-400">Role:</strong> Who AI acts as</div>
            <div><strong className="text-indigo-400">Task:</strong> What to create</div>
            <div><strong className="text-purple-400">Context:</strong> Why/Where situation</div>
            <div><strong className="text-amber-400">Tone:</strong> Voice and style</div>
            <div><strong className="text-cyan-400">Audience:</strong> Who is reading</div>
            <div><strong className="text-emerald-400">Constraints:</strong> Boundaries & limits</div>
            <div><strong className="text-sky-400">Format:</strong> Layout schema</div>
            <div><strong className="text-rose-400">Examples:</strong> Reference samples</div>
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.promptPlaceholder}
          rows={6}
          className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono text-xs sm:text-sm leading-relaxed resize-none shadow-inner"
        />

        {/* Word count and Character count (Requirement 4) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 pointer-events-none">
          <span>{wordCount} {t.words}</span>
          <span>•</span>
          <span>{charCount} {t.chars}</span>
        </div>
      </div>

      {/* 2. Real-time Prompt Quality Check Bar (Requirement 4) */}
      <div className="mt-3 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span>{t.promptQuality}:</span>
            <span
              className={`font-mono px-2 py-0.5 rounded text-xs ${
                qualityEvaluation.score >= 80
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                  : qualityEvaluation.score >= 50
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
              }`}
            >
              {clean ? `${qualityEvaluation.score} / 100` : '0 / 100'}
            </span>
            <span className="text-[10px] text-slate-400 font-normal ml-1">
              ({difficulty.toUpperCase()} criteria)
            </span>
          </div>

          <span className="text-[10px] text-slate-400">
            {clean ? 'Dynamically evaluated' : 'Type to evaluate'}
          </span>
        </div>

        {/* 7 Elements row */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 text-slate-300">
            <span>🎯 Task</span>
            {getStatusIcon(qualityEvaluation.task)}
          </span>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 text-slate-300">
            <span>👤 Role</span>
            {getStatusIcon(qualityEvaluation.role)}
          </span>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 text-slate-300">
            <span>📚 Context</span>
            {getStatusIcon(qualityEvaluation.context)}
          </span>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 text-slate-300">
            <span>🎭 Tone</span>
            {getStatusIcon(qualityEvaluation.tone)}
          </span>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 text-slate-300">
            <span>👥 Audience</span>
            {getStatusIcon(qualityEvaluation.audience)}
          </span>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 text-slate-300">
            <span>📏 Constraints</span>
            {getStatusIcon(qualityEvaluation.constraints)}
          </span>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 text-slate-300">
            <span>📋 Format</span>
            {getStatusIcon(qualityEvaluation.format)}
          </span>
        </div>
      </div>

      {/* 3. AI Prompt Coach (Requirement 5) */}
      {coachFeedback && (
        <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/25 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5 text-sm">
              <span>{t.aiPromptCoach}</span>
            </span>

            {onImproveClick && clean && (
              <button
                type="button"
                onClick={onImproveClick}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.improveItForMe}</span>
              </button>
            )}
          </div>

          <p className="text-amber-300 font-semibold text-xs">{coachFeedback.title}</p>

          {coachFeedback.missing.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 block mb-1">
                {t.coachMissing}
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 font-medium">
                {coachFeedback.missing.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900/80 border border-rose-500/20 text-rose-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block mb-1">
              {t.coachSuggestions}
            </span>
            <div className="space-y-1 text-[11px] text-slate-300">
              {coachFeedback.suggestions.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer and Main Generate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 hidden sm:flex">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
            Ctrl / Cmd + Enter
          </kbd>
          <span>to generate</span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-xl cursor-pointer ${
            isGenerating || !prompt.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              : 'text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>{t.generating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.generateOutput}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
