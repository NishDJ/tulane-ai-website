import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/animations/loading-skeleton';

// Dynamic import configurations for heavy components
export const DynamicComponents = {
  // Search components (heavy due to search logic)
  GlobalSearch: dynamic(() => import('@/components/search/global-search').then(mod => ({ default: mod.GlobalSearch })), {
    loading: () => <LoadingSkeleton className="h-12" />,
  }),

  SearchResults: dynamic(() => import('@/components/search/search-results').then(mod => ({ default: mod.SearchResults })), {
    loading: () => <LoadingSkeleton className="h-64" />,
  }),

  // Resource components
  BookmarkManager: dynamic(
    () => import('@/components/resources/bookmark-manager').then(mod => ({ default: mod.BookmarkManager })),
    {
      loading: () => <LoadingSkeleton className="h-32" />,
      ssr: false, // Uses localStorage
    }
  ),
};

// Utility for creating dynamic imports with consistent loading states
export function createDynamicComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: {
    loading?: () => React.ReactNode;
    ssr?: boolean;
    className?: string;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading || (() => <LoadingSkeleton className={options.className} />),
    ssr: options.ssr ?? true,
  });
}

// Route-based code splitting
export const DynamicPages = {
  // Heavy page components that can be split
  FacultyProfile: dynamic(
    () => import('@/components/faculty/faculty-profile').then(mod => ({ default: mod.FacultyProfile })),
    {
      loading: () => <LoadingSkeleton className="min-h-screen" />,
    }
  ),

  ResearchDetail: dynamic(
    () => import('@/components/research/research-detail').then(mod => ({ default: mod.ResearchDetail })),
    {
      loading: () => <LoadingSkeleton className="min-h-screen" />,
    }
  ),

  NewsDetail: dynamic(() => import('@/components/news/news-detail').then(mod => ({ default: mod.NewsDetail })), {
    loading: () => <LoadingSkeleton className="min-h-screen" />,
  }),
};

// Preload critical components
export function preloadCriticalComponents() {
  // Preload components that are likely to be needed soon
  if (typeof window !== 'undefined') {
    // Preload on user interaction or after initial load
    const preloadComponents = [
      () => import('@/components/search/global-search'),
      () => import('@/components/faculty/faculty-grid'),
      () => import('@/components/research/research-grid'),
    ];

    // Preload after a short delay to not block initial render
    setTimeout(() => {
      preloadComponents.forEach((importFn) => {
        importFn().catch(() => {
          // Silently fail if preload fails
        });
      });
    }, 2000);
  }
}

// Bundle splitting configuration
export const bundleConfig = {
  // Vendor chunks
  vendor: ['react', 'react-dom', 'next'],
  animations: ['framer-motion'],
  ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  icons: ['lucide-react'],
  utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
};