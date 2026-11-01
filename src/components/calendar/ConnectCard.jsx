import { CalendarDays, Lock } from 'lucide-react';
import { formatEventDate } from '@/lib/mockData';

const PROMISES = [
  'Read-only calendar access',
  'You approve every post',
  'Revoke whenever you like',
  'No event is shared publicly',
];

export default function ConnectCard({ onConnect, preview }) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-border bg-card">
      <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
        <div className="p-7 sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
            <CalendarDays className="h-3 w-3" /> Google Calendar
          </span>
          <h2 className="display mt-5 text-[30px] leading-[1.0] sm:text-[36px]">
            Let the calendar
            <br />
            do the noticing.
          </h2>
          <p className="mt-3 max-w-[40ch] text-[13px] leading-relaxed text-muted-foreground">
            LarpedIn reads the events you choose — keynotes, panels, launches — and suggests a post
            while the moment is still fresh.
          </p>

          <button
            type="button"
            onClick={onConnect}
            className="mt-6 inline-flex h-11 items-center gap-2.5 rounded-full bg-primary px-5 text-[12.5px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary">
              G
            </span>
            Connect Google Calendar
          </button>
          <p className="mt-2.5 text-[10.5px] text-muted-foreground">Demo UI — no account is contacted.</p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {PROMISES.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[10.5px] text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-ink p-6 text-ink-foreground sm:p-7 lg:border-l lg:border-ink-foreground/10">
          <p className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.24em] text-ink-foreground/45">
            <Lock className="h-3 w-3" /> Unlocks after connecting
          </p>
          <ul className="mt-4 space-y-2.5">
            {preview.map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-ink-foreground/12 bg-ink-foreground/[0.06] px-3.5 py-3"
              >
                <p className="truncate text-[12px] font-medium text-ink-foreground/85">
                  {event.title}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-foreground/45">
                  {event.type} · {formatEventDate(event.date)} · {event.time}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}