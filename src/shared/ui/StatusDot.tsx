import { cn } from '../utils/cn';

interface StatusDotProps {
  label?: string;
  className?: string;
}

export function StatusDot({ label = 'LIVE', className }: StatusDotProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-success', className)}
      aria-label={`Status: ${label}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-dot opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-live-dot" />
      </span>
      {label}
    </span>
  );
}
