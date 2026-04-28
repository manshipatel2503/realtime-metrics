import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMetrics } from '../hooks/useMetrics';
import type { DataPoint } from '../../../types';

function makePoint(id: number, metric: string, value = 50): DataPoint {
  return { id, timestamp: new Date().toISOString(), metric, unit: '%', value };
}

const mockData: DataPoint[] = [
  makePoint(1, 'cpu_usage',    60),
  makePoint(2, 'memory_usage', 45),
  makePoint(3, 'latency',      120),
  makePoint(4, 'request_rate', 300),
  makePoint(5, 'error_rate',   3),
  makePoint(6, 'cpu_usage',    70),
  makePoint(7, 'latency',      180),
];

describe('useMetrics', () => {
  it('filters cpuData correctly', () => {
    const { result } = renderHook(() => useMetrics(mockData));
    expect(result.current.cpuData).toHaveLength(2);
    expect(result.current.cpuData.every(d => d.metric === 'cpu_usage')).toBe(true);
  });

  it('filters memoryData correctly', () => {
    const { result } = renderHook(() => useMetrics(mockData));
    expect(result.current.memoryData).toHaveLength(1);
    expect(result.current.memoryData[0]?.metric).toBe('memory_usage');
  });

  it('filters latencyData correctly', () => {
    const { result } = renderHook(() => useMetrics(mockData));
    expect(result.current.latencyData).toHaveLength(2);
  });

  it('filters requestData correctly', () => {
    const { result } = renderHook(() => useMetrics(mockData));
    expect(result.current.requestData).toHaveLength(1);
  });

  it('filters errorData correctly', () => {
    const { result } = renderHook(() => useMetrics(mockData));
    expect(result.current.errorData).toHaveLength(1);
  });

  it('recentEvents returns newest first', () => {
    const { result } = renderHook(() => useMetrics(mockData));
    expect(result.current.recentEvents[0]?.id).toBe(7); // last inserted = first in list
  });

  it('recentEvents is capped at 20', () => {
    const bigData = Array.from({ length: 50 }, (_, i) =>
      makePoint(i, 'cpu_usage')
    );
    const { result } = renderHook(() => useMetrics(bigData));
    expect(result.current.recentEvents.length).toBeLessThanOrEqual(20);
  });

  it('returns empty arrays when data is empty', () => {
    const { result } = renderHook(() => useMetrics([]));
    expect(result.current.cpuData).toHaveLength(0);
    expect(result.current.latencyData).toHaveLength(0);
    expect(result.current.recentEvents).toHaveLength(0);
  });
});
