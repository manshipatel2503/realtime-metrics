import type { ConnectionStatus } from '../../../types';
import type { StreamError } from '../../../services/stream';
import { MAX_RETRIES } from '../hooks/useSSE';

interface ConnectionBannerProps {
  status: ConnectionStatus;
  error: StreamError | null;
  retryCount: number;
  onRetry: () => void;
}

export function ConnectionBanner({ status, error, retryCount, onRetry }: ConnectionBannerProps) {
  if (status === 'connected') return null;

  if (status === 'stopped') {
    return (
      <div role="status" className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-bg-elevated border border-border-default px-4 py-3 text-sm text-text-secondary mb-4">
        <span>⏸ Stream paused.</span>
        <button
          onClick={onRetry}
          className="text-accent-500 font-medium hover:underline"
        >
          Resume
        </button>
      </div>
    );
  }

  if (status === 'connecting' && retryCount > 0) {
    return (
      <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-[var(--radius-md)] bg-warning-subtle border border-warning-muted px-4 py-3 text-sm text-text-primary mb-4">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-warning border-t-transparent" />
        <span>
          Connection lost. Reconnecting…
          <span className="ml-1 text-text-muted">
            (attempt {retryCount}/{MAX_RETRIES})
          </span>
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div role="alert" className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-danger-subtle border border-danger-muted px-4 py-3 text-sm text-text-primary mb-4">
        <span>
          <span className="font-medium text-danger-strong">Connection failed. </span>
          {error?.message ?? 'Could not reach the data stream.'}
        </span>
        <button
          onClick={onRetry}
          className="shrink-0 rounded-[var(--radius-md)] bg-danger px-3 py-1 text-xs font-medium text-text-inverse hover:opacity-80 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
