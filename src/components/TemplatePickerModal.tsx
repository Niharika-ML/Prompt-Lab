import React, { useState } from 'react';
import { PROMPT_TEMPLATES } from '../data/templates';
import { PromptTemplate, CategoryId, OutputType } from '../types';
import { X, Search, Sparkles, ArrowRight, LayoutTemplate, Tag } from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PromptTemplate) => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = PROMPT_TEMPLATES.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.prompt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Prompt Templates</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready-to-use proven prompt structures for work, education, and creative projects.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates (e.g. Email, Biryani, Resume, Trip)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'career', 'education', 'social', 'cooking', 'travel', 'shopping', 'coding', 'image', 'video'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tmpl.icon}</span>
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                      {tmpl.title}
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {tmpl.outputType}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {tmpl.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  "{tmpl.prompt}"
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
