import { Link } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';
import Brand from '@/components/common/Brand';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Image } from '@/components/ui/image';
import { SAMPLE_PORTRAIT } from '@/lib/mockData';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_75%_at_12%_-10%,hsl(var(--accent)/0.16),transparent_62%)]"
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Brand tone="light" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login?returnTo=/overview"
            className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-12">
        <div>
          <p className="eyebrow">Portrait studio · content signals</p>
          <h1 className="display mt-5 text-[38px] leading-[0.98] sm:text-[52px] lg:text-[60px]">
            A portrait that looks like your best day.
          </h1>
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            LarpedIn composes a studio-grade headshot in seconds — pick the suit, pick the
            backdrop — then reads your calendar and turns what you are already doing into posts
            worth publishing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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

        <div className="overflow-hidden rounded-[26px] border border-border bg-card">
          <Image
            src={SAMPLE_PORTRAIT}
            alt="A composed studio portrait"
            originWidth={800}
            originHeight={1000}
            className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[480px]"
          />
          <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3.5">
            <p className="text-[11px] text-muted-foreground">Midnight Navy · Studio Grey</p>
            <p className="text-[11px] font-medium">4:5</p>
          </div>
        </div>
      </main>
    </div>
  );
}