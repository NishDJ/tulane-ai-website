import { useState, useEffect } from 'react';
import { 
  type PublicationResource, 
  type DatasetResource, 
  type SoftwareTool,
  type EducationalResource,
  type LoadingState,
  type SearchFilters,
  type SortOptions
} from '@/types';

type ResourceType = 'publications' | 'datasets' | 'software' | 'educational' | 'all';
type ResourceItem = PublicationResource | DatasetResource | SoftwareTool | EducationalResource;

interface UseResourcesOptions {
  type?: ResourceType;
  category?: string;
  tags?: string[];
  featured?: boolean;
  openAccess?: boolean;
  accessLevel?: 'public' | 'restricted' | 'private';
  query?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  autoFetch?: boolean;
}

interface UseResourcesReturn {
  resources: ResourceItem[];
  loading: LoadingState;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useResources(options: UseResourcesOptions = {}): UseResourcesReturn {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    type = 'all',
    category,
    tags,
    featured,
    openAccess,
    accessLevel,
    query,
    limit = 20,
    sortBy = 'lastUpdated',
    sortOrder = 'desc',
    autoFetch = true
  } = options;

  const fetchResources = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading('loading');
      setError(null);

      const params = new URLSearchParams();
      
      if (type !== 'all') params.append('type', type);
      if (category) params.append('category', category);
      if (tags && tags.length > 0) params.append('tags', tags.join(','));
      if (featured !== undefined) params.append('featured', featured.toString());
      if (openAccess !== undefined) params.append('openAccess', openAccess.toString());
      if (accessLevel) params.append('accessLevel', accessLevel);
      if (query) params.append('query', query);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      
      params.append('limit', limit.toString());
      params.append('offset', ((page - 1) * limit).toString());

      const response = await fetch(`/api/resources?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch resources');
      }

      if (append) {
        setResources(prev => [...prev, ...data.data.items]);
      } else {
        setResources(data.data.items);
      }
      
      setPagination(data.data.pagination);
      setCurrentPage(page);
      setLoading('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading('error');
      console.error('Error fetching resources:', err);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchResources(1, false);
    }
  }, [type, category, tags?.join(','), featured, openAccess, accessLevel, query, sortBy, sortOrder, limit]);

  const refetch = () => {
    fetchResources(1, false);
  };

  const loadMore = () => {
    if (pagination && currentPage < pagination.totalPages) {
      fetchResources(currentPage + 1, true);
    }
  };

  const hasMore = pagination ? currentPage < pagination.totalPages : false;

  return {
    resources,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    hasMore,
  };
}

// Specialized hooks for specific resource types
export function usePublications(options: Omit<UseResourcesOptions, 'type'> = {}) {
  return useResources({ ...options, type: 'publications' });
}

export function useDatasets(options: Omit<UseResourcesOptions, 'type'> = {}) {
  return useResources({ ...options, type: 'datasets' });
}

export function useSoftwareTools(options: Omit<UseResourcesOptions, 'type'> = {}) {
  return useResources({ ...options, type: 'software' });
}

export function useEducationalResources(options: Omit<UseResourcesOptions, 'type'> = {}) {
  return useResources({ ...options, type: 'educational' });
}