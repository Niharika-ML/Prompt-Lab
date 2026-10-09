import React, { useState, useEffect, useRef } from 'react';
import {
  Challenge,
  CategoryId,
  PromptAnalysis,
  ImprovementResult,
  OutputExplanation,
  OutputType,
  PromptTemplate,
  PageView,
  Difficulty,
  Language,
} from '../types';
import { getTranslation } from '../data/translations';
import { CATEGORIES, CHALLENGES } from '../data/challenges';
import { PromptEditor } from './PromptEditor';
import { OutputPanel } from './OutputPanel';
import { PromptAnalysisSection } from './PromptAnalysisSection';
import { ImprovementSection } from './ImprovementSection';
import { ComparisonSection } from './ComparisonSection';
import { ExplainOutputModal } from './ExplainOutputModal';
import { TemplatePickerModal } from './TemplatePickerModal';
import { generateAiOutput, analyzePrompt, improvePrompt, explainAiOutput } from '../utils/api';
import { playSound } from '../utils/sound';
import {
  Sparkles,
  Target,
  Wand2,
  CheckCircle2,
  Lightbulb,
  Bookmark,
  X,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';

interface PracticeWorkspaceProps {
  initialChallengeId?: string;
  initialPrompt?: string;
  initialCategory?: CategoryId;
  initialOutputType?: OutputType;
  beginnerMode: boolean;
  isGuest?: boolean;
  language?: Language;
  onNavigate?: (page: PageView) => void;
  onRecordPractice: (
    challenge: Challenge | null,
    prompt: string,
    output: string,
    score: number,
    outputType: OutputType
  ) => void;
  onRecordImprovement: (
    challenge: Challenge | null,
    originalPrompt: string,
    improvedPrompt: string,
    improvedOutput: string,
    elementsAdded: string[]
  ) => void;
  onSavePrompt: (title: string, promptText: string, category: CategoryId, outputType: OutputType, lastOutput?: string) => void;
}

// Level-Specific Task Suggestions (Requirement 17)
const LEVEL_TASKS: Record<Difficulty, Array<{
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category: CategoryId;
  type: OutputType;
}>> = {
  beginner: [
    {
      id: 'b-birthday',
      label: '🎂 Birthday Message',
      icon: '🎂',
      prompt: 'Write a warm, loving birthday message for my mother expressing gratitude for everything she has done.',
      category: 'social',
      type: 'text',
    },
    {
      id: 'b-email',
      label: '📧 Simple Email',
      icon: '📧',
      prompt: 'Write a short, polite sick leave email to my manager requesting 2 days off due to a high fever.',
      category: 'career',
      type: 'text',
    },
    {
      id: 'b-recipe',
      label: '🍳 Recipe',
      icon: '🍳',
      prompt: 'Create a simple 20-minute dinner recipe using chicken breast, fresh spinach, and olive oil with easy steps.',
      category: 'cooking',
      type: 'text',
    },
    {
      id: 'b-study',
      label: '📚 Study Plan',
      icon: '📚',
      prompt: 'Create a simple 5-day study plan to prepare for a biology exam covering photosynthesis and genetics.',
      category: 'education',
      type: 'text',
    },
    {
      id: 'b-caption',
      label: '📱 Caption',
      icon: '📱',
      prompt: 'Write an engaging Instagram caption with hashtags for a cozy morning coffee cup on a rainy day.',
      category: 'social',
      type: 'text',
    },
  ],
  intermediate: [
    {
      id: 'i-resume',
      label: '💼 Resume',
      icon: '💼',
      prompt: 'Act as an executive resume writer. Create a professional summary and 3 high-impact bullet points for a Senior Product Manager in fintech using the Google XYZ formula.',
      category: 'career',
      type: 'text',
    },
    {
      id: 'i-poster',
      label: '🎨 Poster',
      icon: '🎨',
      prompt: 'Create a promotional poster for a college cultural festival with vibrant neon accents, date, venue, and a catchy call to action.',
      category: 'image',
      type: 'image',
    },
    {
      id: 'i-marketing',
      label: '📣 Marketing Post',
      icon: '📣',
      prompt: 'Act as a B2B SaaS growth marketer. Write a high-converting LinkedIn post announcing our new AI productivity tool with 3 key benefits, social proof, and a link CTA. Under 120 words.',
      category: 'career',
      type: 'text',
    },
    {
      id: 'i-travel',
      label: '✈️ Travel Plan',
      icon: '✈️',
      prompt: 'Plan a detailed 5-day itinerary for Tokyo focusing on historic shrines, street ramen food walks, and scenic sunset viewpoints with daily neighborhood clustering.',
      category: 'travel',
      type: 'text',
    },
    {
      id: 'i-presentation',
      label: '📊 Presentation',
      icon: '📊',
      prompt: 'Create an educational 5-slide presentation outline explaining how Large Language Models work to non-technical business leaders with key bullet points and analogies.',
      category: 'education',
      type: 'text',
    },
  ],
  advanced: [
    {
      id: 'a-research',
      label: '🧠 Research Workflow',
      icon: '🧠',
      prompt: 'Design a multi-step research workflow analyzing customer churn for a subscription SaaS product. Include data collection sources, statistical hypothesis testing, feature importance analysis, and executive synthesis.',
      category: 'productivity',
      type: 'text',
    },
    {
      id: 'a-architecture',
      label: '💻 Software Architecture',
      icon: '💻',
      prompt: 'Generate an enterprise software architecture plan for an event-driven payment processing gateway handling 10,000 TPS with PostgreSQL, Kafka event bus, Redis idempotency caching, and circuit-breaker failover.',
      category: 'coding',
      type: 'text',
    },
    {
      id: 'a-strategy',
      label: '📈 Business Strategy',
      icon: '📈',
      prompt: 'Analyze a competitive disruption threat for a mid-market retail brand facing low-cost global competitors. Provide a 90-day strategic turnaround roadmap with measurable OKRs and resource allocation.',
      category: 'career',
      type: 'text',
    },
    {
      id: 'a-campaign',
      label: '🎬 Creative Campaign',
      icon: '🎬',
      prompt: 'Build a comprehensive omni-channel creative campaign brief for an eco-friendly apparel brand launching a zero-waste sneaker line across TikTok, 3D billboard activations, and experiential pop-ups with ROI metrics.',
      category: 'social',
      type: 'text',
    },
    {
      id: 'a-workflow',
      label: '🤖 AI Workflow',
      icon: '🤖',
      prompt: 'Architect an advanced Retrieval-Augmented Generation (RAG) system pipeline with semantic hybrid search, cross-encoder reranking, hallucination guardrails, and citation verification with latency benchmarks.',
      category: 'coding',
      type: 'text',
    },
  ],
};

export const PracticeWorkspace: React.FC<PracticeWorkspaceProps> = ({
  initialChallengeId,
  initialPrompt,
  initialCategory,
  initialOutputType = 'text',
  beginnerMode: propBeginnerMode,
  isGuest = false,
  language = 'en',
  onNavigate,
  onRecordPractice,
  onRecordImprovement,
  onSavePrompt,
}) => {
  const t = getTranslation(language);
  // 1. Current Level State (Requirement 1 & 14)
  const [selectedLevel, setSelectedLevel] = useState<Difficulty>('beginner');

  // Category & Challenge state
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(initialCategory || 'social');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [outputType, setOutputType] = useState<OutputType>(initialOutputType);

  // Editor & Outputs
  const [prompt, setPrompt] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isFallbackOutput, setIsFallbackOutput] = useState<boolean>(false);
  const [fallbackNote, setFallbackNote] = useState<string | undefined>(undefined);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationErrorCode, setGenerationErrorCode] = useState<number | undefined>(undefined);

  // Analysis & Improvement
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [improvement, setImprovement] = useState<ImprovementResult | null>(null);
  const [isImproving, setIsImproving] = useState<boolean>(false);

  // Explanation Modal state
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explanation, setExplanation] = useState<OutputExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Template Picker Modal
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  // Guest Save intercept modal
  const [guestSaveModalOpen, setGuestSaveModalOpen] = useState(false);

  // Comparison State (Requirement 12)
  const [originalPromptSnapshot, setOriginalPromptSnapshot] = useState<string>('');
  const [originalOutputSnapshot, setOriginalOutputSnapshot] = useState<string>('');
  const [improvedPromptSnapshot, setImprovedPromptSnapshot] = useState<string>('');
  const [improvedOutputSnapshot, setImprovedOutputSnapshot] = useState<string>('');
  const [showComparison, setShowComparison] = useState<boolean>(false);

  // UI Utilities
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const analysisRef = useRef<HTMLDivElement>(null);
  const improvementRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  // Level Progression mock values / progress (Requirement 14)
  const levelProgressMap: Record<Difficulty, number> = {
    beginner: 80,
    intermediate: 40,
    advanced: 20,
  };

  // Initialize or update with initial challenge
  useEffect(() => {
    if (initialChallengeId) {
      const match = CHALLENGES.find((c) => c.id === initialChallengeId);
      if (match) {
        setSelectedCategory(match.category);
        setCurrentChallenge(match);
        if (match.difficulty) setSelectedLevel(match.difficulty);
        if (match.outputType) setOutputType(match.outputType);
        if (initialPrompt) {
          setPrompt(initialPrompt);
        } else {
          setPrompt(match.sampleStarter || '');
        }
        return;
      }
    }

    if (initialPrompt) {
      setPrompt(initialPrompt);
    } else if (!prompt) {
      // Default to beginner sample
      setPrompt('Write a warm, loving birthday message for my mother expressing gratitude for everything she has done.');
    }
  }, [initialChallengeId, initialPrompt]);

  const handleSelectLevel = (level: Difficulty) => {
    setSelectedLevel(level);
    playSound('click');
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    const match = CHALLENGES.find((c) => c.category === catId && c.difficulty === selectedLevel) ||
      CHALLENGES.find((c) => c.category === catId);
    if (match) {
      setCurrentChallenge(match);
      setPrompt(match.sampleStarter || '');
      if (match.outputType) setOutputType(match.outputType);
    }
    setOutput('');
    setImageUrl(undefined);
    setVideoUrl(undefined);
    setAnalysis(null);
    setImprovement(null);
    setShowComparison(false);
    setIsSaved(false);
    setGenerationError(null);
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setPrompt(template.prompt);
    setSelectedCategory(template.category);
    setOutputType(template.outputType);
    setOutput('');
    setImageUrl(undefined);
    setVideoUrl(undefined);
    setAnalysis(null);
    setImprovement(null);
    setShowComparison(false);
    setIsSaved(false);
    setGenerationError(null);
    playSound('click');
  };

  // 1. Generate Output (Text, Image, Video) (Requirements 6, 7, 8, 9)
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationErrorCode(undefined);
    setIsFallbackOutput(false);
    setFallbackNote(undefined);
    setIsSaved(false);
    playSound('generate');

    try {
      const res = await generateAiOutput(prompt, outputType);

      if (res.error) {
        setGenerationError(res.message || res.error);
        if (res.code === 429 || /quota|limit|usage|resource_exhausted/i.test(res.error) || /quota|limit|usage/i.test(res.message || '')) {
          setGenerationErrorCode(429);
        } else if (res.code) {
          setGenerationErrorCode(res.code);
        }
        return;
      }

      if (res.outputType === 'image') {
        setImageUrl(res.imageUrl);
        setOutput('');
        setVideoUrl(undefined);
      } else if (res.outputType === 'video') {
        setVideoUrl(res.videoUrl);
        setOutput(res.output || '');
        setImageUrl(undefined);
      } else {
        setOutput(res.output || '');
        setImageUrl(undefined);
        setVideoUrl(undefined);
      }

      setIsFallbackOutput(Boolean(res.isFallback));
      setFallbackNote(res.note);

      // Snapshot for side-by-side comparison
      setOriginalPromptSnapshot(prompt);
      setOriginalOutputSnapshot(res.output || (res.imageUrl ? '🎨 Generated Image Output' : '🎬 Generated Video Output'));

      // Automatically evaluate prompt quality with level criteria
      setIsAnalyzing(true);
      try {
        const analysisData = await analyzePrompt(prompt, currentChallenge, selectedLevel === 'beginner', selectedLevel);
        setAnalysis(analysisData);

        onRecordPractice(
          currentChallenge,
          prompt,
          res.output || (res.imageUrl ? 'Image Output' : 'Video Output'),
          analysisData.score,
          outputType
        );
      } catch (err: any) {
        console.warn('Auto analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    } catch (err: any) {
      setGenerationError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Explain This Output (Requirement 13)
  const handleExplainOutput = async () => {
    if (!output && !imageUrl && !videoUrl) return;

    setExplainModalOpen(true);
    setIsExplaining(true);
    playSound('click');

    try {
      const expl = await explainAiOutput(
        prompt,
        output || (imageUrl ? 'Image output generated from prompt' : 'Video output'),
        outputType
      );
      setExplanation(expl);
    } catch (err: any) {
      console.warn('Failed to fetch explanation:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  // 3. Improve Prompt Action (Requirement 10)
  const handleImprove = async () => {
    if (!prompt.trim() || isImproving) return;

    setIsImproving(true);
    playSound('click');

    try {
      const result = await improvePrompt(
        prompt,
        currentChallenge,
        selectedLevel === 'beginner',
        selectedLevel,
        outputType
      );
      setImprovement(result);

      setTimeout(() => {
        improvementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    } catch (err: any) {
      console.error('Improvement error:', err);
    } finally {
      setIsImproving(false);
    }
  };

  // 4. Generate Improved Output (Requirement 11 & 12)
  const handleApplyImproved = async (improvedText: string) => {
    setPrompt(improvedText);
    setImprovedPromptSnapshot(improvedText);
    setGenerationError(null);
    setGenerationErrorCode(undefined);
    setImageUrl(undefined);
    setVideoUrl(undefined);
    setOutput('');
    playSound('improve');

    setIsGenerating(true);
    try {
      const res = await generateAiOutput(improvedText, outputType);

      if (res.error) {
        setGenerationError(res.message || res.error);
        if (res.code === 429 || /quota|limit|usage|resource_exhausted/i.test(res.error) || /quota|limit|usage/i.test(res.message || '')) {
          setGenerationErrorCode(429);
        } else {
          setGenerationErrorCode(res.code);
        }
        return;
      }

      let newOutputStr = res.output || '';
      if (res.outputType === 'image' && res.imageUrl) {
        setImageUrl(res.imageUrl);
        setOutput('');
        newOutputStr = '🎨 Generated Image Output based on improved prompt';
      } else if (res.outputType === 'video' && res.videoUrl) {
        setVideoUrl(res.videoUrl);
        setOutput('');
        newOutputStr = '🎬 Generated Video Output based on improved prompt';
      } else {
        setOutput(res.output || '');
      }

      setImprovedOutputSnapshot(newOutputStr);
      setShowComparison(true);

      const newAnalysis = await analyzePrompt(improvedText, currentChallenge, selectedLevel === 'beginner', selectedLevel);
      setAnalysis(newAnalysis);

      onRecordImprovement(
        currentChallenge,
        originalPromptSnapshot || prompt,
        improvedText,
        newOutputStr,
        improvement?.elementsAdded || ['More Context', 'Better Specificity', 'Clearer Instructions']
      );

      setTimeout(() => {
        comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (e: any) {
      console.error('Failed to generate improved output', e);
      setGenerationError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save prompt check
  const handleSaveCurrentPrompt = () => {
    if (isGuest) {
      setGuestSaveModalOpen(true);
      return;
    }

    const title = prompt.slice(0, 35) + '...';
    onSavePrompt(title, prompt, selectedCategory, outputType, output);
    setIsSaved(true);
    playSound('success');
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSound('click');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyPromptOnly = () => {
    navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    playSound('click');
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const handleDownload = () => {
    if (outputType === 'image' && imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `promptlab-image-${Date.now()}.png`;
      a.click();
    } else {
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promptlab-output-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    playSound('click');
  };

  const currentLevelTasks = LEVEL_TASKS[selectedLevel] || LEVEL_TASKS.beginner;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ==================================================
          1. 3-LEVEL LEARNING SYSTEM HEADER (Requirement 1 & 14)
          ================================================== */}
      <div className="rounded-3xl glass-panel p-6 sm:p-7 shadow-2xl border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Structured Prompting Journey</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{t.currentLevel}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your skill stage to calibrate AI coaching, tasks, and scoring criteria.
            </p>
          </div>

          {/* 3 Level Selector Buttons */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
            <button
              onClick={() => handleSelectLevel('beginner')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedLevel === 'beginner'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{t.beginner}</span>
            </button>

            <button
              onClick={() => handleSelectLevel('intermediate')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedLevel === 'intermediate'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{t.intermediate}</span>
            </button>

            <button
              onClick={() => handleSelectLevel('advanced')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedLevel === 'advanced'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{t.advanced}</span>
            </button>
          </div>
        </div>

        {/* Level Description and Tip Banner (Requirement 1) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-white block">
              {selectedLevel === 'beginner' && t.beginnerDesc}
              {selectedLevel === 'intermediate' && t.intermediateDesc}
              {selectedLevel === 'advanced' && t.advancedDesc}
            </span>
            <p className="text-slate-300">
              {selectedLevel === 'beginner' && t.beginnerTip}
              {selectedLevel === 'intermediate' && t.intermediateTip}
              {selectedLevel === 'advanced' && t.advancedTip}
            </p>
          </div>

          {/* Level Progression Progress Bar (Requirement 14) */}
          <div className="shrink-0 sm:text-right space-y-1 sm:w-48">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>{t.levelProgress}</span>
              <span className="font-mono text-white">{levelProgressMap[selectedLevel]}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  selectedLevel === 'beginner'
                    ? 'bg-emerald-500 w-[80%]'
                    : selectedLevel === 'intermediate'
                    ? 'bg-blue-500 w-[40%]'
                    : 'bg-purple-500 w-[20%]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            TASK SUGGESTIONS BASED ON LEVEL (Requirement 17)
            ================================================== */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>{t.levelTasks}</span>
            </span>
            <span className="text-[11px] text-blue-400">
              {selectedLevel.toUpperCase()} Practice Tasks
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {currentLevelTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setPrompt(t.prompt);
                  setSelectedCategory(t.category);
                  setOutputType(t.type);
                  setOutput('');
                  setImageUrl(undefined);
                  setVideoUrl(undefined);
                  setGenerationError(null);
                  playSound('click');
                }}
                className="px-3.5 py-2 rounded-xl glass-panel-interactive whitespace-nowrap text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 shrink-0 cursor-pointer shadow-sm border border-slate-800 hover:border-blue-500/40"
              >
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Category Domain Pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Browse by Domain
          </span>
          <span className="text-[11px] text-slate-500">10 Categories</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-900/60 to-indigo-900/40 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-[1.03]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-lg mb-1">{cat.icon}</span>
                <span className="text-[11px] font-bold tracking-tight truncate w-full">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          3. TWO-COLUMN WORKSPACE (Requirement 3, 4, 5, 6)
          LEFT: Your Prompt | RIGHT: AI Output
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <PromptEditor
          prompt={prompt}
          language={language}
          onChange={setPrompt}
          onGenerate={handleGenerate}
          onClear={() => {
            setPrompt('');
            setOutput('');
            setImageUrl(undefined);
            setVideoUrl(undefined);
            setAnalysis(null);
            setImprovement(null);
            setIsSaved(false);
            setGenerationError(null);
          }}
          onLoadExample={(ex) => setPrompt(ex)}
          onOpenTemplates={() => setTemplateModalOpen(true)}
          onImproveClick={handleImprove}
          isGenerating={isGenerating}
          challenge={currentChallenge}
          difficulty={selectedLevel}
          beginnerMode={selectedLevel === 'beginner'}
        />

        <OutputPanel
          outputType={outputType}
          language={language}
          onChangeOutputType={setOutputType}
          onImprovePromptClick={handleImprove}
          output={output}
          imageUrl={imageUrl}
          videoUrl={videoUrl}
          isGenerating={isGenerating}
          isImproving={isImproving}
          onRegenerate={handleGenerate}
          onCopy={() => handleCopyText(output || imageUrl || '', 'panel_output')}
          onDownload={handleDownload}
          onSavePrompt={handleSaveCurrentPrompt}
          onExplainOutput={handleExplainOutput}
          onCopyPrompt={handleCopyPromptOnly}
          isCopied={copiedId === 'panel_output'}
          isPromptCopied={promptCopied}
          isSaved={isSaved}
          isFallback={isFallbackOutput}
          fallbackNote={fallbackNote}
          errorMessage={generationError}
          errorCode={generationErrorCode}
        />
      </div>

      {/* 4. Prompt Analysis Diagnostic Section (8 Dimensions + Score) */}
      <div ref={analysisRef}>
        <PromptAnalysisSection
          analysis={analysis}
          beginnerMode={selectedLevel === 'beginner'}
          isLoading={isAnalyzing}
        />
      </div>

      {/* 5. Improvement Section (Requirement 10) */}
      <div ref={improvementRef}>
        <ImprovementSection
          originalPrompt={prompt}
          improvement={improvement}
          onApplyImproved={handleApplyImproved}
          isLoading={isImproving}
          language={language}
          outputType={outputType}
          onChangeOutputType={setOutputType}
        />
      </div>

      {/* 6. Side-by-Side Comparison Section (Requirement 12) */}
      <div ref={comparisonRef}>
        {showComparison && (
          <ComparisonSection
            originalPrompt={originalPromptSnapshot}
            originalOutput={originalOutputSnapshot}
            improvedPrompt={improvedPromptSnapshot}
            improvedOutput={improvedOutputSnapshot}
            onCopyText={handleCopyText}
            copiedId={copiedId}
            elementsImproved={improvement?.elementsAdded}
            language={language}
          />
        )}
      </div>

      {/* Modals */}
      <ExplainOutputModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        explanation={explanation}
        isLoading={isExplaining}
      />

      <TemplatePickerModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Guest Mode Save Prompt Modal */}
      {guestSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-800 relative">
            <button
              onClick={() => setGuestSaveModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/25">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Save Your Prompts & Progress</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create a free account to store your custom prompt library, track progress across devices, maintain daily streaks, and earn mastery badges.
              </p>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => {
                  setGuestSaveModalOpen(false);
                  if (onNavigate) onNavigate('signup');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✨ Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setGuestSaveModalOpen(false);
                  if (onNavigate) onNavigate('login');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>🔐 Already have an account? Login</span>
              </button>

              <button
                onClick={() => setGuestSaveModalOpen(false)}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-400 cursor-pointer"
              >
                Continue practicing as guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
