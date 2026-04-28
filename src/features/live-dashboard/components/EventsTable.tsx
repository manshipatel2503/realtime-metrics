import { useState, useMemo } from 'react';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { StatusDot } from '../../../shared/ui/StatusDot';
import { formatTime, formatMetricName, formatValue } from '../utils/formatters';
import { METRICS, METRIC_UNITS } from '../constants';
import type { DataPoint, MetricName } from '../../../types';
import type { BadgeVariant } from '../../../shared/ui/Badge';

interface Props {
  data: DataPoint[];
}

function getStatus(metric: string, value: number): { variant: BadgeVariant; label: string } {
  switch (metric as MetricName) {
    case 'cpu_usage':
    case 'memory_usage':
      if (value >= 85) return { variant: 'danger',  label: 'Critical' };
      if (value >= 65) return { variant: 'warning', label: 'Warning'  };
      return             { variant: 'success', label: 'Normal'   };

    case 'latency':
      if (value >= 250) return { variant: 'danger',  label: 'Alert'  };
      if (value >= 150) return { variant: 'warning', label: 'Slow'   };
      return              { variant: 'success', label: 'Fast'   };

    case 'error_rate':
      if (value >= 10) return { variant: 'danger',  label: 'High'   };
      if (value >= 5)  return { variant: 'warning', label: 'Medium' };
      return             { variant: 'success', label: 'Low'    };

    case 'request_rate':
      if (value >= 400) return { variant: 'info',    label: 'High'   };
      if (value >= 200) return { variant: 'success', label: 'Normal' };
      return              { variant: 'neutral', label: 'Low'    };

    default:
      return { variant: 'neutral', label: 'Unknown' };
  }
}

function formatValueWithUnit(metric: string, value: number): string {
  const unit = METRIC_UNITS[metric as MetricName] ?? '';
  return unit === '%'
    ? `${formatValue(value)}%`
    : `${formatValue(value)} ${unit}`;
}

type FilterValue = 'all' | MetricName;

export function EventsTable({ data }: Props) {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = useMemo(
    () => filter === 'all' ? data : data.filter(d => d.metric === filter),
    [data, filter]
  );

  return (
    <Card
      title="Latest Events"
      badge={<StatusDot />}
      className="h-full sticky top-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <label htmlFor="metric-filter" className="text-xs text-text-muted shrink-0">
          Filter
        </label>
        <select
          id="metric-filter"
          value={filter}
          onChange={e => setFilter(e.target.value as FilterValue)}
          className="
            flex-1 rounded-[var(--radius-md)] border border-border-default
            bg-bg-elevated px-2 py-1 text-xs text-text-primary
            focus:outline-none focus:ring-2 focus:ring-accent-500
          "
        >
          <option value="all">All metrics</option>
          {METRICS.map(m => (
            <option key={m} value={m}>{formatMetricName(m)}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm" aria-label="Latest metric events">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="pb-2 text-left text-xs font-medium text-text-muted">Time</th>
              <th className="pb-2 text-left text-xs font-medium text-text-muted">Metric</th>
              <th className="pb-2 text-right text-xs font-medium text-text-muted">Value</th>
              <th className="pb-2 text-right text-xs font-medium text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-text-muted">
                  Waiting for data…
                </td>
              </tr>
            ) : (
              filtered.map(point => {
                const { variant, label } = getStatus(point.metric, point.value);
                return (
                  <tr
                    key={point.id}
                    className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated transition-colors"
                  >
                    <td className="py-2 text-xs text-text-muted font-mono tabular-nums">
                      {formatTime(point.timestamp)}
                    </td>
                    <td className="py-2 text-xs text-text-primary">
                      {formatMetricName(point.metric)}
                    </td>
                    <td className="py-2 text-right text-xs font-mono tabular-nums text-text-primary">
                      {formatValueWithUnit(point.metric, point.value)}
                    </td>
                    <td className="py-2 text-right">
                      <Badge variant={variant} label={label} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
