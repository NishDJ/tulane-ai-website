'use client';

import { useState, useEffect, useCallback } from 'react';
import { type FacultyMember, type SearchFilters, type LoadingState } from '@/types';
import { apiClient } from '@/lib/api-client';

interface UseFacultyReturn {
  faculty: FacultyMember[];
  filteredFaculty: FacultyMember[];
  loading: LoadingState;
  error: string | null;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  refetch: () => Promise<void>;
}

export function useFaculty(): UseFacultyReturn {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  const fetchFaculty = useCallback(async () => {
    setLoading('loading');
    setError(null);

    try {
      const response = await apiClient.getFaculty();
      
      if (response.success) {
        setFaculty(response.data);
        setLoading('success');
      } else {
        setError(response.error || 'Failed to load faculty data');
        setLoading('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading('error');
    }
  }, []);

  // Apply filters client-side for real-time filtering
  useEffect(() => {
    if (faculty.length > 0) {
      let filtered = [...faculty];
      
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(member =>
          member.name.toLowerCase().includes(query) ||
          member.title.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query) ||
          member.bio.toLowerCase().includes(query) ||
          member.researchAreas.some(area => area.toLowerCase().includes(query))
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(member =>
          filters.tags!.some(tag =>
            member.researchAreas.some(area => area.toLowerCase().includes(tag.toLowerCase()))
          )
        );
      }
      
      setFilteredFaculty(filtered);
    }
  }, [faculty, filters]);

  // Initial data fetch
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const handleSetFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const refetch = useCallback(async () => {
    await fetchFaculty();
  }, [fetchFaculty]);

  return {
    faculty,
    filteredFaculty,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    refetch,
  };
}