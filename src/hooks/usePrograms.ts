'use client';

import { useState, useEffect } from 'react';
import { Program, ApplicationInfo, EducationalResource, LoadingState } from '@/types';

interface UseProgramsOptions {
  type?: Program['type'];
  level?: Program['level'];
  format?: Program['format'];
  featured?: boolean;
  active?: boolean;
}

interface UseProgramsReturn {
  programs: Program[];
  loading: LoadingState;
  error: string | null;
  refetch: () => void;
}

export function usePrograms(options: UseProgramsOptions = {}): UseProgramsReturn {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading('loading');
      setError(null);

      const params = new URLSearchParams();
      if (options.type) params.append('type', options.type);
      if (options.level) params.append('level', options.level);
      if (options.format) params.append('format', options.format);
      if (options.featured !== undefined) params.append('featured', options.featured.toString());
      if (options.active !== undefined) params.append('active', options.active.toString());

      const response = await fetch(`/api/programs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch programs: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch programs');
      }

      setPrograms(data.data.items);
      setLoading('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading('error');
      console.error('Error fetching programs:', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [options.type, options.level, options.format, options.featured, options.active]);

  const refetch = () => {
    fetchPrograms();
  };

  return {
    programs,
    loading,
    error,
    refetch,
  };
}

interface UseProgramReturn {
  program: Program | null;
  loading: LoadingState;
  error: string | null;
  refetch: () => void;
}

export function useProgram(id: string): UseProgramReturn {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchProgram = async () => {
    if (!id) return;

    try {
      setLoading('loading');
      setError(null);

      const response = await fetch(`/api/programs/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Program not found');
        }
        throw new Error(`Failed to fetch program: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch program');
      }

      setProgram(data.data);
      setLoading('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading('error');
      console.error('Error fetching program:', err);
    }
  };

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const refetch = () => {
    fetchProgram();
  };

  return {
    program,
    loading,
    error,
    refetch,
  };
}

interface UseApplicationInfoReturn {
  applicationInfo: ApplicationInfo | null;
  loading: LoadingState;
  error: string | null;
  refetch: () => void;
}

export function useApplicationInfo(programId: string): UseApplicationInfoReturn {
  const [applicationInfo, setApplicationInfo] = useState<ApplicationInfo | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationInfo = async () => {
    if (!programId) return;

    try {
      setLoading('loading');
      setError(null);

      const response = await fetch(`/api/programs/applications?programId=${programId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch application info: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch application info');
      }

      // Find the application info for this program
      const appInfo = data.data.find((info: ApplicationInfo) => info.programId === programId);
      setApplicationInfo(appInfo || null);
      setLoading('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading('error');
      console.error('Error fetching application info:', err);
    }
  };

  useEffect(() => {
    fetchApplicationInfo();
  }, [programId]);

  const refetch = () => {
    fetchApplicationInfo();
  };

  return {
    applicationInfo,
    loading,
    error,
    refetch,
  };
}

interface UseResourcesOptions {
  category?: string;
  type?: EducationalResource['type'];
  downloadable?: boolean;
  tags?: string;
}

interface UseResourcesReturn {
  resources: EducationalResource[];
  loading: LoadingState;
  error: string | null;
  refetch: () => void;
}

export function useResources(options: UseResourcesOptions = {}): UseResourcesReturn {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setLoading('loading');
      setError(null);

      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      if (options.type) params.append('type', options.type);
      if (options.downloadable !== undefined) params.append('downloadable', options.downloadable.toString());
      if (options.tags) params.append('tags', options.tags);

      const response = await fetch(`/api/programs/resources?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch resources');
      }

      setResources(data.data.items);
      setLoading('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading('error');
      console.error('Error fetching resources:', err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [options.category, options.type, options.downloadable, options.tags]);

  const refetch = () => {
    fetchResources();
  };

  return {
    resources,
    loading,
    error,
    refetch,
  };
}