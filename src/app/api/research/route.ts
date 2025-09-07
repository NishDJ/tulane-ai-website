import { NextRequest, NextResponse } from 'next/server';
import { loadResearchProjects, searchResearchProjects } from '@/lib/data-loader';
import { type SearchFilters, type SortOptions } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query = searchParams.get('q') || undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sortField = searchParams.get('sortField') || 'startDate';
    const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

    // Build filters
    const filters: SearchFilters = {
      query,
      tags,
      status,
    };

    // Build sort options
    const sortOptions: SortOptions = {
      field: sortField,
      direction: sortDirection,
    };

    // If no filters are applied, return all projects
    if (!query && !tags && !status && page === 1 && limit === 10) {
      const response = await loadResearchProjects();
      return NextResponse.json(response);
    }

    // Otherwise, use search function with pagination
    const response = await searchResearchProjects(filters, sortOptions, page, limit);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in research API:', error);
    return NextResponse.json(
      {
        data: [],
        success: false,
        error: 'Failed to load research projects',
      },
      { status: 500 }
    );
  }
}