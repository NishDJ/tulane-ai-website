'use client';

import { useState, useEffect, useCallback } from 'react';
import { type ResearchProject, type ApiResponse, type PaginatedResponse, type SearchFilters, type SortOptions } from '@/types';

interface UseResearchOptions {
  filters?: SearchFilters;
  sortOptions?: SortOptions;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseResearchReturn {
  projects: ResearchProject[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  refetch: () => Promise<void>;
  fetchProject: (id: string) => Promise<ResearchProject | null>;
}

export function useResearch(options: UseResearchOptions = {}): UseResearchReturn {
  const {
    filters = {},
    sortOptions = { field: 'startDate', direction: 'desc' },
    page = 1,
    limit = 10,
    autoFetch = true
  } = options;

  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.query) params.append('q', filters.query);
      if (filters.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters.status) params.append('status', filters.status);
      if (page !== 1) params.append('page', page.toString());
      if (limit !== 10) params.append('limit', limit.toString());
      if (sortOptions.field !== 'startDate') params.append('sortField', sortOptions.field);
      if (sortOptions.direction !== 'desc') params.append('sortDirection', sortOptions.direction);

      const response = await fetch(`/api/research?${params.toString()}`);
      const data: ApiResponse<ResearchProject[]> | PaginatedResponse<ResearchProject> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch research projects');
      }

      // Handle both paginated and non-paginated responses
      if ('pagination' in data.data) {
        // Paginated response
        setProjects(data.data.items);
        setTotalCount(data.data.pagination.total);
        setCurrentPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        // Non-paginated response
        setProjects(data.data);
        setTotalCount(data.data.length);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProjects([]);
      setTotalCount(0);
      setCurrentPage(1);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters, sortOptions, page, limit]);

  const fetchProject = useCallback(async (id: string): Promise<ResearchProject | null> => {
    try {
      const response = await fetch(`/api/research/${id}`);
      const data: ApiResponse<ResearchProject | null> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch research project');
      }

      return data.data;
    } catch (err) {
      console.error('Error fetching research project:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [fetchProjects, autoFetch]);

  return {
    projects,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    refetch: fetchProjects,
    fetchProject,
  };
}

// Hook for fetching a single research project
export function useResearchProject(id: string | null) {
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/research/${projectId}`);
      const data: ApiResponse<ResearchProject | null> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch research project');
      }

      setProject(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    } else {
      setProject(null);
      setError(null);
    }
  }, [id, fetchProject]);

  return {
    project,
    loading,
    error,
    refetch: id ? () => fetchProject(id) : () => Promise.resolve(),
  };
}