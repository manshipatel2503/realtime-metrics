import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { Card } from '../../../shared/ui/Card';
import { StatusDot } from '../../../shared/ui/StatusDot';
import { formatTime, formatValue } from '../utils/formatters';
import type { DataPoint } from '../../../types';

interface Props {
  data: DataPoint[];
}

const WARN_THRESHOLD  = 150;
const ALERT_THRESHOLD = 250;

function getLatestValue(data: DataPoint[]): string {
  const last = data[data.length - 1];
  return last ? `${formatValue(last.value)} ms` : '—';
}

export function LatencyChart({ data }: Props) {
  const chartData = useMemo(
    () => data.map(d => ({ time: formatTime(d.timestamp), latency: d.value })),
    [data]
  );

  const latest = data[data.length - 1]?.value ?? 0;
  const valueColor =
    latest >= ALERT_THRESHOLD ? 'var(--danger)'
    : latest >= WARN_THRESHOLD ? 'var(--warning)'
    : 'var(--success)';

  return (
    <Card
      title="Latency"
      badge={
        <span
          className="text-sm font-semibold font-mono tabular-nums"
          style={{ color: valueColor }}
          aria-label={`Current latency: ${getLatestValue(data)}`}
        >
          {getLatestValue(data)}
        </span>
      }
      className="h-full"
    >
      <div role="img" aria-label="Line chart showing latency over time in milliseconds">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={v => `${v}ms`}
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              width={54}
            />

            <ReferenceLine
              y={WARN_THRESHOLD}
              stroke="var(--warning)"
              strokeDasharray="4 3"
              label={{ value: 'Warn', fill: 'var(--warning)', fontSize: 10, position: 'insideTopRight' }}
            />
            <ReferenceLine
              y={ALERT_THRESHOLD}
              stroke="var(--danger)"
              strokeDasharray="4 3"
              label={{ value: 'Alert', fill: 'var(--danger)', fontSize: 10, position: 'insideTopRight' }}
            />

            <Tooltip
              contentStyle={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }}
              formatter={(value) => [`${formatValue(Number(value))} ms`, 'Latency']}
            />

            <Line
              type="monotone"
              dataKey="latency"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--chart-2)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <StatusDot />
    </Card>
  );
}
