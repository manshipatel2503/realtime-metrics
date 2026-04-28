export interface DataPoint {
  id: number;
  timestamp: string;
  metric: string;
  unit: string;
  value: number;
}

export type MetricName =
  | 'cpu_usage'
  | 'memory_usage'
  | 'latency'
  | 'request_rate'
  | 'error_rate';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'stopped';
