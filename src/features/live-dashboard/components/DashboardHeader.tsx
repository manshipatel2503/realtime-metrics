import { StatusDot } from '../../../shared/ui/StatusDot';
import { cn } from '../../../shared/utils/cn';
import type { ConnectionStatus } from '../../../types';

interface DashboardHeaderProps {
  status: ConnectionStatus;
  dataCount: number;
  onStart: () => void;
  onStop: () => void;
}

export function DashboardHeader({ status, dataCount, onStart, onStop }: DashboardHeaderProps) {
  const isRunning = status === 'connected' || status === 'connecting';

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border-subtle pb-4 mb-2">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-500 shadow-[var(--shadow-sm)]">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-text-inverse fill-none stroke-current"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>

        <div>
          <h1 className="text-base font-semibold text-text-primary leading-tight">
            System Monitor
          </h1>
          <p className="text-xs text-text-muted leading-tight">
            Real-time metrics dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {dataCount > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-text-muted">
            <span className="font-mono tabular-nums text-text-secondary">{dataCount}</span>
            points
          </span>
        )}

        {isRunning && <StatusDot />}
        {status === 'stopped' && (
          <span className="text-xs text-text-muted font-medium">Paused</span>
        )}
        {status === 'error' && (
          <span className="text-xs text-danger font-medium">Disconnected</span>
        )}

        <button
          onClick={isRunning ? onStop : onStart}
          aria-label={isRunning ? 'Stop data stream' : 'Start data stream'}
          className={cn(
            'rounded-[var(--radius-md)] px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-80',
            isRunning
              ? 'bg-bg-elevated border border-border-default text-text-secondary'
              : 'bg-accent-500 text-text-inverse'
          )}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>
    </header>
  );
}
