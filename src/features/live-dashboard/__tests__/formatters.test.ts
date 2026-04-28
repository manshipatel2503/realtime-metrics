import { describe, it, expect } from 'vitest';
import { formatMetricName, formatTime, formatValue } from '../utils/formatters';

describe('formatMetricName', () => {
  it('converts snake_case to Title Case', () => {
    expect(formatMetricName('cpu_usage')).toBe('Cpu Usage');
  });

  it('handles single word', () => {
    expect(formatMetricName('latency')).toBe('Latency');
  });

  it('handles three word metric', () => {
    expect(formatMetricName('request_rate')).toBe('Request Rate');
  });

  it('handles error_rate', () => {
    expect(formatMetricName('error_rate')).toBe('Error Rate');
  });
});

describe('formatValue', () => {
  it('formats integer to 2 decimal places', () => {
    expect(formatValue(73)).toBe('73.00');
  });

  it('formats float to 2 decimal places', () => {
    expect(formatValue(73.5)).toBe('73.50');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatValue(73.456)).toBe('73.46');
  });

  it('handles zero', () => {
    expect(formatValue(0)).toBe('0.00');
  });
});

describe('formatTime', () => {
  it('returns a non-empty time string from ISO timestamp', () => {
    const result = formatTime('2025-11-06T12:30:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('returns different strings for different timestamps', () => {
    const t1 = formatTime('2025-11-06T12:30:00Z');
    const t2 = formatTime('2025-11-06T12:30:01Z');
    expect(t1).not.toBe(t2);
  });
});
