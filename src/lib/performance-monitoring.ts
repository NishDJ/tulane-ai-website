// Performance monitoring utilities for Core Web Vitals and optimization

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface WebVitalsMetrics {
  CLS: number; // Cumulative Layout Shift
  FID: number; // First Input Delay
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  TTFB: number; // Time to First Byte
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entries) => {
      const firstEntry = entries[0] as any;
      this.recordMetric('FID', firstEntry.processingStart - firstEntry.startTime);
    });

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entries) => {
      let clsValue = 0;
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.recordMetric('CLS', clsValue);
    });

    // Navigation timing for other metrics
    this.observeNavigationTiming();
  }

  private observeMetric(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  private observeNavigationTiming(): void {
    if ('navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.recordMetric('FCP', fcpEntry.startTime);
      }

      // Time to First Byte
      this.recordMetric('TTFB', navigation.responseStart - navigation.requestStart);
    }
  }

  private recordMetric(name: string, value: number): void {
    const rating = this.getRating(name, value);
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
    };

    this.metrics.set(name, metric);
    this.reportMetric(metric);
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private reportMetric(metric: PerformanceMetric): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
      });
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }
  }

  private sendToAnalytics(metric: PerformanceMetric): void {
    // Send to your analytics service
    // Example: Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_rating: metric.rating },
      });
    }

    // Example: Custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(() => {
      // Silently fail if analytics endpoint is unavailable
    });
  }

  getMetrics(): Map<string, PerformanceMetric> {
    return new Map(this.metrics);
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Resource loading performance
export function measureResourceLoadTime(url: string): Promise<number> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    fetch(url)
      .then(() => {
        const loadTime = performance.now() - startTime;
        resolve(loadTime);
      })
      .catch(() => {
        resolve(-1); // Error loading
      });
  });
}

// Bundle size analysis
export function analyzeBundleSize(): void {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  const resources = [...scripts, ...stylesheets].map(element => ({
    url: element.getAttribute('src') || element.getAttribute('href'),
    type: element.tagName.toLowerCase(),
  }));

  Promise.all(
    resources.map(async (resource) => {
      if (!resource.url) return null;
      
      try {
        const response = await fetch(resource.url, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        
        return {
          url: resource.url,
          type: resource.type,
          size: size ? parseInt(size, 10) : 0,
        };
      } catch {
        return null;
      }
    })
  ).then(results => {
    const validResults = results.filter(Boolean);
    const totalSize = validResults.reduce((sum, result) => sum + (result?.size || 0), 0);
    
    console.log('Bundle Analysis:', {
      totalResources: validResults.length,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      resources: validResults,
    });
  });
}

// Image loading performance
export function trackImagePerformance(): void {
  if (typeof window === 'undefined') return;

  const images = Array.from(document.querySelectorAll('img'));
  
  images.forEach((img, index) => {
    const startTime = performance.now();
    
    if (img.complete) {
      // Image already loaded
      const loadTime = 0;
      console.log(`Image ${index} (cached):`, loadTime);
    } else {
      img.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        console.log(`Image ${index} load time:`, `${loadTime.toFixed(2)}ms`);
      });
      
      img.addEventListener('error', () => {
        console.warn(`Image ${index} failed to load:`, img.src);
      });
    }
  });
}

// Memory usage monitoring
export function monitorMemoryUsage(): void {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  
  const memoryInfo = {
    usedJSHeapSize: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
    totalJSHeapSize: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
    jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
  };

  console.log('Memory Usage:', memoryInfo);
  
  // Warn if memory usage is high
  const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
  if (usagePercentage > 80) {
    console.warn('High memory usage detected:', `${usagePercentage.toFixed(2)}%`);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.disconnect();
  });
}

// Development helpers
export const devTools = {
  measurePageLoad: () => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      console.log('Page Load Metrics:', {
        'DNS Lookup': `${navigation.domainLookupEnd - navigation.domainLookupStart}ms`,
        'TCP Connection': `${navigation.connectEnd - navigation.connectStart}ms`,
        'Request': `${navigation.responseStart - navigation.requestStart}ms`,
        'Response': `${navigation.responseEnd - navigation.responseStart}ms`,
        'DOM Processing': `${navigation.domContentLoadedEventEnd - navigation.responseEnd}ms`,
        'Total Load Time': `${navigation.loadEventEnd - navigation.fetchStart}ms`,
      });
    });
  },
  
  trackLargestContentfulPaint: () => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', `${lastEntry.startTime}ms`, lastEntry);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  },
  
  trackLayoutShifts: () => {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          console.log('Layout Shift:', entry, 'Total CLS:', clsValue);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  },
};

// Initialize development tools in development mode
if (process.env.NODE_ENV === 'development') {
  devTools.measurePageLoad();
}