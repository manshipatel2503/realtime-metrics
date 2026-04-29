import type React from 'react';
import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={cn(
        'animate-pulse rounded-md',
        'bg-bg-elevated',
        className
      )}
    />
  );
}
