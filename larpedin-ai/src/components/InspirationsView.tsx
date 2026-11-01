import React from 'react';
import { ArrowLeft, Lightbulb, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { TOPIC_INSPIRATIONS } from '../data/presets';
import { WritingTone } from '../types';

interface InspirationsViewProps {
  onSelectTopic: (topic: string, industry: string, tone: WritingTone) => void;
  onBackToStudio: () => void;
}

export const InspirationsView: React.FC<InspirationsViewProps> = ({
  onSelectTopic,
  onBackToStudio,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToStudio}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </button>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>High-Engagement Topic Inspirations</span>
          </h2>
          <p className="text-xs text-slate-500">
            Curated ideas proven to generate genuine, thoughtful LinkedIn discussions
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {TOPIC_INSPIRATIONS.map((group) => (
          <div key={group.audience} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>For {group.audience}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-blue-700 block line-clamp-1">
                      {item.title}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      "{item.topic}"
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <span>{item.industry}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">{item.tone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTopic(item.topic, item.industry, item.tone)}
                    className="mt-4 pt-3 border-t border-slate-100 w-full text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center justify-between"
                  >
                    <span>Use this topic in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
