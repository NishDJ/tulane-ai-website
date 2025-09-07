import {
  type FacultyMember,
  type ResearchProject,
  type NewsArticle,
  type Event,
  type PublicationResource,
  type DatasetResource,
  type SoftwareTool,
} from '@/types';

// Search result types
export interface SearchResult {
  id: string;
  type: 'faculty' | 'research' | 'news' | 'event' | 'publication' | 'dataset' | 'software';
  title: string;
  description: string;
  url: string;
  relevanceScore: number;
  highlights: string[];
  metadata: Record<string, unknown>;
}

export interface SearchIndex {
  id: string;
  type: string;
  title: string;
  content: string;
  searchableText: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface SearchOptions {
  query: string;
  types?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
  minRelevanceScore?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  suggestions: string[];
  facets: {
    types: Array<{ type: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  };
}

// Search indexing functions
export function createFacultyIndex(faculty: FacultyMember[]): SearchIndex[] {
  return faculty.map(member => ({
    id: member.id,
    type: 'faculty',
    title: member.name,
    content: member.bio,
    searchableText: [
      member.name,
      member.title,
      member.department,
      member.bio,
      ...member.researchAreas,
      ...member.education.map(edu => `${edu.degree} ${edu.institution} ${edu.field || ''}`),
      ...member.publications.map(pub => `${pub.title} ${pub.journal}`)
    ].join(' ').toLowerCase(),
    tags: member.researchAreas.map(area => area.toLowerCase()),
    metadata: {
      title: member.title,
      department: member.department,
      email: member.email,
      profileImage: member.profileImage,
      isActive: member.isActive,
    },
  }));
}

export function createResearchIndex(projects: ResearchProject[]): SearchIndex[] {
  return projects.map(project => ({
    id: project.id,
    type: 'research',
    title: project.title,
    content: project.description,
    searchableText: [
      project.title,
      project.description,
      project.principalInvestigator,
      ...project.collaborators,
      project.fundingSource || '',
      ...project.tags,
      ...(project.publications?.map(pub => `${pub.title} ${pub.journal}`) || [])
    ].join(' ').toLowerCase(),
    tags: project.tags.map(tag => tag.toLowerCase()),
    metadata: {
      status: project.status,
      principalInvestigator: project.principalInvestigator,
      collaborators: project.collaborators,
      startDate: project.startDate,
      endDate: project.endDate,
      featured: project.featured,
      images: project.images,
    },
  }));
}

export function createNewsIndex(articles: NewsArticle[]): SearchIndex[] {
  return articles.map(article => ({
    id: article.id,
    type: 'news',
    title: article.title,
    content: article.excerpt,
    searchableText: [
      article.title,
      article.excerpt,
      article.content,
      article.author,
      ...article.tags
    ].join(' ').toLowerCase(),
    tags: article.tags.map(tag => tag.toLowerCase()),
    metadata: {
      slug: article.slug,
      author: article.author,
      publishDate: article.publishDate,
      featuredImage: article.featuredImage,
      featured: article.featured,
    },
  }));
}

export function createEventIndex(events: Event[]): SearchIndex[] {
  return events.map(event => ({
    id: event.id,
    type: 'event',
    title: event.title,
    content: event.description,
    searchableText: [
      event.title,
      event.description,
      event.location,
      event.eventType,
      ...(event.speakers || []),
      ...event.tags
    ].join(' ').toLowerCase(),
    tags: event.tags.map(tag => tag.toLowerCase()),
    metadata: {
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      eventType: event.eventType,
      registrationUrl: event.registrationUrl,
      capacity: event.capacity,
      speakers: event.speakers,
    },
  }));
}

export function createPublicationIndex(publications: PublicationResource[]): SearchIndex[] {
  return publications.map(pub => ({
    id: pub.id,
    type: 'publication',
    title: pub.title,
    content: pub.abstract,
    searchableText: [
      pub.title,
      pub.abstract,
      ...pub.authors,
      pub.journal,
      pub.category,
      ...pub.tags
    ].join(' ').toLowerCase(),
    tags: pub.tags.map(tag => tag.toLowerCase()),
    metadata: {
      authors: pub.authors,
      journal: pub.journal,
      year: pub.year,
      doi: pub.doi,
      url: pub.url,
      pdfUrl: pub.pdfUrl,
      category: pub.category,
      featured: pub.featured,
      openAccess: pub.openAccess,
      citationCount: pub.citationCount,
    },
  }));
}

export function createDatasetIndex(datasets: DatasetResource[]): SearchIndex[] {
  return datasets.map(dataset => ({
    id: dataset.id,
    type: 'dataset',
    title: dataset.title,
    content: dataset.description,
    searchableText: [
      dataset.title,
      dataset.description,
      dataset.category,
      ...dataset.format,
      ...dataset.tags,
      dataset.license || ''
    ].join(' ').toLowerCase(),
    tags: dataset.tags.map(tag => tag.toLowerCase()),
    metadata: {
      size: dataset.size,
      format: dataset.format,
      accessLevel: dataset.accessLevel,
      downloadUrl: dataset.downloadUrl,
      category: dataset.category,
      featured: dataset.featured,
      version: dataset.version,
      license: dataset.license,
    },
  }));
}

export function createSoftwareIndex(software: SoftwareTool[]): SearchIndex[] {
  return software.map(tool => ({
    id: tool.id,
    type: 'software',
    title: tool.title,
    content: tool.description,
    searchableText: [
      tool.title,
      tool.description,
      tool.category,
      ...tool.platform,
      ...tool.features,
      ...tool.tags,
      tool.license
    ].join(' ').toLowerCase(),
    tags: tool.tags.map(tag => tag.toLowerCase()),
    metadata: {
      version: tool.version,
      category: tool.category,
      url: tool.url,
      githubUrl: tool.githubUrl,
      documentationUrl: tool.documentationUrl,
      downloadUrl: tool.downloadUrl,
      license: tool.license,
      platform: tool.platform,
      featured: tool.featured,
      maintainers: tool.maintainers,
    },
  }));
}

// Search algorithm implementation
export function searchIndex(index: SearchIndex[], options: SearchOptions): SearchResponse {
  const { query, types, tags, limit = 10, offset = 0, minRelevanceScore = 0.1 } = options;
  
  if (!query.trim()) {
    return {
      results: [],
      total: 0,
      query,
      suggestions: [],
      facets: { types: [], tags: [] },
    };
  }

  const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  // Filter by type if specified
  let filteredIndex = index;
  if (types && types.length > 0) {
    filteredIndex = filteredIndex.filter(item => types.includes(item.type));
  }
  
  // Filter by tags if specified
  if (tags && tags.length > 0) {
    filteredIndex = filteredIndex.filter(item =>
      tags.some(tag => item.tags.includes(tag.toLowerCase()))
    );
  }

  // Calculate relevance scores
  const scoredResults = filteredIndex.map(item => {
    const score = calculateRelevanceScore(item, queryTerms);
    const highlights = generateHighlights(item, queryTerms);
    
    return {
      ...item,
      relevanceScore: score,
      highlights,
    };
  });

  // Filter by minimum relevance score and sort
  const relevantResults = scoredResults
    .filter(item => item.relevanceScore >= minRelevanceScore)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Generate search results
  const paginatedResults = relevantResults.slice(offset, offset + limit);
  const searchResults: SearchResult[] = paginatedResults.map(item => ({
    id: item.id,
    type: item.type as SearchResult['type'],
    title: item.title,
    description: item.content,
    url: generateResultUrl(item.type, item.id, item.metadata),
    relevanceScore: item.relevanceScore,
    highlights: item.highlights,
    metadata: item.metadata,
  }));

  // Generate facets
  const typeFacets = generateTypeFacets(relevantResults);
  const tagFacets = generateTagFacets(relevantResults);

  // Generate suggestions
  const suggestions = generateSuggestions(query, index);

  return {
    results: searchResults,
    total: relevantResults.length,
    query,
    suggestions,
    facets: {
      types: typeFacets,
      tags: tagFacets,
    },
  };
}

// Relevance scoring algorithm
function calculateRelevanceScore(item: SearchIndex, queryTerms: string[]): number {
  let score = 0;
  const titleWeight = 3;
  const contentWeight = 1;
  const tagWeight = 2;

  for (const term of queryTerms) {
    // Title matches (highest weight)
    if (item.title.toLowerCase().includes(term)) {
      score += titleWeight;
      // Exact title match bonus
      if (item.title.toLowerCase() === term) {
        score += titleWeight;
      }
    }

    // Content matches
    const contentMatches = (item.searchableText.match(new RegExp(term, 'gi')) || []).length;
    score += contentMatches * contentWeight;

    // Tag matches
    if (item.tags.some(tag => tag.includes(term))) {
      score += tagWeight;
    }
  }

  // Normalize score by query length
  return score / queryTerms.length;
}

// Highlight generation
function generateHighlights(item: SearchIndex, queryTerms: string[]): string[] {
  const highlights: string[] = [];
  const maxHighlights = 3;
  const contextLength = 100;

  for (const term of queryTerms) {
    const regex = new RegExp(`(.{0,${contextLength}})(${term})(.{0,${contextLength}})`, 'gi');
    const matches = item.searchableText.match(regex);
    
    if (matches) {
      matches.slice(0, maxHighlights - highlights.length).forEach(match => {
        const highlighted = match.replace(
          new RegExp(`(${term})`, 'gi'),
          '<mark>$1</mark>'
        );
        highlights.push(`...${highlighted}...`);
      });
    }

    if (highlights.length >= maxHighlights) break;
  }

  return highlights;
}

// URL generation for search results
function generateResultUrl(type: string, id: string, metadata: Record<string, unknown>): string {
  switch (type) {
    case 'faculty':
      return `/faculty/${id}`;
    case 'research':
      return `/research/${id}`;
    case 'news':
      return `/news/${metadata.slug || id}`;
    case 'event':
      return `/events#${id}`;
    case 'publication':
      return `/resources/publications#${id}`;
    case 'dataset':
      return `/resources#${id}`;
    case 'software':
      return `/resources#${id}`;
    default:
      return '/';
  }
}

// Facet generation
function generateTypeFacets(results: Array<{ type: string }>): Array<{ type: string; count: number }> {
  const typeCounts = results.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

function generateTagFacets(results: Array<{ tags: string[] }>): Array<{ tag: string; count: number }> {
  const tagCounts = results.reduce((acc, item) => {
    item.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Limit to top 20 tags
}

// Search suggestions
function generateSuggestions(query: string, index: SearchIndex[]): string[] {
  const suggestions: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Find similar titles and tags
  const candidates = new Set<string>();
  
  index.forEach(item => {
    // Add similar titles
    if (item.title.toLowerCase().includes(queryLower) && item.title.toLowerCase() !== queryLower) {
      candidates.add(item.title);
    }
    
    // Add similar tags
    item.tags.forEach(tag => {
      if (tag.includes(queryLower) && tag !== queryLower) {
        candidates.add(tag);
      }
    });
  });

  return Array.from(candidates).slice(0, 5);
}

// Content parsing utilities for MDX and structured data
export function extractTextFromMDX(content: string): string {
  // Remove MDX/Markdown syntax and extract plain text
  return content
    .replace(/^---[\s\S]*?---/m, '') // Remove frontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/~~([^~]+)~~/g, '$1') // Remove strikethrough
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/\n{2,}/g, '\n') // Normalize line breaks
    .trim();
}

export function validateContentStructure(content: unknown, type: string): boolean {
  try {
    switch (type) {
      case 'faculty':
        return Array.isArray(content) && content.every(item => 
          typeof item === 'object' && 
          item !== null && 
          'id' in item && 
          'name' in item && 
          'title' in item
        );
      case 'research':
        return Array.isArray(content) && content.every(item => 
          typeof item === 'object' && 
          item !== null && 
          'id' in item && 
          'title' in item && 
          'description' in item
        );
      case 'news':
        return Array.isArray(content) && content.every(item => 
          typeof item === 'object' && 
          item !== null && 
          'id' in item && 
          'title' in item && 
          'content' in item
        );
      default:
        return false;
    }
  } catch {
    return false;
  }
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/[^\w\s-]/g, ' ') // Keep only alphanumeric, spaces, and hyphens
    .replace(/\s+/g, ' ') // Normalize spaces
    .slice(0, 100); // Limit length
}