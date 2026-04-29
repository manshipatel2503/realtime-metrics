import { useSSE } from '../hooks/useSSE';
import { useMetrics } from '../hooks/useMetrics';
import { DashboardHeader } from './DashboardHeader';
import { ConnectionBanner } from './ConnectionBanner';
import { ChartSkeleton } from './ChartSkeleton';
import { TableSkeleton } from './TableSkeleton';
import { CpuMemoryChart } from './CpuMemoryChart';
import { LatencyChart } from './LatencyChart';
import { RequestErrorChart } from './RequestErrorChart';
import { EventsTable } from './EventsTable';

export function DashboardLayout() {
  const { data, status, error, retryCount, start, stop } = useSSE();
  const { cpuData, memoryData, latencyData, requestData, errorData, recentEvents } = useMetrics(data);

  const isLoading = status === 'connecting' && data.length === 0;

  return (
    <div className="min-h-screen w-full bg-bg-base p-4 md:p-6 flex flex-col gap-4">
      <DashboardHeader
        status={status}
        dataCount={data.length}
        onStart={start}
        onStop={stop}
      />

      <ConnectionBanner
        status={status}
        error={error}
        retryCount={retryCount}
        onRetry={start}
      />

      <main className="flex flex-col md:flex-row gap-4 flex-1" aria-label="Metrics dashboard">
        <div className="flex flex-col gap-4 flex-1" aria-busy={isLoading} aria-live="polite">
          {isLoading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <CpuMemoryChart cpuData={cpuData} memoryData={memoryData} />
              <LatencyChart data={latencyData} />
              <RequestErrorChart requestData={requestData} errorData={errorData} />
            </>
          )}
        </div>

        <div className="w-full md:w-80 lg:w-96 shrink-0" aria-busy={isLoading} aria-live="polite">
          {isLoading
            ? <TableSkeleton />
            : <EventsTable data={recentEvents} />
          }
        </div>
      </main>
    </div>
  );
}
