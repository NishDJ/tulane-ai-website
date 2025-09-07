import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import {
  validateFacultyMember,
  validateResearchProject,
  validateNewsArticle,
  validateEvent,
  ValidationError,
  validateFacultyMembers,
  validateResearchProjects,
  validateNewsArticles,
  validateEvents,
  transformFacultyMemberDates,
  transformResearchProjectDates,
  transformNewsArticleDates,
  transformEventDates,
  createApiResponse,
  createPaginatedResponse,
} from '../data-validation';

// Test data that should pass validation
const validFacultyMember = {
  id: 'test-faculty',
  name: 'Dr. Test Faculty',
  title: 'Professor',
  department: 'Test Department',
  email: 'test@tulane.edu',
  bio: 'Test bio',
  researchAreas: ['AI', 'Machine Learning'],
  education: [
    {
      degree: 'Ph.D.',
      institution: 'Test University',
      year: 2010,
    },
  ],
  publications: [
    {
      title: 'Test Publication',
      authors: ['Test Author'],
      journal: 'Test Journal',
      year: 2023,
    },
  ],
  profileImage: '/test-image.jpg',
  isActive: true,
};

const validResearchProject = {
  id: 'test-project',
  title: 'Test Project',
  description: 'Test description',
  status: 'active' as const,
  startDate: new Date('2023-01-01'),
  principalInvestigator: 'Dr. Test',
  collaborators: ['Dr. Collaborator'],
  tags: ['AI', 'Research'],
  images: ['/test-image.jpg'],
  featured: true,
};

const validNewsArticle = {
  id: 'test-article',
  title: 'Test Article',
  slug: 'test-article',
  excerpt: 'Test excerpt',
  content: 'Test content',
  author: 'Test Author',
  publishDate: new Date('2023-01-01'),
  lastModified: new Date('2023-01-01'),
  tags: ['News'],
  featured: false,
};

const validEvent = {
  id: 'test-event',
  title: 'Test Event',
  description: 'Test description',
  startDate: new Date('2024-01-01'),
  location: 'Test Location',
  eventType: 'seminar' as const,
  tags: ['Event'],
};

describe('Data Validation', () => {
  describe('validateFacultyMember', () => {
    it('should validate valid faculty member', () => {
      expect(() => validateFacultyMember(validFacultyMember)).not.toThrow();
      const result = validateFacultyMember(validFacultyMember);
      expect(result.id).toBe('test-faculty');
      expect(result.name).toBe('Dr. Test Faculty');
    });

    it('should reject invalid faculty member', () => {
      expect(() => validateFacultyMember({ id: 'test', name: '' })).toThrow(ZodError);
    });

    it('should reject faculty member with invalid email', () => {
      const invalidFaculty = { ...validFacultyMember, email: 'invalid-email' };
      expect(() => validateFacultyMember(invalidFaculty)).toThrow(ZodError);
    });
  });

  describe('validateResearchProject', () => {
    it('should validate valid research project', () => {
      expect(() => validateResearchProject(validResearchProject)).not.toThrow();
      const result = validateResearchProject(validResearchProject);
      expect(result.id).toBe('test-project');
      expect(result.status).toBe('active');
    });

    it('should reject invalid research project', () => {
      expect(() => validateResearchProject({ id: 'test' })).toThrow(ZodError);
    });

    it('should reject project with invalid status', () => {
      const invalidProject = { ...validResearchProject, status: 'invalid' };
      expect(() => validateResearchProject(invalidProject)).toThrow(ZodError);
    });
  });

  describe('validateNewsArticle', () => {
    it('should validate valid news article', () => {
      expect(() => validateNewsArticle(validNewsArticle)).not.toThrow();
      const result = validateNewsArticle(validNewsArticle);
      expect(result.id).toBe('test-article');
      expect(result.slug).toBe('test-article');
    });

    it('should reject invalid news article', () => {
      expect(() => validateNewsArticle({ id: 'test' })).toThrow(ZodError);
    });
  });

  describe('validateEvent', () => {
    it('should validate valid event', () => {
      expect(() => validateEvent(validEvent)).not.toThrow();
      const result = validateEvent(validEvent);
      expect(result.id).toBe('test-event');
      expect(result.eventType).toBe('seminar');
    });

    it('should reject invalid event', () => {
      expect(() => validateEvent({ id: 'test' })).toThrow(ZodError);
    });

    it('should reject event with invalid type', () => {
      const invalidEvent = { ...validEvent, eventType: 'invalid' };
      expect(() => validateEvent(invalidEvent)).toThrow(ZodError);
    });
  });

  describe('Array validators', () => {
    it('should validate faculty members array', () => {
      expect(() => validateFacultyMembers([validFacultyMember])).not.toThrow();
      const result = validateFacultyMembers([validFacultyMember]);
      expect(result).toHaveLength(1);
    });

    it('should validate research projects array', () => {
      expect(() => validateResearchProjects([validResearchProject])).not.toThrow();
      const result = validateResearchProjects([validResearchProject]);
      expect(result).toHaveLength(1);
    });

    it('should validate news articles array', () => {
      expect(() => validateNewsArticles([validNewsArticle])).not.toThrow();
      const result = validateNewsArticles([validNewsArticle]);
      expect(result).toHaveLength(1);
    });

    it('should validate events array', () => {
      expect(() => validateEvents([validEvent])).not.toThrow();
      const result = validateEvents([validEvent]);
      expect(result).toHaveLength(1);
    });
  });

  describe('Date transformers', () => {
    it('should transform faculty member dates', () => {
      const facultyWithStringDates = {
        ...validFacultyMember,
        education: [{ ...validFacultyMember.education[0] }],
        publications: [{ ...validFacultyMember.publications[0] }],
      };
      
      const result = transformFacultyMemberDates(facultyWithStringDates);
      expect(result).toBeDefined();
    });

    it('should transform research project dates', () => {
      const projectWithStringDates = {
        ...validResearchProject,
        startDate: '2023-01-01',
      };
      
      const result = transformResearchProjectDates(projectWithStringDates as any);
      expect(result.startDate).toBeInstanceOf(Date);
    });

    it('should transform news article dates', () => {
      const articleWithStringDates = {
        ...validNewsArticle,
        publishDate: '2023-01-01',
        lastModified: '2023-01-01',
      };
      
      const result = transformNewsArticleDates(articleWithStringDates as any);
      expect(result.publishDate).toBeInstanceOf(Date);
      expect(result.lastModified).toBeInstanceOf(Date);
    });

    it('should transform event dates', () => {
      const eventWithStringDates = {
        ...validEvent,
        startDate: '2024-01-01',
      };
      
      const result = transformEventDates(eventWithStringDates as any);
      expect(result.startDate).toBeInstanceOf(Date);
    });
  });

  describe('API response helpers', () => {
    it('should create successful API response', () => {
      const response = createApiResponse(['data'], true, 'Success message');
      
      expect(response.success).toBe(true);
      expect(response.data).toEqual(['data']);
      expect(response.message).toBe('Success message');
      expect(response.error).toBeUndefined();
    });

    it('should create error API response', () => {
      const response = createApiResponse([], false, undefined, 'Error message');
      
      expect(response.success).toBe(false);
      expect(response.data).toEqual([]);
      expect(response.error).toBe('Error message');
      expect(response.message).toBeUndefined();
    });

    it('should create paginated response', () => {
      const data = [1, 2, 3];
      const response = createPaginatedResponse(data, 1, 10, 25);
      
      expect(response.data.items).toEqual(data);
      expect(response.data.pagination.page).toBe(1);
      expect(response.data.pagination.limit).toBe(10);
      expect(response.data.pagination.total).toBe(25);
      expect(response.data.pagination.totalPages).toBe(3);
      expect(response.success).toBe(true);
    });
  });
});