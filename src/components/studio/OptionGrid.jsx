import { Plus, Check } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

export default function OptionGrid({ options, selectedId, onSelect, onUpload, uploadLabel }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((option) => {
        const active = selectedId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              'group relative overflow-hidden rounded-[1.1rem] border bg-card text-left transition-all',
              active
                ? 'border-accent ring-1 ring-accent/45'
                : 'border-border hover:border-foreground/25'
            )}
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-secondary">
              <Image
                src={option.image}
                alt={option.name}
                fittingType="fill"
                className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            {active && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
            <div className="px-2.5 py-2">
              <p className="truncate text-[11.5px] font-medium leading-tight">{option.name}</p>
              <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">{option.detail}</p>
            </div>
          </button>
        );
      })}

      {onUpload && (
        <label className="flex min-h-[148px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[1.1rem] border border-dashed border-border px-4 text-center text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent">
          <Plus className="h-4 w-4" strokeWidth={2} />
          <span className="text-[11px] font-medium leading-tight">{uploadLabel}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onUpload(event.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}