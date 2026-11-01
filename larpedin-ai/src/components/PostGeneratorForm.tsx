import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  Plus,
  X,
  Compass,
  Target,
  FileText,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  UserPersona,
  UserArchetype,
  WritingTone,
  HookStyle,
  PostRequest,
} from '../types';
import {
  ARCHETYPE_PRESETS,
  INDUSTRY_OPTIONS,
  TONE_OPTIONS,
  GOAL_OPTIONS,
  CALENDAR_EVENT_PRESETS,
} from '../data/presets';

interface PostGeneratorFormProps {
  persona: UserPersona;
  onUpdatePersona: (newPersona: UserPersona) => void;
  calendarEvent: string;
  onUpdateCalendarEvent: (event: string) => void;
  topic: string;
  onUpdateTopic: (topic: string) => void;
  onGenerate: (request: PostRequest) => void;
  isGenerating: boolean;
  onOpenHooks: (topic: string, industry: string, tone: WritingTone) => void;
  onOpenInspirations: () => void;
}

export const PostGeneratorForm: React.FC<PostGeneratorFormProps> = ({
  persona,
  onUpdatePersona,
  calendarEvent,
  onUpdateCalendarEvent,
  topic,
  onUpdateTopic,
  onGenerate,
  isGenerating,
  onOpenHooks,
  onOpenInspirations,
}) => {
  const [userFacts, setUserFacts] = useState('');
  const [hookStyle, setHookStyle] = useState<HookStyle>('Direct Insight');
  const [newInterestInput, setNewInterestInput] = useState('');

  const handleArchetypeChange = (archetype: UserArchetype) => {
    const selected = ARCHETYPE_PRESETS[archetype];
    if (selected) {
      onUpdatePersona({ ...selected });
    }
  };

  const handleAddInterest = () => {
    if (
      newInterestInput.trim() &&
      !persona.careerInterests.includes(newInterestInput.trim())
    ) {
      onUpdatePersona({
        ...persona,
        careerInterests: [...persona.careerInterests, newInterestInput.trim()],
      });
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    onUpdatePersona({
      ...persona,
      careerInterests: persona.careerInterests.filter((item) => item !== interest),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      archetype: persona.archetype,
      userArchetype: persona.archetype,
      industry: persona.industry,
      goal: persona.goals,
      goals: persona.goals,
      focus_areas: persona.careerInterests.join(', '),
      careerInterests: persona.careerInterests.join(', '),
      calendar_event: calendarEvent.trim(),
      calendarEvent: calendarEvent.trim(),
      topic: topic.trim() || calendarEvent.trim(),
      tone: persona.tone,
      userFacts: userFacts.trim() || undefined,
      hookStyle,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5"
    >
      {/* 1. Target Archetype Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>1. User Archetype</span>
          </label>
          <span className="text-xs text-slate-500">
            Tailors persona voice & avatar
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => handleArchetypeChange('student')}
            className={`py-2 px-3 text-xs font-semibold rounded-md transition-all whitespace-nowrap text-center ${
              persona.archetype === 'student'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎓 Student / Grad
          </button>
          <button
            type="button"
            onClick={() => handleArchetypeChange('job_seeker')}
            className={`py-2 px-3 text-xs font-semibold rounded-md transition-all whitespace-nowrap text-center ${
              persona.archetype === 'job_seeker'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💼 Job Seeker
          </button>
          <button
            type="button"
            onClick={() => handleArchetypeChange('professional')}
            className={`py-2 px-3 text-xs font-semibold rounded-md transition-all whitespace-nowrap text-center ${
              persona.archetype === 'professional'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 Professional
          </button>
        </div>

        {/* User Card Micro-Preview */}
        <div className="mt-2.5 flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
          <img
            src={persona.avatarUrl}
            alt={persona.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={persona.name}
              onChange={(e) =>
                onUpdatePersona({ ...persona, name: e.target.value })
              }
              className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full"
              placeholder="Your Name"
            />
            <input
              type="text"
              value={persona.headline}
              onChange={(e) =>
                onUpdatePersona({ ...persona, headline: e.target.value })
              }
              className="text-xs text-slate-500 truncate bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full"
              placeholder="Your Headline / Current Role"
            />
          </div>
        </div>
      </div>

      {/* 2. Industry & Professional Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>2. Industry</span>
          </label>
          <select
            value={persona.industry}
            onChange={(e) =>
              onUpdatePersona({ ...persona, industry: e.target.value })
            }
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {INDUSTRY_OPTIONS.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>3. Professional Goal</span>
          </label>
          <select
            value={persona.goals}
            onChange={(e) =>
              onUpdatePersona({ ...persona, goals: e.target.value })
            }
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 truncate"
          >
            {GOAL_OPTIONS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Focus Areas / Skills */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>4. Focus Areas & Skills</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            Shapes vocabulary and domain nuance
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {persona.careerInterests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-2.5 py-1 rounded-md transition-colors"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(interest)}
                className="text-slate-400 hover:text-rose-600 transition-colors"
                title="Remove focus area"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newInterestInput}
            onChange={(e) => setNewInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddInterest();
              }
            }}
            placeholder="Add skill or focus area (e.g. Distributed Systems, Product Discovery)..."
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* 5. Calendar Event Context (Directly connected to {{calendar_event}}) */}
      <div className="rounded-lg border border-blue-200/90 bg-blue-50/30 p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>5. Calendar Event Context</span>
          </label>
          <span className="text-[11px] text-blue-700 font-medium">
            Story anchor for emotional arc
          </span>
        </div>

        <input
          type="text"
          value={calendarEvent}
          onChange={(e) => onUpdateCalendarEvent(e.target.value)}
          placeholder="E.g., Weekly 1-on-1 with manager, Sprint retro after production bug, Final round interview..."
          className="w-full text-xs font-medium bg-white border border-blue-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
        />

        {/* Quick Calendar Event Presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
          {CALENDAR_EVENT_PRESETS.slice(0, 4).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onUpdateCalendarEvent(preset)}
              className="px-2 py-0.5 text-[11px] bg-white hover:bg-blue-100 border border-slate-200 hover:border-blue-300 rounded text-slate-600 hover:text-blue-800 transition-colors truncate max-w-[200px]"
              title={preset}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Preferred Tone */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
          <span>6. Preferred Tone</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TONE_OPTIONS.map((t) => {
            const isSelected = persona.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onUpdatePersona({ ...persona, tone: t.id })}
                className={`p-2 rounded-lg text-left border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-blue-700' : 'text-slate-800'
                    }`}
                  >
                    {t.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Topic to Discuss & Hook Angle */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>7. Lesson or Takeaway (Optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenInspirations}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Browse Ideas</span>
            </button>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              onClick={() => onOpenHooks(topic || calendarEvent, persona.industry, persona.tone)}
              disabled={!topic.trim() && !calendarEvent.trim()}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>Hook Generator</span>
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={topic}
          onChange={(e) => onUpdateTopic(e.target.value)}
          placeholder="E.g., What I learned about prioritising user needs over vanity metrics, or the power of pausing before reacting..."
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
        />

        {/* Hook Angle */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium">
            Hook Angle:
          </span>
          {(
            [
              'Direct Insight',
              'Contrarian / Surprising',
              'Story / Lesson Learned',
              'Curious Question',
            ] as HookStyle[]
          ).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setHookStyle(style)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                hookStyle === style
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating LinkedIn Post...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate LinkedIn Post (Using Connected Variables)</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
