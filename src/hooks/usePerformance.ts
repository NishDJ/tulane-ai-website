'use client';

import { useEffect, useState, useCallback } from 'react';
import { performanceMonitor, type PerformanceMetric } from '@/lib/performance-monitoring';
import { preloadCriticalData } from '@/lib/cache-strategies';

export interface PerformanceState {
  metrics: Map<string, PerformanceMetric>;
  isLoading: boolean;
  connectionType: string | null;
  isSlowConnection: boolean;
}

export function usePerformance() {
  const [state, setState] = useState<PerformanceState>({
    metrics: new Map(),
    isLoading: true,
    connectionType: null,
    isSlowConnection: false,
  });

  // Get network information
  const getNetworkInfo = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection?.effectiveType || null,
        downlink: connection?.downlink || null,
        rtt: connection?.rtt || null,
        saveData: connection?.saveData || false,
      };
    }
    return null;
  }, []);

  // Check if connection is slow
  const checkSlowConnection = useCallback(() => {
    const networkInfo = getNetworkInfo();
    if (!networkInfo) return false;

    return (
      networkInfo.effectiveType === 'slow-2g' ||
      networkInfo.effectiveType === '2g' ||
      networkInfo.downlink < 1.5 ||
      networkInfo.rtt > 300 ||
      networkInfo.saveData
    );
  }, [getNetworkInfo]);

  // Initialize performance monitoring
  useEffect(() => {
    const networkInfo = getNetworkInfo();
    const isSlowConnection = checkSlowConnection();

    setState(prev => ({
      ...prev,
      connectionType: networkInfo?.effectiveType || null,
      isSlowConnection,
      isLoading: false,
    }));

    // Preload critical data if connection is good
    if (!isSlowConnection) {
      preloadCriticalData().catch(console.warn);
    }

    // Update metrics periodically
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        metrics: performanceMonitor.getMetrics(),
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [getNetworkInfo, checkSlowConnection]);

  // Get specific metric
  const getMetric = useCallback((name: string): PerformanceMetric | undefined => {
    return performanceMonitor.getMetric(name);
  }, []);

  // Check if metric is good
  const isMetricGood = useCallback((name: string): boolean => {
    const metric = getMetric(name);
    return metric?.rating === 'good';
  }, [getMetric]);

  // Get performance score (0-100)
  const getPerformanceScore = useCallback((): number => {
    const metrics = performanceMonitor.getMetrics();
    const scores: number[] = [];

    metrics.forEach(metric => {
      switch (metric.rating) {
        case 'good':
          scores.push(100);
          break;
        case 'needs-improvement':
          scores.push(75);
          break;
        case 'poor':
          scores.push(25);
          break;
      }
    });

    if (scores.length === 0) return 100;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, []);

  return {
    ...state,
    getMetric,
    isMetricGood,
    getPerformanceScore,
    networkInfo: getNetworkInfo(),
  };
}

// Hook for image lazy loading with performance optimization
export function useImageLazyLoading(threshold: number = 0.1) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const { isSlowConnection } = usePerformance();

  const shouldLoadImage = useCallback((src: string, isVisible: boolean): boolean => {
    if (loadedImages.has(src)) return true;
    
    // On slow connections, only load visible images
    if (isSlowConnection) {
      return isVisible;
    }
    
    // On fast connections, preload images that are close to viewport
    return isVisible;
  }, [loadedImages, isSlowConnection]);

  const markImageLoaded = useCallback((src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  }, []);

  const createImageObserver = useCallback((
    callback: (entry: IntersectionObserverEntry) => void
  ) => {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach(callback);
      },
      {
        rootMargin: isSlowConnection ? '0px' : '50px',
        threshold,
      }
    );
  }, [isSlowConnection, threshold]);

  return {
    shouldLoadImage,
    markImageLoaded,
    createImageObserver,
    isSlowConnection,
  };
}

// Hook for component lazy loading
export function useComponentLazyLoading() {
  const { isSlowConnection } = usePerformance();
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());

  const shouldLoadComponent = useCallback((
    componentName: string,
    isVisible: boolean,
    isPriority: boolean = false
  ): boolean => {
    if (loadedComponents.has(componentName)) return true;
    if (isPriority) return true;
    
    // On slow connections, be more conservative
    if (isSlowConnection) {
      return isVisible;
    }
    
    return isVisible;
  }, [loadedComponents, isSlowConnection]);

  const markComponentLoaded = useCallback((componentName: string) => {
    setLoadedComponents(prev => new Set(prev).add(componentName));
  }, []);

  return {
    shouldLoadComponent,
    markComponentLoaded,
    isSlowConnection,
  };
}

// Hook for adaptive loading based on device capabilities
export function useAdaptiveLoading() {
  const { isSlowConnection, networkInfo } = usePerformance();
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    memory: 4, // GB, default assumption
    cores: 4, // Default assumption
    isLowEnd: false,
  });

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      const isLowEnd = memory <= 2 || cores <= 2;

      setDeviceCapabilities({ memory, cores, isLowEnd });
    }
  }, []);

  const getLoadingStrategy = useCallback(() => {
    if (deviceCapabilities.isLowEnd || isSlowConnection) {
      return 'conservative'; // Load only essential content
    }
    
    if (networkInfo?.effectiveType === '4g' && deviceCapabilities.memory >= 4) {
      return 'aggressive'; // Preload and optimize for speed
    }
    
    return 'balanced'; // Default strategy
  }, [deviceCapabilities, isSlowConnection, networkInfo]);

  const shouldPreload = useCallback((priority: 'high' | 'medium' | 'low' = 'medium'): boolean => {
    const strategy = getLoadingStrategy();
    
    switch (strategy) {
      case 'conservative':
        return priority === 'high';
      case 'aggressive':
        return true;
      case 'balanced':
      default:
        return priority === 'high' || priority === 'medium';
    }
  }, [getLoadingStrategy]);

  return {
    deviceCapabilities,
    loadingStrategy: getLoadingStrategy(),
    shouldPreload,
    isSlowConnection,
  };
}