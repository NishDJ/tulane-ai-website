'use client';

import { cn } from '@/lib/utils';
import { MOBILE_GRID } from '@/lib/mobile-utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  variant?: keyof typeof MOBILE_GRID;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({ 
  children, 
  variant = 'auto', 
  className,
  gap = 'md'
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  return (
    <div 
      className={cn(
        'grid',
        MOBILE_GRID[variant],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}