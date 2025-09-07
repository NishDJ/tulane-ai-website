'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  lines?: number;
  animate?: boolean;
}

export const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  lines = 1,
  animate = true 
}: SkeletonProps) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";
  
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-md",
    card: "rounded-lg"
  };

  const shimmerAnimation = {
    initial: { backgroundPosition: "-200px 0" },
    animate: {
      backgroundPosition: "calc(200px + 100%) 0",
    },
    transition: {
      duration: 1.5,
      ease: "linear" as const,
      repeat: Infinity,
    }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              baseClasses,
              variants.text,
              index === lines - 1 ? "w-3/4" : "w-full"
            )}
            style={animate ? {
              background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200px 100%",
            } : undefined}
            initial={animate ? shimmerAnimation.initial : undefined}
            animate={animate ? shimmerAnimation.animate : undefined}
            transition={animate ? shimmerAnimation.transition : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(baseClasses, variants[variant], className)}
      style={animate ? {
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200px 100%",
      } : undefined}
      initial={animate ? shimmerAnimation.initial : undefined}
      animate={animate ? shimmerAnimation.animate : undefined}
      transition={animate ? shimmerAnimation.transition : undefined}
    />
  );
};

export const CardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={cn("p-6 border rounded-lg space-y-4", className)}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" className="w-12 h-12" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <div className="flex space-x-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const FacultySkeleton = () => (
  <CardSkeleton className="max-w-sm" />
);

export const ResearchSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-6 space-y-4">
      <Skeleton variant="text" className="h-6 w-3/4" />
      <Skeleton variant="text" lines={3} />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

export const NewsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32 rounded-full" />
    <Skeleton variant="text" className="h-8 w-full" />
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" className="w-8 h-8" />
      <Skeleton variant="text" className="h-4 w-32" />
    </div>
    <Skeleton variant="text" lines={4} />
  </div>
);

// Generic loading skeleton for dynamic imports
export const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);