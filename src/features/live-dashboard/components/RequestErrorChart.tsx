import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card } from '../../../shared/ui/Card';
import { StatusDot } from '../../../shared/ui/StatusDot';
import { formatTime, formatValue } from '../utils/formatters';
import { CHART_TOOLTIP_STYLE, CHART_TOOLTIP_LABEL_STYLE } from '../constants';
import type { DataPoint } from '../../../types';

interface Props {
  requestData: DataPoint[];
  errorData: DataPoint[];
}

function mergeSeriesData(requests: DataPoint[], errors: DataPoint[]) {
  const len = Math.max(requests.length, errors.length);
  return Array.from({ length: len }, (_, i) => ({
    time:         formatTime(requests[i]?.timestamp ?? errors[i]?.timestamp ?? ''),
    request_rate: requests[i]?.value ?? null,
    error_rate:   errors[i]?.value   ?? null,
  }));
}

export function RequestErrorChart({ requestData, errorData }: Props) {
  const chartData = useMemo(
    () => mergeSeriesData(requestData, errorData),
    [requestData, errorData]
  );

  return (
    <Card
      title="Request & Error Rate"
      badge={<StatusDot />}
      className="h-full"
    >
      <div role="img" aria-label="Bar chart showing request rate and error rate over time">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              width={48}
            />

            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={CHART_TOOLTIP_LABEL_STYLE}
              formatter={(value, name) => [
                name === 'request_rate'
                  ? `${formatValue(Number(value))} req/s`
                  : `${formatValue(Number(value))}%`,
                name === 'request_rate' ? 'Requests' : 'Errors',
              ]}
            />

            <Legend
              formatter={name => name === 'request_rate' ? 'Requests' : 'Errors'}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />

            <Bar
              dataKey="request_rate"
              fill="var(--chart-1)"
              radius={[3, 3, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              dataKey="error_rate"
              fill="var(--danger)"
              radius={[3, 3, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
