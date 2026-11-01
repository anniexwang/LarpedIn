import { RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TONES, PLATFORMS, formatEventDate } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function PostComposer({
  event,
  tone,
  setTone,
  platform,
  setPlatform,
  draft,
  setDraft,
  onRegenerate,
  onQueue,
}) {
  const words = draft.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">Draft from</p>
          <h2 className="display mt-2 truncate text-[21px] leading-tight">{event.title}</h2>
          <p className="mt-1 text-[10.5px] text-muted-foreground">
            {event.type} · {formatEventDate(event.date)} · {event.time}
          </p>
        </div>
        <div className="flex rounded-full bg-secondary p-1">
          {PLATFORMS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPlatform(item)}
              className={cn(
                'rounded-full px-3 py-1 text-[10.5px] font-medium transition-colors',
                platform === item
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 pt-4 sm:px-6">
        {TONES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTone(item.id)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[10.5px] font-medium transition-colors',
              tone === item.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="px-5 py-4 sm:px-6">
        <textarea
          value={draft}
          onChange={(textEvent) => setDraft(textEvent.target.value)}
          rows={13}
          className="w-full resize-none rounded-[1.1rem] border border-border bg-background px-4 py-3.5 text-[12.5px] leading-[1.75] text-foreground outline-none transition-colors focus:border-accent/60"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10.5px] text-muted-foreground">
            {words} words · {platform}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={onRegenerate}>
              <RefreshCw className="mr-1.5 h-3 w-3" /> Regenerate
            </Button>
            <Button size="sm" className="rounded-full px-4" onClick={onQueue}>
              <Send className="mr-1.5 h-3 w-3" /> Add to queue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}