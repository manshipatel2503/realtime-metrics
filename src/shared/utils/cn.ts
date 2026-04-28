import { clsx, type ClassValue } from 'clsx';

// Merges class names, filters falsy values
// Usage: cn('base', isActive && 'active', className)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
