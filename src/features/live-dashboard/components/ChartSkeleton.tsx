import { Card } from '../../../shared/ui/Card';
import { Skeleton } from '../../../shared/ui/Skeleton';

export function ChartSkeleton() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      <div className="flex items-end gap-1 h-48">
        {[60, 80, 50, 90, 70, 55, 85, 65, 75, 45, 80, 60].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between mt-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-10" />
        ))}
      </div>
    </Card>
  );
}
