import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SignalList from '@/components/content/SignalList';
import PostComposer from '@/components/content/PostComposer';
import QueueList from '@/components/content/QueueList';
import { useToast } from '@/components/ui/use-toast';
import { EVENTS, QUEUED, composeDraft, formatEventDate } from '@/lib/mockData';

export default function Content() {
  const [selectedId, setSelectedId] = useState(EVENTS[0].id);
  const [tone, setTone] = useState('insightful');
  const [platform, setPlatform] = useState('LinkedIn');
  const [variant, setVariant] = useState(0);
  const [queue, setQueue] = useState(QUEUED);
  const { toast } = useToast();

  const event = EVENTS.find((item) => item.id === selectedId) || EVENTS[0];
  const [draft, setDraft] = useState(() => composeDraft(event, 'insightful', 0, 'LinkedIn'));

  useEffect(() => {
    setDraft(composeDraft(event, tone, variant, platform));
  }, [event, tone, variant, platform]);

  const regenerate = () => setVariant((value) => value + 1);

  const addToQueue = () => {
    const title = draft.split('\n')[0].slice(0, 64);
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
    toast({ title: 'Added to your queue', description: `${platform} · ${formatEventDate(event.date)}` });
  };

  const removeFromQueue = (id) => setQueue((posts) => posts.filter((post) => post.id !== id));

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Say the thing."
        description={"Pick a signal from your calendar, choose a tone, and shape a post that sounds like you wrote it — because you did."}
      />

      <div className="grid gap-3.5 pt-6 lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="rounded-[1.5rem] border border-border bg-card py-3 lg:sticky lg:top-[72px] lg:self-start">
          <p className="px-4 pb-2 text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            Signals
          </p>
          <SignalList events={EVENTS} selectedId={selectedId} onSelect={setSelectedId} />
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
          />

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="flex items-center justify-between px-5 pb-1 pt-4 sm:px-6">
              <h2 className="text-[12.5px] font-semibold">Publishing queue</h2>
              <p className="text-[10.5px] text-muted-foreground">{queue.length} scheduled</p>
            </div>
            <QueueList posts={queue} onRemove={removeFromQueue} />
          </section>
        </div>
      </div>
    </div>
  );
}
