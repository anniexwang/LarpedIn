import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { SAMPLE_PORTRAIT } from '@/lib/mockData';

const CHIPS = ['Midnight Navy', 'Studio Grey', '4:5'];

export default function PortraitHero() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-ink text-ink-foreground">
      <div className="grid sm:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-between p-7 sm:p-9">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink-foreground/45">
              Latest portrait
            </p>
            <h2 className="display mt-4 text-[30px] leading-[1.0] sm:text-[34px]">
              Midnight Navy,
              <br />
              on Studio Grey.
            </h2>
            <p className="mt-3 max-w-[32ch] text-[13px] leading-relaxed text-ink-foreground/60">
              Rendered twelve minutes ago — ready for your profile, your deck and the press kit.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-1.5">
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-ink-foreground/20 px-2.5 py-1 text-[10px] text-ink-foreground/65"
                >
                  {chip}
                </span>
              ))}
            </div>
            <Link
              to="/studio"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink-foreground px-4 py-2 text-[11px] font-semibold text-ink transition-opacity hover:opacity-90"
            >
              Open the studio
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[270px] overflow-hidden sm:min-h-full">
          <Image
            src={SAMPLE_PORTRAIT}
            alt="Sample professional portrait"
            fittingType="fill"
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}