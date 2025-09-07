'use client';

import { useEffect } from 'react';
import { preloadCriticalComponents } from '@/lib/dynamic-imports';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Initialize performance monitoring and optimizations
    const initializePerformance = async () => {
      // Preload critical components after initial render
      preloadCriticalComponents();

      // Initialize performance monitoring in development
      if (process.env.NODE_ENV === 'development') {
        const { devTools } = await import('@/lib/performance-monitoring');
        devTools.trackLargestContentfulPaint();
        devTools.trackLayoutShifts();
      }
    };

    // Run after a short delay to not block initial render
    const timeoutId = setTimeout(initializePerformance, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <>{children}</>;
}