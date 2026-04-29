import type { MetricName } from '../../types';

export const SSE_URL = 'http://localhost:3001/stream';

export const MAX_HISTORY = 100;

export const METRICS: MetricName[] = [
  'cpu_usage',
  'memory_usage',
  'latency',
  'request_rate',
  'error_rate',
];

export const METRIC_UNITS: Record<MetricName, string> = {
  cpu_usage:    '%',
  memory_usage: '%',
  latency:      'ms',
  request_rate: 'req/s',
  error_rate:   '%',
};

export const CHART_TOOLTIP_STYLE = {
  background:   'var(--bg-surface)',
  border:       '1px solid var(--border-default)',
  borderRadius: 'var(--radius-md)',
  fontSize:     12,
} as const;

export const CHART_TOOLTIP_LABEL_STYLE = {
  color:        'var(--text-secondary)',
  marginBottom: 4,
} as const;
