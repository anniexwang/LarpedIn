import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const BADGE = {
  High: 'bg-accent/12 text-accent border-accent/25',
  Medium: 'bg-secondary text-muted-foreground border-transparent',
  Low: 'bg-transparent text-muted-foreground border-border',
};

export default function EventRow({ event }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5">
      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-[11px] bg-secondary">
        <span className="text-[13.5px] font-semibold leading-none">
          {format(parseISO(event.date), 'd')}
        </span>
        <span className="mt-0.5 text-[8px] uppercase leading-none tracking-wider text-muted-foreground">
          {format(parseISO(event.date), 'MMM')}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium">{event.title}</p>
        <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">
          {event.type} · {event.time} · {event.location}
        </p>
      </div>

      <span
        className={cn(
          'hidden shrink-0 rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider sm:inline-flex',
          BADGE[event.relevance] || BADGE.Low
        )}
      >
        {event.relevance}
      </span>

      <Link
        to="/content"
        className="shrink-0 rounded-full border border-border px-2.5 py-1.5 text-[10.5px] font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
      >
        Draft post
      </Link>
    </div>
  );
}