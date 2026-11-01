import React from 'react';
import { RefreshCw, CalendarDays } from 'lucide-react';
import EventRow from '@/components/calendar/EventRow';
import { Switch } from '@/components/ui/switch';
import { getCalendarEvents } from '@/lib/calendarData';

const PREFERENCES = [
  { id: 'suggest', label: 'Suggest posts from my events', hint: 'A draft appears within an hour of each event.' },
  { id: 'remind', label: 'Remind me two days before', hint: 'Enough time to write something honest.' },
  { id: 'linkedin', label: 'LinkedIn reminders', hint: 'Best posting windows for your network.' },
];

export default function ConnectedPanel({ account, prefs, onToggle, onRefresh, onDisconnect, events }) {
  const displayEvents = events ?? getCalendarEvents();

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
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10.5px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" /> Sync
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          className="rounded-full px-2.5 py-1.5 text-[10.5px] text-muted-foreground transition-colors hover:text-destructive cursor-pointer"
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

      <section className="rounded-[1.5rem] border border-border bg-card px-5 py-2">
        <div className="flex items-center justify-between pt-3 pb-2">
          <h2 className="text-[12.5px] font-semibold">Live Google Calendar Schedule</h2>
          <p className="text-[10.5px] text-muted-foreground">
            {displayEvents.length} {displayEvents.length === 1 ? 'event' : 'events'} read
          </p>
        </div>

        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs font-medium text-foreground">No upcoming events on this Google Calendar.</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Add a new meeting or event in Google Calendar, then click Sync above.
            </p>
          </div>
        ) : (
          <div>
            {displayEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
