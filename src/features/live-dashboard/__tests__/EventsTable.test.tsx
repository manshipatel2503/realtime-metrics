import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventsTable } from '../components/EventsTable';
import type { DataPoint } from '../../../types';

function makePoint(id: number, metric: string, value: number): DataPoint {
  return { id, timestamp: '2025-11-06T12:30:00Z', metric, unit: '%', value };
}

const mockData: DataPoint[] = [
  makePoint(1, 'cpu_usage',    90),  // Critical
  makePoint(2, 'cpu_usage',    70),  // Warning
  makePoint(3, 'memory_usage', 40),  // Normal
  makePoint(4, 'latency',      280), // Alert
  makePoint(5, 'error_rate',   2),   // Low
];

describe('EventsTable', () => {
  it('shows empty state when no data', () => {
    render(<EventsTable data={[]} />);
    expect(screen.getByText('Waiting for data…')).toBeInTheDocument();
  });

  it('renders a row for each data point', () => {
    render(<EventsTable data={mockData} />);
    const rows = screen.getAllByRole('row');
    // +1 for the header row
    expect(rows).toHaveLength(mockData.length + 1);
  });

  it('displays human-readable metric names', () => {
    render(<EventsTable data={mockData} />);
    // getAllByText because "Cpu Usage" appears in both dropdown and table cells
    expect(screen.getAllByText('Cpu Usage').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Latency').length).toBeGreaterThan(0);
  });

  it('formats cpu value with % unit', () => {
    render(<EventsTable data={[makePoint(1, 'cpu_usage', 73.5)]} />);
    expect(screen.getByText('73.50%')).toBeInTheDocument();
  });

  it('formats latency value with ms unit', () => {
    render(<EventsTable data={[makePoint(1, 'latency', 187.3)]} />);
    expect(screen.getByText('187.30 ms')).toBeInTheDocument();
  });

  it('shows Critical badge for cpu >= 85', () => {
    render(<EventsTable data={[makePoint(1, 'cpu_usage', 90)]} />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('shows Warning badge for cpu between 65-85', () => {
    render(<EventsTable data={[makePoint(1, 'cpu_usage', 70)]} />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('shows Alert badge for latency >= 250ms', () => {
    render(<EventsTable data={[makePoint(1, 'latency', 280)]} />);
    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('shows Normal badge for cpu < 65', () => {
    render(<EventsTable data={[makePoint(1, 'cpu_usage', 40)]} />);
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('filters rows when metric is selected from dropdown', async () => {
    const user = userEvent.setup();
    render(<EventsTable data={mockData} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'latency');

    // Only latency row should remain (header + 1 data row)
    expect(screen.getAllByRole('row')).toHaveLength(2);
    // "Latency" still appears in the dropdown option — check table cell specifically
    const cells = screen.getAllByRole('cell');
    const metricCells = cells.filter(c => c.textContent === 'Latency');
    expect(metricCells.length).toBe(1);
    // Cpu Usage should not appear as a table cell
    const cpuCells = cells.filter(c => c.textContent === 'Cpu Usage');
    expect(cpuCells.length).toBe(0);
  });

  it('shows all rows when "All metrics" is selected', async () => {
    const user = userEvent.setup();
    render(<EventsTable data={mockData} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'cpu_usage');
    await user.selectOptions(select, 'all');

    expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1);
  });
});
