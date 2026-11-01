import React, { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import SignalList from "@/components/content/SignalList";
import PostComposer from "@/components/content/PostComposer";
import QueueList from "@/components/content/QueueList";
import { useToast } from "@/components/ui/use-toast";
import { EVENTS, QUEUED, composeDraft, formatEventDate } from "@/lib/mockData";

export default function Content() {
  const [selectedId, setSelectedId] = useState(EVENTS[0].id);
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

  const event = EVENTS.find((item) => item.id === selectedId) || EVENTS[0];
  const [draft, setDraft] = useState(() =>
    composeDraft(event, "insightful", 0, "LinkedIn"),
  );

  useEffect(() => {
    setDraft(composeDraft(event, tone, variant, platform));
  }, [event, tone, variant, platform]);

  const openSavedDraft = (saved) => {
    const matchingEvent = EVENTS.find(
      (item) => item.title === saved.eventTitle,
    );

    if (matchingEvent) {
      setSelectedId(matchingEvent.id);
    }

    setTone(saved.tone);
    setPlatform(saved.platform);
    setDraft(saved.content);
  };

  const regenerate = () => setVariant((value) => value + 1);

  const saveDraft = () => {
    const savedDraft = {
      id: `draft-${Date.now()}`,
      content: draft,
      platform,
      tone,
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
            events={EVENTS}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        <div className="space-y-3.5">
          <PostComposer
            event={event}
            tone={tone}
            setTone={setTone}
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
                        onClick={() => setDraft(saved.content)}
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
