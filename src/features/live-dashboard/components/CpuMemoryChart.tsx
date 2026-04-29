import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card } from '../../../shared/ui/Card';
import { StatusDot } from '../../../shared/ui/StatusDot';
import { formatTime, formatValue } from '../utils/formatters';
import { CHART_TOOLTIP_STYLE, CHART_TOOLTIP_LABEL_STYLE } from '../constants';
import type { DataPoint } from '../../../types';

interface Props {
  cpuData: DataPoint[];
  memoryData: DataPoint[];
}

function mergeSeriesData(cpu: DataPoint[], memory: DataPoint[]) {
  const len = Math.max(cpu.length, memory.length);
  return Array.from({ length: len }, (_, i) => ({
    time:   formatTime(cpu[i]?.timestamp ?? memory[i]?.timestamp ?? ''),
    cpu:    cpu[i]?.value    ?? null,
    memory: memory[i]?.value ?? null,
  }));
}

export function CpuMemoryChart({ cpuData, memoryData }: Props) {
  const chartData = useMemo(
    () => mergeSeriesData(cpuData, memoryData),
    [cpuData, memoryData]
  );

  return (
    <Card
      title="CPU & Memory Usage"
      badge={<StatusDot />}
      className="h-full"
    >
      <div role="img" aria-label="Area chart showing CPU and memory usage over time">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--accent-500)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-500)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--info)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--info)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              width={48}
            />

            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={CHART_TOOLTIP_LABEL_STYLE}
              formatter={(value, name) => [
                `${formatValue(Number(value))}%`,
                name === 'cpu' ? 'CPU' : 'Memory',
              ]}
            />

            <Legend
              formatter={name => name === 'cpu' ? 'CPU' : 'Memory'}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />

            <Area
              type="monotone"
              dataKey="cpu"
              stroke="var(--accent-500)"
              strokeWidth={2}
              fill="url(#gradCpu)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--accent-500)' }}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="memory"
              stroke="var(--info)"
              strokeWidth={2}
              fill="url(#gradMemory)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--info)' }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
