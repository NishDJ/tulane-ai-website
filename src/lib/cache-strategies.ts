// Caching strategies for static and dynamic content

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: number;
  maxAge?: number;
}

// Cache configurations for different content types
export const cacheConfigs = {
  // Static content (images, assets)
  static: {
    ttl: 31536000000, // 1 year
    maxAge: 31536000, // 1 year in seconds
  },
  
  // Faculty data (changes infrequently)
  faculty: {
    ttl: 3600000, // 1 hour
    staleWhileRevalidate: 86400000, // 24 hours
    maxAge: 3600, // 1 hour in seconds
  },
  
  // Research data (changes occasionally)
  research: {
    ttl: 1800000, // 30 minutes
    staleWhileRevalidate: 3600000, // 1 hour
    maxAge: 1800, // 30 minutes in seconds
  },
  
  // News and events (changes frequently)
  news: {
    ttl: 300000, // 5 minutes
    staleWhileRevalidate: 1800000, // 30 minutes
    maxAge: 300, // 5 minutes in seconds
  },
  
  // Search results (short-lived)
  search: {
    ttl: 60000, // 1 minute
    staleWhileRevalidate: 300000, // 5 minutes
    maxAge: 60, // 1 minute in seconds
  },
};

// In-memory cache implementation
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const memoryCache = new MemoryCache();

// Browser cache utilities
export function setBrowserCache(
  response: Response,
  config: CacheConfig
): Response {
  const headers = new Headers(response.headers);
  
  // Set Cache-Control header
  const cacheControl = [
    `max-age=${config.maxAge || Math.floor(config.ttl / 1000)}`,
  ];
  
  if (config.staleWhileRevalidate) {
    cacheControl.push(
      `stale-while-revalidate=${Math.floor(config.staleWhileRevalidate / 1000)}`
    );
  }
  
  headers.set('Cache-Control', cacheControl.join(', '));
  
  // Set ETag for conditional requests
  const etag = generateETag(response);
  if (etag) {
    headers.set('ETag', etag);
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Generate ETag for content
function generateETag(response: Response): string | null {
  try {
    // Simple hash-based ETag generation
    const content = response.clone();
    return `"${Date.now().toString(36)}"`;
  } catch {
    return null;
  }
}

// Service Worker cache strategies
export const swCacheStrategies = {
  // Cache first for static assets
  cacheFirst: {
    cacheName: 'static-assets',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
          return `${request.url}?v=${process.env.BUILD_ID || 'dev'}`;
        },
      },
    ],
  },
  
  // Network first for dynamic content
  networkFirst: {
    cacheName: 'dynamic-content',
    networkTimeoutSeconds: 3,
    plugins: [
      {
        cacheWillUpdate: async ({ response }: { response: Response }) => {
          return response.status === 200;
        },
      },
    ],
  },
  
  // Stale while revalidate for API data
  staleWhileRevalidate: {
    cacheName: 'api-cache',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
          const url = new URL(request.url);
          // Remove timestamp parameters for consistent caching
          url.searchParams.delete('_t');
          return url.toString();
        },
      },
    ],
  },
};

// Local Storage cache for user preferences
export class LocalStorageCache {
  private prefix: string;

  constructor(prefix: string = 'tulane-ai-') {
    this.prefix = prefix;
  }

  set(key: string, data: any, ttl?: number): void {
    if (typeof window === 'undefined') return;
    
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttl || 0,
    };
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage item:', error);
    }
  }

  get(key: string): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Check if expired
      if (parsed.ttl > 0 && Date.now() - parsed.timestamp > parsed.ttl) {
        this.delete(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Failed to get localStorage item:', error);
      return null;
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Failed to delete localStorage item:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

// Global localStorage cache instance
export const localCache = new LocalStorageCache();

// Cache invalidation utilities
export function invalidateCache(pattern: string): void {
  // Invalidate memory cache
  const keys = Array.from(memoryCache['cache'].keys());
  keys.forEach((key) => {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  });
  
  // Invalidate localStorage cache
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Preload and cache critical data
export async function preloadCriticalData(): Promise<void> {
  const criticalEndpoints = [
    '/api/faculty',
    '/api/research',
    '/api/news?limit=5',
  ];
  
  const preloadPromises = criticalEndpoints.map(async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      // Cache the data
      memoryCache.set(endpoint, data, cacheConfigs.faculty.ttl);
      
      return data;
    } catch (error) {
      console.warn(`Failed to preload ${endpoint}:`, error);
      return null;
    }
  });
  
  await Promise.allSettled(preloadPromises);
}

// Cleanup expired cache entries periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup();
  }, 300000); // Clean up every 5 minutes
}