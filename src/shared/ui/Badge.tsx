import { cn } from '../utils/cn';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-success-subtle text-success-strong border-success-muted',
  warning: 'bg-warning-subtle text-warning-strong border-warning-muted',
  danger:  'bg-danger-subtle  text-danger-strong  border-danger-muted',
  info:    'bg-info-subtle    text-info-strong    border-info-muted',
  neutral: 'bg-bg-elevated    text-text-secondary border-border-default',
};

const VARIANT_DOT: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
  info:    'bg-info',
  neutral: 'bg-text-muted',
};

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5',
        'text-xs font-medium',
        VARIANT_STYLES[variant]
      )}
      aria-label={`Status: ${label}`}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', VARIANT_DOT[variant])} />
      {label}
    </span>
  );
}
