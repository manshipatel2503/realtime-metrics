import { useMemo } from 'react';
import type { DataPoint } from '../../../types';

const EVENTS_LIMIT = 20;

export interface MetricsData {
  cpuData: DataPoint[];
  memoryData: DataPoint[];
  latencyData: DataPoint[];
  requestData: DataPoint[];
  errorData: DataPoint[];
  recentEvents: DataPoint[];
}

export function useMetrics(data: DataPoint[]): MetricsData {
  const cpuData = useMemo(
    () => data.filter(d => d.metric === 'cpu_usage'),
    [data]
  );

  const memoryData = useMemo(
    () => data.filter(d => d.metric === 'memory_usage'),
    [data]
  );

  const latencyData = useMemo(
    () => data.filter(d => d.metric === 'latency'),
    [data]
  );

  const requestData = useMemo(
    () => data.filter(d => d.metric === 'request_rate'),
    [data]
  );

  const errorData = useMemo(
    () => data.filter(d => d.metric === 'error_rate'),
    [data]
  );

  const recentEvents = useMemo(
    () => [...data].reverse().slice(0, EVENTS_LIMIT),
    [data]
  );

  return { cpuData, memoryData, latencyData, requestData, errorData, recentEvents };
}
