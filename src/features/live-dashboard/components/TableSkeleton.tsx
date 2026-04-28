import { Card } from '../../../shared/ui/Card';
import { Skeleton } from '../../../shared/ui/Skeleton';

export function TableSkeleton() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-3" />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 items-center">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}
