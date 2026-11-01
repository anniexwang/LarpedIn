import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import SignalList from "@/components/content/SignalList";
import PostComposer from "@/components/content/PostComposer";
import QueueList from "@/components/content/QueueList";
import PostSettings from "@/components/content/PostSettings";
import { generatePost } from "@/lib/postGenerator";
import { getCalendarEvents } from "@/lib/calendarData";
import { useToast } from "@/components/ui/use-toast";
import { EVENTS, QUEUED, TONES, composeDraft, formatEventDate } from "@/lib/mockData";

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function Content() {
  // Events the user typed in themselves, plus Google Calendar events (once linked), plus samples.
  const [customEvents, setCustomEvents] = useState(() => readStored("larpedin-custom-events", []));
  const calendarEvents = useMemo(() => {
    try {
      return getCalendarEvents();
    } catch {
      return [];
    }
  }, []);
  const allEvents = useMemo(
    () => [...customEvents, ...calendarEvents, ...EVENTS],
    [customEvents, calendarEvents],
  );

  const [selectedId, setSelectedId] = useState(() => allEvents[0].id);
  const [industry, setIndustry] = useState(() => readStored("larpedin-industry", ""));
  const [customTone, setCustomTone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState(false);
  const [tone, setTone] = useState("insightful");
  const [platform, setPlatform] = useState("LinkedIn");
  const [variant, setVariant] = useState(0);
  const [queue, setQueue] = useState(QUEUED);
  const [savedDrafts, setSavedDrafts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("larpedin-drafts") || "[]");
    } catch {
      return [];
    }
  });
  const { toast } = useToast();

  const event = allEvents.find((item) => item.id === selectedId) || allEvents[0];
  const [draft, setDraft] = useState(() =>
    composeDraft(event, "insightful", 0, "LinkedIn"),
  );

  // Template text is just a placeholder until the AI writes a real post.
  useEffect(() => {
    if (!aiDraft) setDraft(composeDraft(event, tone, variant, platform));
  }, [event, tone, variant, platform, aiDraft]);

  useEffect(() => {
    try {
      localStorage.setItem("larpedin-industry", JSON.stringify(industry));
    } catch {
      /* ignore */
    }
  }, [industry]);

  const selectEvent = (id) => {
    setSelectedId(id);
    setAiDraft(false);
  };

  const chooseTone = (value) => {
    setTone(value);
    setCustomTone("");
  };

  const addEvent = ({ title, type, date, notes }) => {
    const newEvent = {
      id: `custom-${Date.now()}`,
      title,
      type,
      date,
      time: "",
      location: "",
      notes,
      angle: notes || title,
      theme: title,
    };
    const next = [newEvent, ...customEvents];
    setCustomEvents(next);
    try {
      localStorage.setItem("larpedin-custom-events", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    selectEvent(newEvent.id);
    toast({ title: "Event added", description: title });
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const text = await generatePost({
        event,
        tone: customTone.trim() || tone,
        industry,
        platform,
      });
      setDraft(text);
      setAiDraft(true);
    } catch (err) {
      toast({
        title: "Could not write your post",
        description: err?.message || "Try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const regenerate = () => generate();

  // Reopens a saved draft with the event, tone and platform it was written for.
  const openSavedDraft = (saved) => {
    const matchingEvent = allEvents.find(
      (item) => item.id === saved.eventId || item.title === saved.eventTitle,
    );

    if (matchingEvent) {
      setSelectedId(matchingEvent.id);
    }

    if (TONES.some((item) => item.id === saved.tone)) {
      chooseTone(saved.tone);
    } else if (saved.tone) {
      setCustomTone(saved.tone);
    }
    if (saved.platform) setPlatform(saved.platform);
    setAiDraft(true); // keep the saved text instead of the template
    setDraft(saved.content);
  };

  const saveDraft = () => {
    const savedDraft = {
      id: `draft-${Date.now()}`,
      content: draft,
      platform,
      tone: customTone.trim() || tone,
      eventId: event.id,
      eventTitle: event.title,
      savedAt: new Date().toISOString(),
    };
    const nextDrafts = [savedDraft, ...savedDrafts];

    setSavedDrafts(nextDrafts);
    localStorage.setItem("larpedin-drafts", JSON.stringify(nextDrafts));
    toast({
      title: "Draft saved",
      description: `${platform} · ${event.title}`,
    });
  };

  const addToQueue = () => {
    const title = draft.split("\n")[0].slice(0, 64);
    setQueue((posts) => [
      {
        id: `q-${Date.now()}`,
        title,
        platform,
        when: `${formatEventDate(event.date)} · 09:00`,
        source: event.title,
      },
      ...posts,
    ]);
    toast({
      title: "Added to your queue",
      description: `${platform} · ${formatEventDate(event.date)}`,
    });
  };

  const removeFromQueue = (id) =>
    setQueue((posts) => posts.filter((post) => post.id !== id));

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Say the thing."
        description={
          "Pick a signal from your calendar, choose a tone, and shape a post that sounds like you wrote it — because you did."
        }
      />

      <div className="grid gap-3.5 pt-6 lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="rounded-[1.5rem] border border-border bg-card py-3 lg:sticky lg:top-[72px] lg:self-start">
          <p className="px-4 pb-2 text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            Signals
          </p>
          <SignalList
            events={allEvents}
            selectedId={selectedId}
            onSelect={selectEvent}
          />
        </aside>

        <div className="space-y-3.5">
          <PostSettings
            industry={industry}
            setIndustry={setIndustry}
            customTone={customTone}
            setCustomTone={setCustomTone}
            onAddEvent={addEvent}
            onGenerate={generate}
            generating={generating}
          />

          <PostComposer
            event={event}
            tone={tone}
            setTone={chooseTone}
            platform={platform}
            setPlatform={setPlatform}
            draft={draft}
            setDraft={setDraft}
            onRegenerate={regenerate}
            onQueue={addToQueue}
            onSaveDraft={saveDraft}
          />

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="flex items-center justify-between px-5 pb-1 pt-4 sm:px-6">
              <h2 className="text-[12.5px] font-semibold">Publishing queue</h2>
              <p className="text-[10.5px] text-muted-foreground">
                {queue.length} scheduled
              </p>
            </div>
            <QueueList posts={queue} onRemove={removeFromQueue} />
            <section className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[12.5px] font-semibold">Saved Drafts</h2>
                <p className="text-[10.5px] text-muted-foreground">
                  {savedDrafts.length} saved
                </p>
              </div>

              {savedDrafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved drafts yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {savedDrafts.map((saved) => (
                    <div
                      key={saved.id}
                      className="rounded-xl border border-border p-4"
                    >
                      <p className="text-sm font-medium">{saved.eventTitle}</p>

                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {saved.content}
                      </p>

                      <button
                        type="button"
                        onClick={() => openSavedDraft(saved)}
                        className="mt-3 text-xs font-medium text-primary hover:underline"
                      >
                        Open Draft
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
