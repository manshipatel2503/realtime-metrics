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
