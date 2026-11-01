import { cn } from '@/lib/utils';

export default function Brand({ tone = 'light', className }) {
  const onInk = tone === 'ink';
  return (
    <span className={cn('flex items-baseline gap-1.5', className)}>
      <span
        className={cn(
          'font-display text-[19px] font-semibold tracking-[-0.03em]',
          onInk ? 'text-sidebar-foreground' : 'text-foreground'
        )}
      >
        Larped
      </span>
      <span
        className={cn(
          'rounded-[5px] px-1.5 py-[3px] font-display text-[12px] font-semibold leading-none',
          onInk
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        In
      </span>
    </span>
  );
}