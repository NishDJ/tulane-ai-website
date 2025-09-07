import { NextRequest, NextResponse } from 'next/server';
import {
  loadFacultyData,
  loadResearchData,
  loadNewsData,
  loadEventsData,
} from '@/lib/data-loader';
import {
  createFacultyIndex,
  createResearchIndex,
  createNewsIndex,
  createEventIndex,
  createPublicationIndex,
  createDatasetIndex,
  createSoftwareIndex,
  searchIndex,
  sanitizeSearchQuery,
  type SearchOptions,
  type SearchIndex,
} from '@/lib/search';
import {
  type PublicationResource,
  type DatasetResource,
  type SoftwareTool,
} from '@/types';
import fs from 'fs';
import path from 'path';

// Cache for search index
let searchIndexCache: SearchIndex[] | null = null;
let lastIndexUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function loadResourcesData(): Promise<{
  publications: PublicationResource[];
  datasets: DatasetResource[];
  software: SoftwareTool[];
}> {
  const dataDir = path.join(process.cwd(), 'src', 'data', 'resources');
  
  try {
    const [publicationsData, datasetsData, softwareData] = await Promise.all([
      fs.promises.readFile(path.join(dataDir, 'publications.json'), 'utf8'),
      fs.promises.readFile(path.join(dataDir, 'datasets.json'), 'utf8'),
      fs.promises.readFile(path.join(dataDir, 'software.json'), 'utf8'),
    ]);

    return {
      publications: JSON.parse(publicationsData),
      datasets: JSON.parse(datasetsData),
      software: JSON.parse(softwareData),
    };
  } catch (error) {
    console.error('Error loading resources data:', error);
    return {
      publications: [],
      datasets: [],
      software: [],
    };
  }
}

async function buildSearchIndex(): Promise<SearchIndex[]> {
  try {
    const [faculty, research, news, events, resources] = await Promise.all([
      loadFacultyData(),
      loadResearchData(),
      loadNewsData(),
      loadEventsData(),
      loadResourcesData(),
    ]);

    const indices = [
      ...createFacultyIndex(faculty),
      ...createResearchIndex(research),
      ...createNewsIndex(news),
      ...createEventIndex(events),
      ...createPublicationIndex(resources.publications),
      ...createDatasetIndex(resources.datasets),
      ...createSoftwareIndex(resources.software),
    ];

    return indices;
  } catch (error) {
    console.error('Error building search index:', error);
    return [];
  }
}

async function getSearchIndex(): Promise<SearchIndex[]> {
  const now = Date.now();
  
  if (!searchIndexCache || (now - lastIndexUpdate) > CACHE_DURATION) {
    searchIndexCache = await buildSearchIndex();
    lastIndexUpdate = now;
  }
  
  return searchIndexCache;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);
    const minScore = parseFloat(searchParams.get('minScore') || '0.1');

    // Validate and sanitize query
    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        suggestions: [],
        facets: { types: [], tags: [] },
      });
    }

    const sanitizedQuery = sanitizeSearchQuery(query);
    if (sanitizedQuery.length < 2) {
      return NextResponse.json({
        error: 'Query must be at least 2 characters long',
      }, { status: 400 });
    }

    // Get search index
    const index = await getSearchIndex();
    
    // Perform search
    const searchOptions: SearchOptions = {
      query: sanitizedQuery,
      types: types.length > 0 ? types : undefined,
      tags: tags.length > 0 ? tags : undefined,
      limit,
      offset,
      minRelevanceScore: minScore,
    };

    const results = searchIndex(index, searchOptions);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// Endpoint for search suggestions/autocomplete
export async function POST(request: NextRequest) {
  try {
    const { query, limit = 5 } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ suggestions: [] });
    }

    const sanitizedQuery = sanitizeSearchQuery(query);
    if (sanitizedQuery.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const index = await getSearchIndex();
    const queryLower = sanitizedQuery.toLowerCase();
    
    // Generate suggestions from titles and tags
    const suggestions = new Set<string>();
    
    for (const item of index) {
      // Title suggestions
      if (item.title.toLowerCase().includes(queryLower) && 
          item.title.toLowerCase() !== queryLower) {
        suggestions.add(item.title);
      }
      
      // Tag suggestions
      for (const tag of item.tags) {
        if (tag.includes(queryLower) && tag !== queryLower) {
          suggestions.add(tag);
        }
      }
      
      if (suggestions.size >= limit * 2) break;
    }

    // Sort suggestions by relevance (shorter matches first)
    const sortedSuggestions = Array.from(suggestions)
      .sort((a, b) => {
        const aIndex = a.toLowerCase().indexOf(queryLower);
        const bIndex = b.toLowerCase().indexOf(queryLower);
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.length - b.length;
      })
      .slice(0, limit);

    return NextResponse.json({ suggestions: sortedSuggestions });
  } catch (error) {
    console.error('Search suggestions API error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}