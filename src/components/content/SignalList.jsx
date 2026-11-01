import { cn } from '@/lib/utils';
import { formatEventDate } from '@/lib/mockData';

export default function SignalList({ events, selectedId, onSelect }) {
  return (
    <div className="px-2 pb-2">
      {events.map((event) => {
        const active = selectedId === event.id;
        return (
          <button
            key={event.id}
            type="button"
            onClick={() => onSelect(event.id)}
            className={cn(
              'mb-0.5 flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition-colors',
              active ? 'bg-secondary' : 'hover:bg-secondary/50'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                active ? 'bg-accent' : 'bg-border'
              )}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium">{event.title}</span>
              <span className="mt-0.5 block text-[10px] text-muted-foreground">
                {event.type} · {formatEventDate(event.date)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}