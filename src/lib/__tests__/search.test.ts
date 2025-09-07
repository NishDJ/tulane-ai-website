import {
  createFacultyIndex,
  createResearchIndex,
  searchIndex,
  sanitizeSearchQuery,
  extractTextFromMDX,
  validateContentStructure,
} from '../search';
import type { FacultyMember, ResearchProject } from '@/types';

// Mock data for testing
const mockFaculty: FacultyMember[] = [
  {
    id: 'john-doe',
    name: 'Dr. John Doe',
    title: 'Professor of AI',
    department: 'Computer Science',
    email: 'john@example.com',
    bio: 'Expert in machine learning and artificial intelligence',
    researchAreas: ['Machine Learning', 'AI', 'Data Science'],
    education: [],
    publications: [],
    profileImage: '/images/john.jpg',
    isActive: true,
  },
];

const mockResearch: ResearchProject[] = [
  {
    id: 'ai-project',
    title: 'AI in Healthcare',
    description: 'Developing AI solutions for medical diagnosis',
    status: 'active',
    startDate: new Date('2023-01-01'),
    principalInvestigator: 'Dr. John Doe',
    collaborators: [],
    tags: ['AI', 'Healthcare', 'Machine Learning'],
    images: [],
    featured: true,
  },
];

describe('Search functionality', () => {
  describe('Index creation', () => {
    test('creates faculty search index', () => {
      const index = createFacultyIndex(mockFaculty);
      
      expect(index).toHaveLength(1);
      expect(index[0]).toMatchObject({
        id: 'john-doe',
        type: 'faculty',
        title: 'Dr. John Doe',
        content: 'Expert in machine learning and artificial intelligence',
      });
      expect(index[0].searchableText).toContain('machine learning');
      expect(index[0].tags).toContain('machine learning');
    });

    test('creates research search index', () => {
      const index = createResearchIndex(mockResearch);
      
      expect(index).toHaveLength(1);
      expect(index[0]).toMatchObject({
        id: 'ai-project',
        type: 'research',
        title: 'AI in Healthcare',
        content: 'Developing AI solutions for medical diagnosis',
      });
      expect(index[0].searchableText).toContain('healthcare');
      expect(index[0].tags).toContain('ai');
    });
  });

  describe('Search algorithm', () => {
    test('searches across faculty and research', () => {
      const facultyIndex = createFacultyIndex(mockFaculty);
      const researchIndex = createResearchIndex(mockResearch);
      const combinedIndex = [...facultyIndex, ...researchIndex];

      const results = searchIndex(combinedIndex, {
        query: 'AI machine learning',
        limit: 10,
      });

      expect(results.results).toHaveLength(2);
      expect(results.total).toBe(2);
      expect(results.query).toBe('AI machine learning');
      
      // Results should be sorted by relevance
      expect(results.results[0].relevanceScore).toBeGreaterThan(0);
    });

    test('filters by type', () => {
      const facultyIndex = createFacultyIndex(mockFaculty);
      const researchIndex = createResearchIndex(mockResearch);
      const combinedIndex = [...facultyIndex, ...researchIndex];

      const results = searchIndex(combinedIndex, {
        query: 'AI',
        types: ['faculty'],
        limit: 10,
      });

      expect(results.results).toHaveLength(1);
      expect(results.results[0].type).toBe('faculty');
    });

    test('filters by tags', () => {
      const facultyIndex = createFacultyIndex(mockFaculty);
      const researchIndex = createResearchIndex(mockResearch);
      const combinedIndex = [...facultyIndex, ...researchIndex];

      const results = searchIndex(combinedIndex, {
        query: 'AI',
        tags: ['healthcare'],
        limit: 10,
      });

      expect(results.results).toHaveLength(1);
      expect(results.results[0].type).toBe('research');
    });

    test('returns empty results for empty query', () => {
      const index = createFacultyIndex(mockFaculty);
      const results = searchIndex(index, { query: '' });

      expect(results.results).toHaveLength(0);
      expect(results.total).toBe(0);
    });
  });

  describe('Utility functions', () => {
    test('sanitizes search query', () => {
      expect(sanitizeSearchQuery('  hello world  ')).toBe('hello world');
      expect(sanitizeSearchQuery('hello<script>alert("xss")</script>')).toBe('helloscriptalert xss script');
      expect(sanitizeSearchQuery('hello & world')).toBe('hello world');
    });

    test('extracts text from MDX', () => {
      const mdx = `---
title: Test
---

# Heading

This is **bold** and *italic* text.

\`\`\`javascript
console.log('code');
\`\`\`

[Link](http://example.com)`;

      const text = extractTextFromMDX(mdx);
      expect(text).toContain('Heading');
      expect(text).toContain('This is bold and italic text');
      expect(text).toContain('Link');
      expect(text).not.toContain('console.log');
      expect(text).not.toContain('```');
    });

    test('validates content structure', () => {
      const validFaculty = [{ id: '1', name: 'John', title: 'Prof' }];
      const invalidFaculty = [{ name: 'John' }]; // missing id and title

      expect(validateContentStructure(validFaculty, 'faculty')).toBe(true);
      expect(validateContentStructure(invalidFaculty, 'faculty')).toBe(false);
      expect(validateContentStructure(null, 'faculty')).toBe(false);
      expect(validateContentStructure('not an array', 'faculty')).toBe(false);
    });
  });

  describe('Search result generation', () => {
    test('generates highlights', () => {
      const index = createFacultyIndex(mockFaculty);
      const results = searchIndex(index, {
        query: 'machine learning',
        limit: 1,
      });

      expect(results.results[0].highlights.length).toBeGreaterThan(0);
      expect(results.results[0].highlights[0]).toContain('<mark>');
    });

    test('generates facets', () => {
      const facultyIndex = createFacultyIndex(mockFaculty);
      const researchIndex = createResearchIndex(mockResearch);
      const combinedIndex = [...facultyIndex, ...researchIndex];

      const results = searchIndex(combinedIndex, {
        query: 'AI',
        limit: 10,
      });

      expect(results.facets.types.length).toBeGreaterThan(0);
      expect(results.facets.tags.length).toBeGreaterThan(0);
      
      const facultyFacet = results.facets.types.find(f => f.type === 'faculty');
      const researchFacet = results.facets.types.find(f => f.type === 'research');
      
      expect(facultyFacet?.count).toBe(1);
      expect(researchFacet?.count).toBe(1);
    });
  });
});