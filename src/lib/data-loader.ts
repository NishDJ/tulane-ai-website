import fs from 'fs';
import path from 'path';
import {
  validateFacultyMembers,
  validateResearchProjects,
  validateNewsArticles,
  validateEvents,
  transformFacultyMemberDates,
  transformResearchProjectDates,
  transformNewsArticleDates,
  transformEventDates,
  handleValidationError,
  createApiResponse,
  createPaginatedResponse,
} from './data-validation';
import {
  type FacultyMember,
  type ResearchProject,
  type NewsArticle,
  type Event,
  type Program,
  type ApiResponse,
  type PaginatedResponse,
  type SearchFilters,
  type SortOptions,
} from '@/types';

// Base data directory path
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

// Generic data loader function
async function loadJsonData<T>(filePath: string, validator: (data: unknown) => T): Promise<T> {
  try {
    const fullPath = path.join(DATA_DIR, filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const rawData = JSON.parse(fileContents);
    
    return validator(rawData);
  } catch (error) {
    const validationError = handleValidationError(error);
    console.error(`Error loading data from ${filePath}:`, validationError.message);
    throw validationError;
  }
}

// Faculty data loading
export async function loadFacultyMembers(): Promise<ApiResponse<FacultyMember[]>> {
  try {
    const rawData = await loadJsonData('faculty/sample.json', validateFacultyMembers);
    const facultyMembers = rawData.map(transformFacultyMemberDates);
    
    return createApiResponse(facultyMembers, true, 'Faculty members loaded successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error loading faculty data';
    return createApiResponse([], false, undefined, errorMessage);
  }
}

export async function getFacultyMemberById(id: string): Promise<ApiResponse<FacultyMember | null>> {
  try {
    const response = await loadFacultyMembers();
    if (!response.success) {
      return createApiResponse(null, false, undefined, response.error);
    }
    
    const facultyMember = response.data.find(member => member.id === id) || null;
    const message = facultyMember ? 'Faculty member found' : 'Faculty member not found';
    
    return createApiResponse(facultyMember, true, message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createApiResponse(null, false, undefined, errorMessage);
  }
}

// Research projects data loading
export async function loadResearchProjects(): Promise<ApiResponse<ResearchProject[]>> {
  try {
    const rawData = await loadJsonData('research/sample.json', validateResearchProjects);
    
    return createApiResponse(rawData, true, 'Research projects loaded successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error loading research data';
    return createApiResponse([], false, undefined, errorMessage);
  }
}

export async function getResearchProjectById(id: string): Promise<ApiResponse<ResearchProject | null>> {
  try {
    const response = await loadResearchProjects();
    if (!response.success) {
      return createApiResponse(null, false, undefined, response.error);
    }
    
    const project = response.data.find(proj => proj.id === id) || null;
    const message = project ? 'Research project found' : 'Research project not found';
    
    return createApiResponse(project, true, message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createApiResponse(null, false, undefined, errorMessage);
  }
}

// News articles data loading
export async function loadNewsArticles(): Promise<ApiResponse<NewsArticle[]>> {
  try {
    const rawData = await loadJsonData('news/sample.json', validateNewsArticles);
    
    return createApiResponse(rawData, true, 'News articles loaded successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error loading news data';
    return createApiResponse([], false, undefined, errorMessage);
  }
}

export async function getNewsArticleById(id: string): Promise<ApiResponse<NewsArticle | null>> {
  try {
    const response = await loadNewsArticles();
    if (!response.success) {
      return createApiResponse(null, false, undefined, response.error);
    }
    
    const article = response.data.find(art => art.id === id) || null;
    const message = article ? 'News article found' : 'News article not found';
    
    return createApiResponse(article, true, message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createApiResponse(null, false, undefined, errorMessage);
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<ApiResponse<NewsArticle | null>> {
  try {
    const response = await loadNewsArticles();
    if (!response.success) {
      return createApiResponse(null, false, undefined, response.error);
    }
    
    const article = response.data.find(art => art.slug === slug) || null;
    const message = article ? 'News article found' : 'News article not found';
    
    return createApiResponse(article, true, message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createApiResponse(null, false, undefined, errorMessage);
  }
}

// Events data loading
export async function loadEvents(): Promise<ApiResponse<Event[]>> {
  try {
    const rawData = await loadJsonData('events/sample.json', validateEvents);
    
    return createApiResponse(rawData, true, 'Events loaded successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error loading events data';
    return createApiResponse([], false, undefined, errorMessage);
  }
}

export async function getEventById(id: string): Promise<ApiResponse<Event | null>> {
  try {
    const response = await loadEvents();
    if (!response.success) {
      return createApiResponse(null, false, undefined, response.error);
    }
    
    const event = response.data.find(evt => evt.id === id) || null;
    const message = event ? 'Event found' : 'Event not found';
    
    return createApiResponse(event, true, message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createApiResponse(null, false, undefined, errorMessage);
  }
}

// Filtering and search utilities
export function filterFacultyMembers(
  members: FacultyMember[],
  filters: SearchFilters
): FacultyMember[] {
  let filtered = [...members];
  
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
  
  return filtered;
}

export function filterResearchProjects(
  projects: ResearchProject[],
  filters: SearchFilters
): ResearchProject[] {
  let filtered = [...projects];
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.principalInvestigator.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(project =>
      filters.tags!.some(tag =>
        project.tags.some(projectTag => projectTag.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }
  
  if (filters.status) {
    filtered = filtered.filter(project => project.status === filters.status);
  }
  
  return filtered;
}

export function filterNewsArticles(
  articles: NewsArticle[],
  filters: SearchFilters
): NewsArticle[] {
  let filtered = [...articles];
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(article =>
      filters.tags!.some(tag =>
        article.tags.some(articleTag => articleTag.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }
  
  if (filters.dateRange) {
    filtered = filtered.filter(article =>
      article.publishDate >= filters.dateRange!.start &&
      article.publishDate <= filters.dateRange!.end
    );
  }
  
  return filtered;
}

export function filterEvents(events: Event[], filters: SearchFilters): Event[] {
  let filtered = [...events];
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(event =>
      filters.tags!.some(tag =>
        event.tags.some(eventTag => eventTag.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }
  
  if (filters.category) {
    filtered = filtered.filter(event => event.eventType === filters.category);
  }
  
  if (filters.dateRange) {
    filtered = filtered.filter(event =>
      event.startDate >= filters.dateRange!.start &&
      event.startDate <= filters.dateRange!.end
    );
  }
  
  return filtered;
}

// Sorting utilities
export function sortData<T>(
  data: T[],
  sortOptions: SortOptions
): T[] {
  return [...data].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[sortOptions.field];
    const bValue = (b as Record<string, unknown>)[sortOptions.field];
    
    if (aValue === bValue) return 0;
    
    // Handle different types of values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    }
    
    // Fallback to string comparison
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortOptions.direction === 'asc' ? comparison : -comparison;
  });
}

// Pagination utilities
export function paginateData<T>(
  data: T[],
  page: number,
  limit: number
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = data.slice(startIndex, endIndex);
  
  return createPaginatedResponse(items, page, limit, data.length);
}

// Combined search, filter, sort, and paginate function
export async function searchFacultyMembers(
  filters: SearchFilters = {},
  sortOptions: SortOptions = { field: 'name', direction: 'asc' },
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<FacultyMember>> {
  try {
    const response = await loadFacultyMembers();
    if (!response.success) {
      return createPaginatedResponse([], page, limit, 0, false, undefined, response.error);
    }
    
    let filtered = filterFacultyMembers(response.data, filters);
    filtered = sortData(filtered, sortOptions);
    
    return paginateData(filtered, page, limit);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createPaginatedResponse([], page, limit, 0, false, undefined, errorMessage);
  }
}

export async function searchResearchProjects(
  filters: SearchFilters = {},
  sortOptions: SortOptions = { field: 'startDate', direction: 'desc' },
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<ResearchProject>> {
  try {
    const response = await loadResearchProjects();
    if (!response.success) {
      return createPaginatedResponse([], page, limit, 0, false, undefined, response.error);
    }
    
    let filtered = filterResearchProjects(response.data, filters);
    filtered = sortData(filtered, sortOptions);
    
    return paginateData(filtered, page, limit);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createPaginatedResponse([], page, limit, 0, false, undefined, errorMessage);
  }
}

// Simple data loading functions for API routes (without ApiResponse wrapper)
export async function loadNewsData(): Promise<NewsArticle[]> {
  try {
    const rawData = await loadJsonData('news/sample.json', validateNewsArticles);
    return rawData.map(transformNewsArticleDates);
  } catch (error) {
    console.error('Error loading news data:', error);
    return [];
  }
}

export async function loadEventsData(): Promise<Event[]> {
  try {
    const rawData = await loadJsonData('events/sample.json', validateEvents);
    return rawData.map(transformEventDates);
  } catch (error) {
    console.error('Error loading events data:', error);
    return [];
  }
}

export async function loadFacultyData(): Promise<FacultyMember[]> {
  try {
    const rawData = await loadJsonData('faculty/sample.json', validateFacultyMembers);
    return rawData.map(transformFacultyMemberDates);
  } catch (error) {
    console.error('Error loading faculty data:', error);
    return [];
  }
}

export async function loadResearchData(): Promise<ResearchProject[]> {
  try {
    const rawData = await loadJsonData('research/sample.json', validateResearchProjects);
    return rawData.map(transformResearchProjectDates);
  } catch (error) {
    console.error('Error loading research data:', error);
    return [];
  }
}

export async function loadPrograms(): Promise<Program[]> {
  try {
    const fullPath = path.join(DATA_DIR, 'programs/sample.json');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const rawData = JSON.parse(fileContents);
    
    // Transform date strings to Date objects
    return rawData.map((program: unknown) => {
      const p = program as Record<string, unknown>;
      const transformed = {
        ...p,
        applicationDeadline: p.applicationDeadline ? new Date(p.applicationDeadline as string) : undefined,
        courses: (p.courses as unknown[]).map((course: unknown) => ({
          ...(course as Record<string, unknown>),
        })),
      };
      return transformed as unknown as Program;
    });
  } catch (error) {
    console.error('Error loading programs data:', error);
    return [];
  }
}