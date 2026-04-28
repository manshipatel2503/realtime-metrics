import express, { type Request, type Response } from 'express';
import cors from 'cors';
import type { DataPoint, MetricDefinition } from './types';

const app = express();
const PORT = 3001;

app.use(cors());

const METRICS: MetricDefinition[] = [
  { name: 'cpu_usage',    min: 10,  max: 95,  unit: '%'     },
  { name: 'memory_usage', min: 30,  max: 90,  unit: '%'     },
  { name: 'latency',      min: 5,   max: 300, unit: 'ms'    },
  { name: 'request_rate', min: 50,  max: 500, unit: 'req/s' },
  { name: 'error_rate',   min: 0,   max: 15,  unit: '%'     },
];

const lastValues: Record<string, number> = {};
METRICS.forEach(m => {
  lastValues[m.name] = randomBetween(m.min, m.max);
});

let idCounter = 1;

function randomBetween(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function nextValue(metric: MetricDefinition): number {
  const prev = lastValues[metric.name] ?? randomBetween(metric.min, metric.max);
  const step = (metric.max - metric.min) * 0.06;
  const delta = (Math.random() - 0.5) * 2 * step;
  const next = parseFloat(
    Math.min(metric.max, Math.max(metric.min, prev + delta)).toFixed(2)
  );
  lastValues[metric.name] = next;
  return next;
}

function createDataPoint(metric: MetricDefinition): DataPoint {
  return {
    id:        idCounter++,
    timestamp: new Date().toISOString(),
    metric:    metric.name,
    unit:      metric.unit,
    value:     nextValue(metric),
  };
}

app.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  console.log(`[SSE] Client connected    ${new Date().toISOString()}`);

  let metricIndex = 0;

  const interval = setInterval(() => {
    const metric = METRICS[metricIndex % METRICS.length]!;
    const point: DataPoint = createDataPoint(metric);
    metricIndex++;

    res.write(`data: ${JSON.stringify(point)}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    console.log(`[SSE] Client disconnected ${new Date().toISOString()}`);
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`SSE server running → http://localhost:${PORT}`);
  console.log(`Stream endpoint    → http://localhost:${PORT}/stream`);
});
