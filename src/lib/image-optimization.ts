// Image optimization utilities for responsive images and WebP conversion

export interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
}

export interface ResponsiveImageConfig extends ImageConfig {
  sizes?: string;
  breakpoints?: number[];
}

// Generate responsive image sizes based on breakpoints
export function generateResponsiveSizes(
  baseWidth: number,
  breakpoints: number[] = [640, 768, 1024, 1280, 1536]
): string {
  const sizes = breakpoints.map((bp, index) => {
    if (index === 0) {
      return `(max-width: ${bp}px) 100vw`;
    }
    if (index === breakpoints.length - 1) {
      return `${Math.round((baseWidth / bp) * 100)}vw`;
    }
    return `(max-width: ${bp}px) ${Math.round((baseWidth / bp) * 100)}vw`;
  });

  return sizes.join(', ');
}

// Image size configurations for different use cases
export const imageSizeConfigs = {
  hero: {
    sizes: '100vw',
    quality: 90,
    priority: true,
    breakpoints: [640, 768, 1024, 1280, 1920],
  },
  faculty: {
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw',
    quality: 85,
    breakpoints: [160, 320, 480, 640],
  },
  research: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality: 85,
    breakpoints: [320, 640, 960, 1280],
  },
  news: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality: 80,
    breakpoints: [320, 640, 960],
  },
  thumbnail: {
    sizes: '(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw',
    quality: 75,
    breakpoints: [80, 160, 240, 320],
  },
};

// Generate srcSet for responsive images
export function generateSrcSet(
  baseSrc: string,
  breakpoints: number[],
  format: 'webp' | 'avif' | 'jpg' = 'webp'
): string {
  return breakpoints
    .map((width) => {
      const optimizedSrc = `/_next/image?url=${encodeURIComponent(
        baseSrc
      )}&w=${width}&q=85&fm=${format}`;
      return `${optimizedSrc} ${width}w`;
    })
    .join(', ');
}

// WebP conversion utility (for build-time optimization)
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  quality: number = 85,
  format: 'webp' | 'avif' | 'jpg' = 'webp'
): string {
  const params = new URLSearchParams({
    url: src,
    q: quality.toString(),
    fm: format,
  });

  if (width) {
    params.set('w', width.toString());
  }

  return `/_next/image?${params.toString()}`;
}

// Image preloading utilities
export function preloadImage(src: string, priority: boolean = false): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = priority ? 'preload' : 'prefetch';
  link.as = 'image';
  link.href = src;
  
  // Add to head
  document.head.appendChild(link);
}

export function preloadCriticalImages(images: string[]): void {
  images.forEach((src) => preloadImage(src, true));
}

// Lazy loading intersection observer
export function createImageObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
}

// Image loading performance utilities
export function measureImageLoadTime(src: string): Promise<number> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime);
    };
    
    img.onerror = () => {
      resolve(-1); // Error loading
    };
    
    img.src = src;
  });
}

// Generate blur placeholder data URL
export function generateBlurDataURL(
  width: number = 8,
  height: number = 8,
  color: string = '#f3f4f6'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

// Static blur placeholder for SSR
export const defaultBlurDataURL = 
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

// Image format detection
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}