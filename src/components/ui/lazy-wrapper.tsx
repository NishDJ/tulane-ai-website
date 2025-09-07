'use client';

import { Suspense, lazy, ComponentType, useState, useEffect } from 'react';
import { LoadingSkeleton } from '@/components/animations/loading-skeleton';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  className?: string;
}

// Generic lazy loading wrapper
export function LazyWrapper({
  component: Component,
  fallback,
  className,
  ...props
}: LazyWrapperProps & {
  component: ComponentType<any>;
} & Record<string, any>) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className={className}>
            <LoadingSkeleton />
          </div>
        )
      }
    >
      <Component {...props} />
    </Suspense>
  );
}

// Simplified lazy loading for existing components

// Simplified lazy loading hook
export function useLazyComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyLoadedComponent(props: any) {
    return (
      <Suspense fallback={fallback || <LoadingSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Intersection Observer based lazy loading
export function LazyOnVisible({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  className,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return (
    <div ref={setRef} className={className}>
      {isVisible ? children : fallback || <LoadingSkeleton />}
    </div>
  );
}