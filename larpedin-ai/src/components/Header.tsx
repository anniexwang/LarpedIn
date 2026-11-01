import React from 'react';
import { Sparkles, Bookmark, Lightbulb, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeView: 'studio' | 'drafts' | 'inspirations' | 'guidelines';
  onSelectView: (view: 'studio' | 'drafts' | 'inspirations' | 'guidelines') => void;
  savedCount: number;
  onNewPost: () => void;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  savedCount,
  onNewPost,
  isGenerating = false,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            onSelectView('studio');
          }}
          className="text-xl font-bold tracking-tight text-slate-900 hover:text-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
            in
          </span>
          <span>LarpedIn AI</span>
        </a>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSelectView('studio')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'studio'
              ? 'text-blue-700 font-semibold underline decoration-2 underline-offset-8'
              : 'hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => onSelectView('inspirations')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'inspirations'
              ? 'text-blue-700 font-semibold underline decoration-2 underline-offset-8'
              : 'hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Inspirations</span>
        </button>

        <button
          onClick={() => onSelectView('drafts')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'drafts'
              ? 'text-blue-700 font-semibold underline decoration-2 underline-offset-8'
              : 'hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4 text-slate-500" />
          <span>Saved Drafts</span>
          {savedCount > 0 && (
            <span className="text-xs font-mono tabular-nums text-slate-500">
              ({savedCount})
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectView('guidelines')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'guidelines'
              ? 'text-blue-700 font-semibold underline decoration-2 underline-offset-8'
              : 'hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Voice & Rules</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewPost}
          disabled={isGenerating}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Draft...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Post Draft</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
