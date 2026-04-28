import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  title?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, badge, children, className }: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-[var(--radius-lg)]',
        'bg-bg-surface border border-border-subtle',
        'p-4 md:p-5 h-full',
        'shadow-[var(--shadow-md)]',
        className
      )}
    >
      {(title || badge) && (
        <div className="flex items-center justify-between">
          {title && (
            <h2 className="text-sm font-semibold text-text-primary tracking-wide">
              {title}
            </h2>
          )}
          {badge && <div>{badge}</div>}
        </div>
      )}

      <div className="flex-1">{children}</div>
    </div>
  );
}
