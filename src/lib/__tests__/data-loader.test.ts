import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import {
  loadFacultyMembers,
  getFacultyMemberById,
  loadResearchProjects,
  getResearchProjectById,
  loadNewsArticles,
  getNewsArticleById,
  getNewsArticleBySlug,
  loadEvents,
  getEventById,
  filterFacultyMembers,
  filterResearchProjects,
  filterNewsArticles,
  filterEvents,
  sortData,
  paginateData,
  searchFacultyMembers,
  searchResearchProjects,
} from '../data-loader';
import { mockFacultyMember, mockResearchProject, mockNewsArticle, mockEvent } from '@/test/utils';

// Mock fs module
vi.mock('fs');
const mockFs = vi.mocked(fs);

// Mock data
const mockFacultyData = [mockFacultyMember];
const mockResearchData = [mockResearchProject];
const mockNewsData = [mockNewsArticle];
const mockEventsData = [mockEvent];

describe('Data Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadFacultyMembers', () => {
    it('should load faculty members successfully', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFacultyData));
      
      const result = await loadFacultyMembers();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Dr. John Doe');
    });

    it('should handle file read errors', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });
      
      const result = await loadFacultyMembers();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });

    it('should handle invalid JSON', async () => {
      mockFs.readFileSync.mockReturnValue('invalid json');
      
      const result = await loadFacultyMembers();
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getFacultyMemberById', () => {
    it('should find faculty member by id', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFacultyData));
      
      const result = await getFacultyMemberById('john-doe');
      
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('john-doe');
    });

    it('should return null for non-existent id', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFacultyData));
      
      const result = await getFacultyMemberById('non-existent');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('loadResearchProjects', () => {
    it('should load research projects successfully', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockResearchData));
      
      const result = await loadResearchProjects();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('AI in Healthcare Diagnostics');
    });
  });

  describe('getResearchProjectById', () => {
    it('should find research project by id', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockResearchData));
      
      const result = await getResearchProjectById('ai-healthcare');
      
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('ai-healthcare');
    });
  });

  describe('loadNewsArticles', () => {
    it('should load news articles successfully', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockNewsData));
      
      const result = await loadNewsArticles();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Breakthrough in AI Research');
    });
  });

  describe('getNewsArticleBySlug', () => {
    it('should find news article by slug', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockNewsData));
      
      const result = await getNewsArticleBySlug('breakthrough-ai-research');
      
      expect(result.success).toBe(true);
      expect(result.data?.slug).toBe('breakthrough-ai-research');
    });
  });

  describe('loadEvents', () => {
    it('should load events successfully', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockEventsData));
      
      const result = await loadEvents();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('AI Symposium 2024');
    });
  });

  describe('filterFacultyMembers', () => {
    it('should filter by query', () => {
      const result = filterFacultyMembers(mockFacultyData, { query: 'machine learning' });
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dr. John Doe');
    });

    it('should filter by tags', () => {
      const result = filterFacultyMembers(mockFacultyData, { tags: ['AI'] });
      
      expect(result).toHaveLength(1);
      expect(result[0].researchAreas).toContain('AI');
    });

    it('should return empty array for no matches', () => {
      const result = filterFacultyMembers(mockFacultyData, { query: 'nonexistent' });
      
      expect(result).toHaveLength(0);
    });
  });

  describe('filterResearchProjects', () => {
    it('should filter by query', () => {
      const result = filterResearchProjects(mockResearchData, { query: 'healthcare' });
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Healthcare');
    });

    it('should filter by status', () => {
      const result = filterResearchProjects(mockResearchData, { status: 'active' });
      
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('active');
    });

    it('should filter by tags', () => {
      const result = filterResearchProjects(mockResearchData, { tags: ['Healthcare'] });
      
      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('Healthcare');
    });
  });

  describe('filterNewsArticles', () => {
    it('should filter by query', () => {
      const result = filterNewsArticles(mockNewsData, { query: 'breakthrough' });
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Breakthrough');
    });

    it('should filter by tags', () => {
      const result = filterNewsArticles(mockNewsData, { tags: ['AI'] });
      
      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('AI');
    });

    it('should filter by date range', () => {
      const dateRange = {
        start: new Date('2023-01-01'),
        end: new Date('2023-12-31'),
      };
      const result = filterNewsArticles(mockNewsData, { dateRange });
      
      expect(result).toHaveLength(1);
    });
  });

  describe('filterEvents', () => {
    it('should filter by query', () => {
      const result = filterEvents(mockEventsData, { query: 'symposium' });
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Symposium');
    });

    it('should filter by category', () => {
      const result = filterEvents(mockEventsData, { category: 'conference' });
      
      expect(result).toHaveLength(1);
      expect(result[0].eventType).toBe('conference');
    });
  });

  describe('sortData', () => {
    const testData = [
      { name: 'Charlie', age: 30, date: new Date('2023-01-01') },
      { name: 'Alice', age: 25, date: new Date('2023-02-01') },
      { name: 'Bob', age: 35, date: new Date('2022-12-01') },
    ];

    it('should sort by string field ascending', () => {
      const result = sortData(testData, { field: 'name', direction: 'asc' });
      
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
    });

    it('should sort by string field descending', () => {
      const result = sortData(testData, { field: 'name', direction: 'desc' });
      
      expect(result[0].name).toBe('Charlie');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Alice');
    });

    it('should sort by number field', () => {
      const result = sortData(testData, { field: 'age', direction: 'asc' });
      
      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(35);
    });

    it('should sort by date field', () => {
      const result = sortData(testData, { field: 'date', direction: 'asc' });
      
      expect(result[0].date.getTime()).toBe(new Date('2022-12-01').getTime());
      expect(result[2].date.getTime()).toBe(new Date('2023-02-01').getTime());
    });
  });

  describe('paginateData', () => {
    const testData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    it('should paginate data correctly', () => {
      const result = paginateData(testData, 1, 10);
      
      expect(result.data.items).toHaveLength(10);
      expect(result.data.pagination.page).toBe(1);
      expect(result.data.pagination.limit).toBe(10);
      expect(result.data.pagination.total).toBe(25);
      expect(result.data.pagination.totalPages).toBe(3);
      expect(result.success).toBe(true);
    });

    it('should handle last page correctly', () => {
      const result = paginateData(testData, 3, 10);
      
      expect(result.data.items).toHaveLength(5);
      expect(result.data.pagination.page).toBe(3);
      expect(result.data.pagination.limit).toBe(10);
    });

    it('should handle empty data', () => {
      const result = paginateData([], 1, 10);
      
      expect(result.data.items).toHaveLength(0);
      expect(result.data.pagination.total).toBe(0);
      expect(result.data.pagination.totalPages).toBe(0);
    });
  });

  describe('searchFacultyMembers', () => {
    it('should search, filter, sort, and paginate faculty members', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFacultyData));
      
      const result = await searchFacultyMembers(
        { query: 'john' },
        { field: 'name', direction: 'asc' },
        1,
        5
      );
      
      expect(result.success).toBe(true);
      expect(result.data.items).toHaveLength(1);
      expect(result.data.pagination.page).toBe(1);
      expect(result.data.pagination.limit).toBe(5);
    });
  });

  describe('searchResearchProjects', () => {
    it('should search, filter, sort, and paginate research projects', async () => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockResearchData));
      
      const result = await searchResearchProjects(
        { query: 'healthcare' },
        { field: 'title', direction: 'asc' },
        1,
        5
      );
      
      expect(result.success).toBe(true);
      expect(result.data.items).toHaveLength(1);
      expect(result.data.pagination.page).toBe(1);
      expect(result.data.pagination.limit).toBe(5);
    });
  });
});