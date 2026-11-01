import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PostGeneratorForm } from './components/PostGeneratorForm';
import { LinkedInPreviewCard } from './components/LinkedInPreviewCard';
import { SavedDraftsView } from './components/SavedDraftsModal';
import { InspirationsView } from './components/InspirationsView';
import { VoiceGuideView } from './components/VoiceGuideView';
import { HookSuggestionsModal } from './components/HookSuggestionsModal';
import { ARCHETYPE_PRESETS, INITIAL_SAMPLE_POST } from './data/presets';
import { UserPersona, PostRequest, GeneratedPost, WritingTone } from './types';
import { AlertCircle, X } from 'lucide-react';

const computeWordCount = (text: string): number => {
  if (!text) return 0;
  return text
    .replace(/[#\n\r]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
};

export default function App() {
  const [activeView, setActiveView] = useState<
    'studio' | 'drafts' | 'inspirations' | 'guidelines'
  >('studio');

  const [persona, setPersona] = useState<UserPersona>(ARCHETYPE_PRESETS.student);
  const [calendarEvent, setCalendarEvent] = useState<string>(
    'Weekly 1-on-1 with engineering manager'
  );
  const [currentTopic, setCurrentTopic] = useState<string>(
    'What building my first production app taught me about readable code'
  );
  const [postContent, setPostContent] = useState<string>(INITIAL_SAMPLE_POST);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved Drafts
  const [savedDrafts, setSavedDrafts] = useState<GeneratedPost[]>(() => {
    try {
      const stored = localStorage.getItem('larpedin_saved_drafts');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'sample-1',
        content: INITIAL_SAMPLE_POST,
        wordCount: computeWordCount(INITIAL_SAMPLE_POST),
        characterCount: INITIAL_SAMPLE_POST.length,
        topic: 'Junior Engineer Lessons: Boring Code beats Clever Code',
        tone: 'Humble & Growth-Oriented',
        calendarEvent: 'Weekly 1-on-1 with engineering manager',
        createdAt: 'Just now',
        personaName: ARCHETYPE_PRESETS.student.name,
        personaHeadline: ARCHETYPE_PRESETS.student.headline,
        isSaved: true,
      },
    ];
  });

  // Hook suggestions modal state
  const [hookModal, setHookModal] = useState<{
    isOpen: boolean;
    topic: string;
    industry: string;
    tone: WritingTone;
    hooks: string[];
    isLoading: boolean;
  }>({
    isOpen: false,
    topic: '',
    industry: persona.industry,
    tone: persona.tone,
    hooks: [],
    isLoading: false,
  });

  useEffect(() => {
    try {
      localStorage.setItem('larpedin_saved_drafts', JSON.stringify(savedDrafts));
    } catch (e) {
      console.error(e);
    }
  }, [savedDrafts]);

  const wordCount = computeWordCount(postContent);

  const isCurrentPostSaved = savedDrafts.some(
    (d) => d.content.trim() === postContent.trim()
  );

  const handleGenerate = async (request: PostRequest) => {
    setIsGenerating(true);
    setErrorMessage(null);
    if (request.topic) {
      setCurrentTopic(request.topic);
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate LinkedIn post');
      }

      setPostContent(data.post);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage(
        err.message || 'Something went wrong while generating the post. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Called when the user clicks the blue "New Post Draft" button in the header
  const handleTriggerNewPostDraft = async () => {
    setActiveView('studio');
    await handleGenerate({
      archetype: persona.archetype,
      userArchetype: persona.archetype,
      industry: persona.industry,
      goal: persona.goals,
      goals: persona.goals,
      focus_areas: persona.careerInterests.join(', '),
      careerInterests: persona.careerInterests.join(', '),
      calendar_event: calendarEvent.trim() || 'Weekly 1-on-1 with engineering manager',
      calendarEvent: calendarEvent.trim() || 'Weekly 1-on-1 with engineering manager',
      topic: currentTopic.trim() || calendarEvent.trim() || 'Key learnings from my workday',
      tone: persona.tone,
    });
  };

  const handleRefine = async (instruction: string) => {
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPost: postContent,
          instruction,
          archetype: persona.archetype,
          userArchetype: persona.archetype,
          industry: persona.industry,
          goal: persona.goals,
          goals: persona.goals,
          focus_areas: persona.careerInterests.join(', '),
          careerInterests: persona.careerInterests.join(', '),
          calendar_event: calendarEvent,
          calendarEvent: calendarEvent,
          tone: persona.tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine post');
      }

      setPostContent(data.post);
    } catch (err: any) {
      console.error('Refine failed:', err);
      setErrorMessage(err.message || 'Failed to refine post. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleOpenHooks = async (
    topicText: string,
    industryText: string,
    toneVal: WritingTone
  ) => {
    setHookModal({
      isOpen: true,
      topic: topicText,
      industry: industryText,
      tone: toneVal,
      hooks: [],
      isLoading: true,
    });

    try {
      const res = await fetch('/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicText,
          calendarEvent,
          industry: industryText,
          tone: toneVal,
        }),
      });

      const data = await res.json();
      setHookModal((prev) => ({
        ...prev,
        hooks: data.hooks || [],
        isLoading: false,
      }));
    } catch (err) {
      console.error(err);
      setHookModal((prev) => ({
        ...prev,
        hooks: [
          `Yesterday at 9:00 AM, my entire perspective on ${industryText} changed.`,
          `Most people think this is a routine meeting. They couldn't be more wrong.`,
          `I almost canceled this calendar event. It was the best decision I never made.`,
          `The difference between good and viral work comes down to one meeting.`,
        ],
        isLoading: false,
      }));
    }
  };

  const handleSaveDraft = () => {
    if (isCurrentPostSaved) return;

    const newDraft: GeneratedPost = {
      id: `draft-${Date.now()}`,
      content: postContent,
      wordCount,
      characterCount: postContent.length,
      topic: currentTopic || calendarEvent || 'LinkedIn Post',
      tone: persona.tone,
      calendarEvent,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      personaName: persona.name,
      personaHeadline: persona.headline,
      isSaved: true,
    };

    setSavedDrafts([newDraft, ...savedDrafts]);
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts(savedDrafts.filter((d) => d.id !== id));
  };

  const handleClearAllDrafts = () => {
    if (window.confirm('Are you sure you want to clear all saved drafts?')) {
      setSavedDrafts([]);
    }
  };

  const handleSelectDraft = (draft: GeneratedPost) => {
    setPostContent(draft.content);
    setCurrentTopic(draft.topic);
    if (draft.calendarEvent) {
      setCalendarEvent(draft.calendarEvent);
    }
  };

  const handleSelectTopicFromInspirations = (
    topicText: string,
    industryText: string,
    toneVal: WritingTone
  ) => {
    setCurrentTopic(topicText);
    setCalendarEvent(topicText);
    setPersona((prev) => ({
      ...prev,
      industry: industryText,
      tone: toneVal,
    }));
    setActiveView('studio');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        savedCount={savedDrafts.length}
        onNewPost={handleTriggerNewPostDraft}
        isGenerating={isGenerating}
      />

      {/* Global Error Banner if any */}
      {errorMessage && (
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeView === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form & Profile Personalization */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  LinkedIn Content Studio
                </h1>
                <p className="text-xs text-slate-500">
                  Connected directly to System Instructions: Archetype, Industry, Goals, Focus Areas, Calendar Event & Tone.
                </p>
              </div>

              <PostGeneratorForm
                persona={persona}
                onUpdatePersona={setPersona}
                calendarEvent={calendarEvent}
                onUpdateCalendarEvent={setCalendarEvent}
                topic={currentTopic}
                onUpdateTopic={setCurrentTopic}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onOpenHooks={(t, ind, tn) => handleOpenHooks(t, ind, tn)}
                onOpenInspirations={() => setActiveView('inspirations')}
              />
            </div>

            {/* Right Column: Live Feed Preview & Verification Card */}
            <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Generated LinkedIn Post</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Live mobile-optimized preview with strict line breaks & hashtags
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Ready to copy</span>
                </div>
              </div>

              <LinkedInPreviewCard
                postContent={postContent}
                wordCount={wordCount}
                persona={persona}
                isGenerating={isGenerating}
                isRefining={isRefining}
                onUpdateContent={setPostContent}
                onRefine={handleRefine}
                onSaveDraft={handleSaveDraft}
                isSaved={isCurrentPostSaved}
              />
            </div>
          </div>
        )}

        {activeView === 'drafts' && (
          <SavedDraftsView
            drafts={savedDrafts}
            onSelectDraft={handleSelectDraft}
            onDeleteDraft={handleDeleteDraft}
            onClearAll={handleClearAllDrafts}
            onBackToStudio={() => setActiveView('studio')}
          />
        )}

        {activeView === 'inspirations' && (
          <InspirationsView
            onSelectTopic={handleSelectTopicFromInspirations}
            onBackToStudio={() => setActiveView('studio')}
          />
        )}

        {activeView === 'guidelines' && (
          <VoiceGuideView onBackToStudio={() => setActiveView('studio')} />
        )}
      </main>

      {/* Opening Hook Variations Modal */}
      <HookSuggestionsModal
        isOpen={hookModal.isOpen}
        onClose={() => setHookModal((prev) => ({ ...prev, isOpen: false }))}
        topic={hookModal.topic}
        hooks={hookModal.hooks}
        isLoading={hookModal.isLoading}
        onSelectHook={(selectedHook) => {
          setPostContent(`${selectedHook}\n\n${postContent}`);
        }}
        onRegenerate={() =>
          handleOpenHooks(hookModal.topic, hookModal.industry, hookModal.tone)
        }
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span>LarpedIn AI</span>
          <span aria-hidden="true">·</span>
          <span>Connected System Instructions</span>
          <span aria-hidden="true">·</span>
          <span>Calendar Event Context</span>
          <span aria-hidden="true">·</span>
          <span>100–180 Words Guardrails</span>
        </div>
      </footer>
    </div>
  );
}
