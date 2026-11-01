import React from 'react';
import { Bookmark, Trash2, Copy, Check, ArrowUpRight, Calendar, ArrowLeft } from 'lucide-react';
import { GeneratedPost } from '../types';

interface SavedDraftsViewProps {
  drafts: GeneratedPost[];
  onSelectDraft: (draft: GeneratedPost) => void;
  onDeleteDraft: (id: string) => void;
  onClearAll: () => void;
  onBackToStudio: () => void;
}

export const SavedDraftsView: React.FC<SavedDraftsViewProps> = ({
  drafts,
  onSelectDraft,
  onDeleteDraft,
  onClearAll,
  onBackToStudio,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToStudio}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </button>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <span>Saved LinkedIn Drafts ({drafts.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Posts you've generated and saved during this session
          </p>
        </div>

        {drafts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
          >
            Clear All Drafts
          </button>
        )}
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No saved drafts yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you generate a LinkedIn post in the Studio, click "Save Draft" to keep it here for easy copying and editing.
          </p>
          <button
            onClick={onBackToStudio}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Go to Studio Generator
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((draft) => {
            const isOptimal = draft.wordCount >= 100 && draft.wordCount <= 180;
            return (
              <div
                key={draft.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider line-clamp-1">
                      {draft.topic || 'General Topic'}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold tabular-nums px-2 py-0.5 rounded ${
                        isOptimal
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {draft.wordCount} words
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-6 leading-relaxed whitespace-pre-line mb-3 font-normal">
                    {draft.content}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{draft.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 font-medium">
                      {draft.tone}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(draft.id, draft.content)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {copiedId === draft.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteDraft(draft.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onSelectDraft(draft);
                      onBackToStudio();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Load in Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
