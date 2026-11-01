import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Camera, CalendarDays, PenLine, ArrowUpRight } from 'lucide-react';
import Brand from '@/components/common/Brand';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Overview', path: '/overview', icon: LayoutGrid },
  { label: 'Studio', path: '/studio', icon: Camera },
  { label: 'Calendar', path: '/calendar', icon: CalendarDays },
  { label: 'Content', path: '/content', icon: PenLine },
];

export default function ShellSidebar() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname.startsWith(path);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-sidebar-border bg-sidebar px-5 py-7 lg:flex">
        <Link to="/overview" className="px-2">
          <Brand tone="ink" />
        </Link>
        <p className="mt-2 px-2 text-[9px] uppercase tracking-[0.32em] text-sidebar-foreground/40">
          Portrait studio
        </p>

        <nav className="mt-10 space-y-1">
          {NAV.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'group flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[13px] transition-colors',
                isActive(path)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/55 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
          <p className="text-[9px] uppercase tracking-[0.28em] text-sidebar-foreground/45">
            Next signal
          </p>
          <p className="mt-2.5 font-display text-[15px] font-medium leading-tight text-sidebar-foreground">
            Series B announcement
          </p>
          <p className="mt-1 text-[11px] text-sidebar-foreground/50">Tue 4 Nov · worth a post</p>
          <Link
            to="/content"
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-sidebar-primary"
          >
            Draft it <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
          </Link>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-sidebar-border bg-sidebar lg:hidden">
        <div className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
          {NAV.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive(path) ? 'text-sidebar-primary' : 'text-sidebar-foreground/45'
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}