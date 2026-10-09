import React, { useState } from 'react';
import { SavedPrompt, OutputType, CategoryId } from '../types';
import { CATEGORIES } from '../data/challenges';
import {
  Bookmark,
  Clock,
  Sparkles,
  Search,
  Star,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  Filter,
  Check,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Tag,
} from 'lucide-react';

interface MyPromptsPageProps {
  savedPrompts: SavedPrompt[];
  onOpenInPractice: (prompt: string, category?: CategoryId, outputType?: OutputType) => void;
  onDeletePrompt: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicatePrompt: (item: SavedPrompt) => void;
}

export const MyPromptsPage: React.FC<MyPromptsPageProps> = ({
  savedPrompts,
  onOpenInPractice,
  onDeletePrompt,
  onToggleFavorite,
  onDuplicatePrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'improved' | 'image' | 'video' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = savedPrompts.filter((p) => {
    // Tab filter
    if (activeTab === 'favorites' && !p.isFavorite) return false;
    if (activeTab === 'improved' && !p.improvedVersion) return false;
    if (activeTab === 'image' && p.outputType !== 'image') return false;
    if (activeTab === 'video' && p.outputType !== 'video') return false;

    // Search filter
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.promptText.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Prompt Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">My Prompts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize, duplicate, and practice your saved, improved, and favorite AI prompts.
          </p>
        </div>

        <button
          onClick={() => onOpenInPractice('', 'education', 'text')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Prompts', count: savedPrompts.length },
            { id: 'favorites', label: 'Favorites', count: savedPrompts.filter((p) => p.isFavorite).length },
            { id: 'improved', label: 'Improved', count: savedPrompts.filter((p) => p.improvedVersion).length },
            { id: 'image', label: 'Image Prompts', count: savedPrompts.filter((p) => p.outputType === 'image').length },
            { id: 'video', label: 'Video Prompts', count: savedPrompts.filter((p) => p.outputType === 'video').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Prompts Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Prompts Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Save prompts from the Practice Workspace or click below to start writing and refining a new prompt!
          </p>
          <button
            onClick={() => onOpenInPractice('', 'education', 'text')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
          >
            Open Practice Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const catObj = CATEGORIES.find((c) => c.id === item.category);

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Top card bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{catObj?.icon || '📝'}</span>
                      <span className="text-xs font-semibold text-slate-400">{catObj?.name || 'General'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {item.outputType}
                      </span>
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                        title={item.isFavorite ? 'Remove favorite' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base mb-2 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-32 overflow-y-auto mb-4 whitespace-pre-wrap select-all">
                    "{item.promptText}"
                  </div>

                  {item.improvedVersion && (
                    <div className="mb-4 p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-semibold">Has Improved Version Available</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.promptText, item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy prompt text"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onDuplicatePrompt(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                      title="Duplicate prompt"
                    >
                      Duplicate
                    </button>

                    <button
                      onClick={() => onOpenInPractice(item.promptText, item.category, item.outputType)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                      title="Open in Practice Workspace"
                    >
                      <span>Practice</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onDeletePrompt(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete prompt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
