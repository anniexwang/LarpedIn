import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const BADGE = {
  High: 'bg-accent/12 text-accent border-accent/25',
  Medium: 'bg-secondary text-muted-foreground border-transparent',
  Low: 'bg-transparent text-muted-foreground border-border',
};

export default function EventRow({ event }) {
  const dateObj = (() => {
    try {
      const parsed = parseISO(event.date);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    } catch {
      return new Date();
    }
  })();

  const peopleCount = Array.isArray(event.people) ? event.people.length : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 py-4 border-b border-border last:border-b-0">
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[11px] bg-secondary">
          <span className="text-[13.5px] font-semibold leading-none">
            {format(dateObj, 'd')}
          </span>
          <span className="mt-0.5 text-[8.5px] uppercase leading-none tracking-wider text-muted-foreground">
            {format(dateObj, 'MMM')}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[13px] font-medium text-foreground">{event.title || 'Untitled Event'}</p>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider',
                BADGE[event.relevance] || BADGE.Medium
              )}
            >
              {event.relevance || 'Synced'}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{event.type || 'Meeting'}</span>
            <span>·</span>
            <span>{event.time || '09:00'}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 opacity-70" />
              {event.location || 'Online'}
            </span>
            {peopleCount > 0 && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3 opacity-70" />
                  {peopleCount} {peopleCount === 1 ? 'attendee' : 'attendees'}
                </span>
              </>
            )}
          </div>

          {event.description && (
            <p className="mt-1.5 text-[11px] text-muted-foreground/80 line-clamp-2 max-w-xl">
              {event.description}
            </p>
          )}

          {peopleCount > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {event.people.slice(0, 3).map((email, idx) => (
                <span
                  key={idx}
                  className="inline-block rounded-md border border-border/60 bg-secondary/50 px-1.5 py-0.5 text-[9.5px] text-muted-foreground truncate max-w-[180px]"
                >
                  {email}
                </span>
              ))}
              {peopleCount > 3 && (
                <span className="text-[9.5px] text-muted-foreground self-center">
                  +{peopleCount - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center self-end sm:self-center shrink-0">
        <Link
          to={`/content?eventId=${encodeURIComponent(event.id || '')}`}
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Draft post
        </Link>
      </div>
    </div>
  );
}
