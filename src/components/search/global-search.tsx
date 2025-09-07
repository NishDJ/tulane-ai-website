'use client';

import { useState, useCallback } from 'react';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import { useSearch } from '@/hooks/useSearch';

interface GlobalSearchProps {
  initialQuery?: string;
  className?: string;
  showFilters?: boolean;
  pageSize?: number;
}

export function GlobalSearch({ 
  initialQuery = '', 
  className,
  showFilters = true,
  pageSize = 10 
}: GlobalSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    results,
    total,
    facets,
    isLoading,
    error,
    search,
    hasSearched,
  } = useSearch({
    query,
    types: selectedTypes.length > 0 ? selectedTypes : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    autoSearch: false,
  });

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
    await search({
      query: searchQuery,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      limit: pageSize,
      offset: 0,
    });
  }, [search, selectedTypes, selectedTags, pageSize]);

  const handleTypeToggle = useCallback(async (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    setCurrentPage(1);
    
    if (query.trim()) {
      await search({
        query,
        types: newTypes.length > 0 ? newTypes : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        limit: pageSize,
        offset: 0,
      });
    }
  }, [search, query, selectedTypes, selectedTags, pageSize]);

  const handleTagToggle = useCallback(async (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    setCurrentPage(1);
    
    if (query.trim()) {
      await search({
        query,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        tags: newTags.length > 0 ? newTags : undefined,
        limit: pageSize,
        offset: 0,
      });
    }
  }, [search, query, selectedTypes, selectedTags, pageSize]);

  const handleLoadMore = useCallback(async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    await search({
      query,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      limit: pageSize,
      offset: (nextPage - 1) * pageSize,
    });
  }, [search, query, selectedTypes, selectedTags, pageSize, currentPage]);

  const hasMore = results.length < total;

  return (
    <div className={className}>
      <div className="mb-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder="Search faculty, research, news, and resources..."
          size="lg"
          autoFocus
        />
      </div>

      {(hasSearched || isLoading) && (
        <SearchResults
          results={results}
          total={total}
          query={query}
          isLoading={isLoading}
          error={error}
          facets={showFilters ? facets : { types: [], tags: [] }}
          selectedTypes={selectedTypes}
          selectedTags={selectedTags}
          onTypeToggle={handleTypeToggle}
          onTagToggle={handleTagToggle}
          onLoadMore={hasMore ? handleLoadMore : undefined}
          hasMore={hasMore}
        />
      )}
    </div>
  );
}