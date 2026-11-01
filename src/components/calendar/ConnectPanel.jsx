import { RefreshCw } from 'lucide-react';
import EventRow from '@/components/calendar/EventRow';
import { Switch } from '@/components/ui/switch';
import { EVENTS } from '@/lib/mockData';

const PREFERENCES = [
  { id: 'suggest', label: 'Suggest posts from my events', hint: 'A draft appears within an hour of each event.' },
  { id: 'remind', label: 'Remind me two days before', hint: 'Enough time to write something honest.' },
  { id: 'linkedin', label: 'LinkedIn reminders', hint: 'Best posting windows for your network.' },
];

export default function ConnectedPanel({ account, prefs, onToggle, onRefresh, onDisconnect }) {
  return (
    <div className="space-y-3.5">
      <section className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-border bg-card px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/12 text-[12px] font-bold text-accent">
          G
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold">
            Google Calendar
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/12 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Connected
            </span>
          </p>
          <p className="truncate text-[10.5px] text-muted-foreground">{account} · read-only</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" /> Sync
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          className="rounded-full px-2.5 py-1.5 text-[10.5px] text-muted-foreground transition-colors hover:text-destructive"
        >
          Disconnect
        </button>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-card px-5">
        {PREFERENCES.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 border-b border-border py-3.5 last:border-b-0"
          >
            <div>
              <p className="text-[12.5px] font-medium">{item.label}</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">{item.hint}</p>
            </div>
            <Switch checked={prefs[item.id]} onCheckedChange={() => onToggle(item.id)} />
          </div>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-border bg-card px-5">
        <div className="flex items-center justify-between pt-4">
          <h2 className="text-[12.5px] font-semibold">Next two weeks</h2>
          <p className="text-[10.5px] text-muted-foreground">{EVENTS.length} events read</p>
        </div>
        <div className="divide-y divide-border">
          {EVENTS.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}