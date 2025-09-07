import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { SearchResult, SearchResponse } from '@/lib/search';

export interface UseSearchOptions {
  query: string;
  types?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
  minScore?: number;
  debounceMs?: number;
  autoSearch?: boolean;
}

export interface UseSearchReturn {
  results: SearchResult[];
  total: number;
  suggestions: string[];
  facets: {
    types: Array<{ type: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  };
  isLoading: boolean;
  error: string | null;
  search: (options?: Partial<UseSearchOptions>) => Promise<void>;
  clearResults: () => void;
  hasSearched: boolean;
}

export function useSearch(initialOptions: UseSearchOptions = { query: '' }): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [facets, setFacets] = useState<{
    types: Array<{ type: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  }>({ types: [], tags: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchOptions, setSearchOptions] = useState<UseSearchOptions>(initialOptions);

  // Debounce the search query
  const debouncedQuery = useDebounce(searchOptions.query, searchOptions.debounceMs || 300);

  // Memoize search parameters to avoid unnecessary API calls
  const searchParams = useMemo(() => ({
    query: debouncedQuery,
    types: searchOptions.types,
    tags: searchOptions.tags,
    limit: searchOptions.limit || 10,
    offset: searchOptions.offset || 0,
    minScore: searchOptions.minScore || 0.1,
  }), [
    debouncedQuery,
    searchOptions.types,
    searchOptions.tags,
    searchOptions.limit,
    searchOptions.offset,
    searchOptions.minScore,
  ]);

  const performSearch = useCallback(async (params: typeof searchParams) => {
    if (!params.query.trim()) {
      setResults([]);
      setTotal(0);
      setSuggestions([]);
      setFacets({ types: [], tags: [] });
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.set('q', params.query);
      
      if (params.types && params.types.length > 0) {
        searchParams.set('types', params.types.join(','));
      }
      
      if (params.tags && params.tags.length > 0) {
        searchParams.set('tags', params.tags.join(','));
      }
      
      searchParams.set('limit', params.limit.toString());
      searchParams.set('offset', params.offset.toString());
      searchParams.set('minScore', params.minScore.toString());

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      
      setResults(data.results);
      setTotal(data.total);
      setSuggestions(data.suggestions);
      setFacets(data.facets);
      setHasSearched(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
      setTotal(0);
      setSuggestions([]);
      setFacets({ types: [], tags: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (searchOptions.autoSearch !== false && debouncedQuery !== searchOptions.query) {
      performSearch(searchParams);
    }
  }, [searchParams, performSearch, searchOptions.autoSearch, debouncedQuery, searchOptions.query]);

  const search = useCallback(async (options: Partial<UseSearchOptions> = {}) => {
    const newOptions = { ...searchOptions, ...options };
    setSearchOptions(newOptions);
    
    const params = {
      query: newOptions.query,
      types: newOptions.types,
      tags: newOptions.tags,
      limit: newOptions.limit || 10,
      offset: newOptions.offset || 0,
      minScore: newOptions.minScore || 0.1,
    };
    
    await performSearch(params);
  }, [searchOptions, performSearch]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotal(0);
    setSuggestions([]);
    setFacets({ types: [], tags: [] });
    setError(null);
    setHasSearched(false);
    setSearchOptions(prev => ({ ...prev, query: '' }));
  }, []);

  return {
    results,
    total,
    suggestions,
    facets,
    isLoading,
    error,
    search,
    clearResults,
    hasSearched,
  };
}

export function useSearchSuggestions(query: string, limit = 5) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: debouncedQuery, limit }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, limit]);

  return { suggestions, isLoading };
}