import { CalendarClock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLATFORM_STYLE = {
  LinkedIn: 'bg-accent text-accent-foreground',
  X: 'bg-secondary text-secondary-foreground',
};

export default function QueueList({ posts, onRemove }) {
  if (!posts.length) {
    return (
      <p className="px-6 py-8 text-center text-[11px] text-muted-foreground">
        Nothing queued yet — draft a post and add it here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {posts.map((post) => (
        <li key={post.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold',
              PLATFORM_STYLE[post.platform] || PLATFORM_STYLE.X
            )}
          >
            {post.platform}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-medium">{post.title}</p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[10.5px] text-muted-foreground">
              <CalendarClock className="h-3 w-3" /> {post.when} · {post.source}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(post.id)}
            aria-label="Remove from queue"
            className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}