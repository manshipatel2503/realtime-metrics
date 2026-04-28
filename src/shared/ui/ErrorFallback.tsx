interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="
        min-h-[200px] flex flex-col items-center justify-center gap-4
        rounded-[var(--radius-lg)] border border-danger-muted
        bg-danger-subtle p-8 text-center
      "
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger text-text-inverse text-xl font-bold">
        !
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-danger-strong">
          Something went wrong
        </h2>
        <p className="text-sm text-text-secondary max-w-sm">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>

      {import.meta.env.DEV && error.stack && (
        <pre className="
          w-full max-w-md overflow-auto rounded-[var(--radius-md)]
          bg-bg-elevated border border-border-subtle
          px-4 py-3 text-left text-xs text-text-muted font-mono
        ">
          {error.stack}
        </pre>
      )}

      <button
        onClick={onReset}
        className="
          mt-2 rounded-[var(--radius-md)] bg-danger px-5 py-2
          text-sm font-medium text-text-inverse
          transition-opacity duration-[var(--transition-fast)]
          hover:opacity-80 focus:outline-none focus:ring-2
          focus:ring-danger focus:ring-offset-2
        "
      >
        Try again
      </button>
    </div>
  );
}
