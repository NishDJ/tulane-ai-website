import {
  type FacultyMember,
  type ResearchProject,
  type NewsArticle,
  type Event,
  type SearchFilters,
  type SortOptions,
} from '@/types';

// Client-side filtering utilities (no fs dependency)
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

// Client-side sorting utilities
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