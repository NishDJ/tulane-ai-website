'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  FileText, 
  Calendar, 
  BookOpen, 
  Database, 
  Code, 
  ExternalLink,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/lib/search';

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
  query: string;
  isLoading: boolean;
  error: string | null;
  facets: {
    types: Array<{ type: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  };
  selectedTypes: string[];
  selectedTags: string[];
  onTypeToggle: (type: string) => void;
  onTagToggle: (tag: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const typeIcons = {
  faculty: User,
  research: FileText,
  news: FileText,
  event: Calendar,
  publication: BookOpen,
  dataset: Database,
  software: Code,
};

const typeLabels = {
  faculty: 'Faculty',
  research: 'Research',
  news: 'News',
  event: 'Events',
  publication: 'Publications',
  dataset: 'Datasets',
  software: 'Software',
};

export function SearchResults({
  results,
  total,
  query,
  isLoading,
  error,
  facets,
  selectedTypes,
  selectedTags,
  onTypeToggle,
  onTagToggle,
  onLoadMore,
  hasMore = false,
}: SearchResultsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTags, setExpandedTags] = useState(false);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Search Error</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (isLoading && results.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-3 w-full mb-1 rounded"></div>
            <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-8 text-gray-500">
        Enter a search term to find faculty, research, news, and resources.
      </div>
    );
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-2">No results found</div>
        <p className="text-gray-500">
          Try adjusting your search terms or filters.
        </p>
      </div>
    );
  }

  const visibleTags = expandedTags ? facets.tags : facets.tags.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {total > 0 && (
            <>
              Showing {results.length} of {total} results for{' '}
              <span className="font-medium">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </div>
        
        {(facets.types.length > 0 || facets.tags.length > 0) && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 text-sm text-tulane-green hover:text-tulane-green/80 transition-colors"
          >
            <Filter size={16} />
            <span>Filters</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (facets.types.length > 0 || facets.tags.length > 0) && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          {/* Type filters */}
          {facets.types.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Content Type</h4>
              <div className="flex flex-wrap gap-2">
                {facets.types.map(({ type, count }) => (
                  <button
                    key={type}
                    onClick={() => onTypeToggle(type)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      selectedTypes.includes(type)
                        ? 'bg-tulane-green text-white border-tulane-green'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-tulane-green'
                    )}
                  >
                    {typeLabels[type as keyof typeof typeLabels] || type} ({count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag filters */}
          {facets.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {visibleTags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      selectedTags.includes(tag)
                        ? 'bg-tulane-green text-white border-tulane-green'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-tulane-green'
                    )}
                  >
                    {tag} ({count})
                  </button>
                ))}
                {facets.tags.length > 8 && (
                  <button
                    onClick={() => setExpandedTags(!expandedTags)}
                    className="px-3 py-1 text-sm text-tulane-green hover:text-tulane-green/80 transition-colors"
                  >
                    {expandedTags ? 'Show less' : `Show ${facets.tags.length - 8} more`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results list */}
      <div className="space-y-4">
        {results.map((result) => (
          <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && onLoadMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-tulane-green text-white rounded-lg hover:bg-tulane-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load More Results'}
          </button>
        </div>
      )}
    </div>
  );
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const Icon = typeIcons[result.type as keyof typeof typeIcons] || FileText;
  const typeLabel = typeLabels[result.type as keyof typeof typeLabels] || result.type;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-tulane-green/10 rounded-lg flex items-center justify-center">
            <Icon className="text-tulane-green" size={16} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-tulane-green uppercase tracking-wide">
              {typeLabel}
            </span>
            <span className="text-xs text-gray-400">
              Score: {(result.relevanceScore * 100).toFixed(0)}%
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <Link 
              href={result.url}
              className="hover:text-tulane-green transition-colors"
            >
              {result.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {result.description}
          </p>
          
          {result.highlights.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 mb-1">Matches:</div>
              <div className="space-y-1">
                {result.highlights.slice(0, 2).map((highlight, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-600"
                    dangerouslySetInnerHTML={{ __html: highlight }}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {(() => {
                const metadata = [];
                if (typeof result.metadata.author === 'string' && result.metadata.author) {
                  metadata.push(<span key="author">By {result.metadata.author}</span>);
                }
                if (result.metadata.publishDate) {
                  metadata.push(
                    <span key="date">
                      {new Date(result.metadata.publishDate as string).toLocaleDateString()}
                    </span>
                  );
                }
                if (typeof result.metadata.department === 'string' && result.metadata.department) {
                  metadata.push(<span key="department">{result.metadata.department}</span>);
                }
                return metadata;
              })()}
            </div>
            
            <Link
              href={result.url}
              className="flex items-center space-x-1 text-tulane-green hover:text-tulane-green/80 text-sm transition-colors"
            >
              <span>View</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}