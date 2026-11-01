import React from 'react';
import { X, Sparkles, Check, ArrowRight, Lightbulb } from 'lucide-react';

interface HookSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  hooks: string[];
  isLoading: boolean;
  onSelectHook: (hook: string) => void;
  onRegenerate: () => void;
}

export const HookSuggestionsModal: React.FC<HookSuggestionsModalProps> = ({
  isOpen,
  onClose,
  topic,
  hooks,
  isLoading,
  onSelectHook,
  onRegenerate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Opening Hook Variations
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">
                Topic: {topic || 'Your selected topic'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">
                Crafting scroll-stopping opening hooks...
              </p>
            </div>
          ) : hooks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No hooks generated yet. Click generate below.
            </div>
          ) : (
            hooks.map((hook, idx) => {
              const types = [
                'Contrarian Observation',
                'Hard-Earned Lesson',
                'Actionable Insight',
                'Curious Inquiry',
              ];
              const tag = types[idx] || 'Opening Hook';

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all group cursor-pointer"
                  onClick={() => {
                    onSelectHook(hook);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                      {tag}
                    </span>
                    <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity font-semibold">
                      <span>Use this hook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    "{hook}"
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isLoading}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate 4 New Angles</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
