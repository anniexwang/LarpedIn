import { Camera, Upload, Check, Loader2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { RATIOS } from '@/lib/mockData';
import { fileToDataUrl } from '@/lib/imageData';
import { cn } from '@/lib/utils';

const FRAME = {
  '4:5': 'aspect-[4/5]',
  '1:1': 'aspect-square',
  '16:9': 'aspect-[16/9]',
};

export default function StudioStage({ photo, onPhoto, outfit, backdrop, ratio, setRatio, result, loading }) {
  const readFile = async (inputEvent) => {
    const file = inputEvent.target.files?.[0];
    inputEvent.target.value = '';
    if (file) onPhoto(await fileToDataUrl(file));
  };

  return (
    <div className="space-y-3.5">
      <div className="rounded-[1.75rem] border border-border bg-card p-2.5">
        <div className={cn('relative w-full overflow-hidden rounded-[1.35rem] bg-secondary', FRAME[ratio])}>
          <Image
            src={backdrop.image}
            alt={backdrop.name}
            fittingType="fill"
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

          {result && (
            <img src={result} alt="Your generated headshot" className="absolute inset-0 z-10 h-full w-full object-cover" />
          )}

          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#010736]/60 text-white backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-[12px] font-medium">Suiting you up... (~20s)</span>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center p-[7%]">
            {photo ? (
              <div className="relative aspect-[3/4] h-[88%] max-w-full overflow-hidden rounded-[10px] shadow-[0_24px_60px_-18px_rgba(3,8,40,0.7)]">
                <Image src={photo} alt="Your portrait" fittingType="fill" className="h-full w-full" />
              </div>
            ) : (
              <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[10px] border border-dashed border-white/45 bg-[#010736]/35 text-center text-white backdrop-blur-[2px] transition-colors hover:bg-[#010736]/50">
                <Camera className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[13px] font-semibold">Add a photo to begin</span>
                <span className="max-w-[24ch] text-[11px] leading-relaxed text-white/70">
                  Take one now, or upload from your library
                </span>
                <input type="file" accept="image/*" capture="user" className="hidden" onChange={readFile} />
              </label>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-2">
            <span className="rounded-full bg-[#010736]/70 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.12em] text-white/90 backdrop-blur">
              {outfit.name}
            </span>
            <span className="rounded-full bg-[#010736]/70 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.12em] text-white/90 backdrop-blur">
              {backdrop.name} · {ratio}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {RATIOS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setRatio(option.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors',
              ratio === option.id
                ? 'border-transparent bg-secondary font-medium text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {ratio === option.id && <Check className="h-3 w-3 text-accent" strokeWidth={3} />}
            {option.label}
            <span className="text-muted-foreground/70">{option.id}</span>
          </button>
        ))}

        <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
          <Upload className="h-3 w-3" strokeWidth={2} /> {photo ? 'Replace photo' : 'Upload photo'}
          <input type="file" accept="image/*" className="hidden" onChange={readFile} />
        </label>
      </div>
    </div>
  );
}