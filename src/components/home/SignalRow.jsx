import { Link } from 'react-router-dom';
import { formatEventDate } from '@/lib/mockData';

const DOT = {
  High: 'bg-accent',
  Medium: 'bg-muted-foreground/50',
  Low: 'bg-border',
};

export default function SignalRow({ event }) {
  return (
    <div className="group flex items-center gap-3.5 py-3.5">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[event.relevance] || DOT.Low}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">{event.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {event.type} · {formatEventDate(event.date)} · {event.time}
        </p>
      </div>
      <Link
        to="/content"
        className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent"
      >
        Draft
      </Link>
    </div>
  );
}