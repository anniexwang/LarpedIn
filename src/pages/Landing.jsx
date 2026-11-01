import { Link } from 'react-router-dom';
import { ArrowRight, Camera, LogOut } from 'lucide-react';
import Brand from '@/components/common/Brand';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useAuth } from '@/lib/AuthContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const accountName = user?.full_name || user?.email || 'Your account';
  const initials = accountName.trim().slice(0, 1).toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,hsl(var(--accent)/0.18),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/30 blur-3xl"
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Brand tone="light" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-1 transition-colors hover:border-foreground/30 sm:pr-3"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold">
                    {initials}
                  </span>
                  <span className="hidden max-w-[130px] truncate text-[11px] font-medium sm:block">
                    {accountName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <span className="block truncate text-[12px] font-medium">{accountName}</span>
                  <span className="mt-0.5 block truncate text-[11px] font-normal text-muted-foreground">
                    {user?.email || ''}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[12px]" onSelect={() => logout()}>
                  <LogOut className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login?returnTo=/overview"
              className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-16 pt-16 text-center sm:px-8 sm:pt-24 lg:pt-28">
        <div className="relative">
          {/* <div
            aria-hidden
            className="absolute -left-20 top-2 hidden -rotate-6 rounded-2xl border border-border bg-card/80 px-3 py-2 text-left shadow-lg shadow-primary/5 backdrop-blur sm:block"
          >
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Today</p>
            <p className="mt-1 text-[11px] font-medium">Look sharp. Ship boldly.</p>
          </div> */}
          {/* <div
            aria-hidden
            className="absolute -right-20 bottom-1 hidden rotate-6 rounded-2xl border border-border bg-card/80 px-3 py-2 text-left shadow-lg shadow-primary/5 backdrop-blur sm:block"
          >
            <p className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" /> Signal found
            </p>
            <p className="mt-1 text-[11px] font-medium">Worth a post</p>
          </div> */}

          <p className="eyebrow">Portrait studio · content signals</p>
          <h1 className="display mx-auto mt-5 max-w-3xl text-[42px] leading-[0.96] sm:text-[58px] lg:text-[72px]">
            A portrait that looks like your best day.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            LarpedIn composes a studio-grade headshot in seconds — pick the suit, pick the
            backdrop — then reads your calendar and turns what you are already doing into posts
            worth publishing.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Camera className="h-4 w-4" strokeWidth={1.75} /> Photo
            </Link>
            <Link
              to="/register?returnTo=/overview"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[13px] font-medium transition-colors hover:border-foreground/30"
            >
              Sign up <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}