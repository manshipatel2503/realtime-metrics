export interface MetricDefinition {
  name: string;
  min: number;
  max: number;
  unit: string;
}

export interface DataPoint {
  id: number;
  timestamp: string;
  metric: string;
  unit: string;
  value: number;
}
