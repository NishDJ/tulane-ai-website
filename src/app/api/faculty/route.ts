import { NextResponse } from 'next/server';
import { loadFacultyMembers, searchFacultyMembers } from '@/lib/data-loader';
import { type SearchFilters, type SortOptions } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if this is a search request
    const query = searchParams.get('query');
    const tags = searchParams.get('tags');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortField = searchParams.get('sortField') || 'name';
    const sortDirection = (searchParams.get('sortDirection') || 'asc') as 'asc' | 'desc';

    // Build filters
    const filters: SearchFilters = {};
    if (query) filters.query = query;
    if (tags) filters.tags = tags.split(',');

    const sortOptions: SortOptions = {
      field: sortField,
      direction: sortDirection,
    };

    // If search parameters are provided, use search function
    if (query || tags || page > 1 || limit !== 10) {
      const response = await searchFacultyMembers(filters, sortOptions, page, limit);
      return NextResponse.json(response);
    }

    // Otherwise, return all faculty
    const response = await loadFacultyMembers();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in faculty API route:', error);
    return NextResponse.json(
      { 
        data: [], 
        success: false, 
        error: 'Failed to load faculty data' 
      },
      { status: 500 }
    );
  }
}