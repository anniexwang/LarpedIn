import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import PortraitHero from '@/components/home/PortraitHero';
import SignalRow from '@/components/home/SignalRow';
import { EVENTS, formatEventDate } from '@/lib/mockData';
import { useAuth } from '@/lib/AuthContext';

const STATS = [
  { label: 'Portraits rendered', value: '12', tone: 'ink' },
  { label: 'Posts in queue', value: '2', tone: 'plain' },
  { label: 'Signals this week', value: '4', tone: 'plain' },
];

export default function Home() {
  const { user } = useAuth();
  const firstName = (user?.full_name || '').trim().split(' ')[0];
  const signals = EVENTS.filter((event) => event.relevance !== 'Low').slice(0, 3);
  const upcoming = EVENTS.slice(0, 4);

  return (
    <div>
      <PageHeader
        eyebrow={format(new Date(), 'EEEE d MMMM')}
        title={firstName ? `Good to see you, ${firstName}.` : 'Good to see you.'}
        description="One portrait, one calendar, and a steady stream of things worth saying out loud."
      />

      <div className="grid gap-3.5 pt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortraitHero />
        </div>
        <div className="grid grid-cols-3 gap-3.5 lg:grid-cols-1">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={
                stat.tone === 'ink'
                  ? 'flex flex-col justify-between rounded-2xl bg-ink px-4 py-4 text-ink-foreground sm:px-5'
                  : 'flex flex-col justify-between rounded-2xl border border-border bg-card px-4 py-4 sm:px-5'
              }
            >
              <p className="display text-[30px] leading-none sm:text-[34px]">{stat.value}</p>
              <p
                className={
                  stat.tone === 'ink'
                    ? 'mt-2 text-[10px] leading-tight text-ink-foreground/60'
                    : 'mt-2 text-[10px] leading-tight text-muted-foreground'
                }
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3.5 grid gap-3.5 lg:grid-cols-3">
        <section className="rounded-[1.5rem] border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between px-5 pb-1 pt-5 sm:px-6">
            <h2 className="text-[13px] font-semibold">Signals worth a post</h2>
            <Link
              to="/content"
              className="text-[11px] text-muted-foreground transition-colors hover:text-accent"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border px-5 sm:px-6">
            {signals.map((event) => (
              <SignalRow key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-6">
          <h2 className="text-[13px] font-semibold">Next up</h2>
          <ul className="mt-4 space-y-3.5">
            {upcoming.map((event) => (
              <li key={event.id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-[10px] bg-secondary text-foreground">
                  <span className="text-[13px] font-semibold leading-none">
                    {format(parseISO(event.date), 'd')}
                  </span>
                  <span className="mt-0.5 text-[8px] uppercase leading-none tracking-wider text-muted-foreground">
                    {format(parseISO(event.date), 'MMM')}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium">{event.title}</span>
                  <span className="block text-[10.5px] text-muted-foreground">
                    {formatEventDate(event.date)} · {event.time}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/calendar"
            className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-medium text-accent"
          >
            Open calendar <ArrowRight className="h-3 w-3" strokeWidth={2} />
          </Link>
        </section>
      </div>
    </div>
  );
}