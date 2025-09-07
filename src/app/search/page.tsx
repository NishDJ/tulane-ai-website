'use client';

import { Suspense } from 'react';
import { GlobalSearch } from '@/components/search';

// Metadata moved to layout or parent component since this is now a client component

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const initialQuery = searchParams.q || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search
            </h1>
            <p className="text-gray-600">
              Find faculty, research projects, news, events, and resources
            </p>
          </div>

          <Suspense fallback={<SearchFallback />}>
            <GlobalSearch 
              initialQuery={initialQuery}
              showFilters={true}
              pageSize={12}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function SearchFallback() {
  return (
    <div className="space-y-6">
      {/* Search input skeleton */}
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Results skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}