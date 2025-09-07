import { z } from 'zod';
import {
  FacultyMemberSchema,
  ResearchProjectSchema,
  NewsArticleSchema,
  EventSchema,
  ContactFormSchema,
  NewsletterSignupSchema,
  SearchFiltersSchema,
  type FacultyMember,
  type ResearchProject,
  type NewsArticle,
  type Event,
  type ContactFormData,
  type NewsletterSignupData,
  type SearchFilters,
  type ApiResponse,
  type PaginatedResponse,
} from '@/types';

// Data validation functions
export function validateFacultyMember(data: unknown): FacultyMember {
  return FacultyMemberSchema.parse(data);
}

export function validateResearchProject(data: unknown): ResearchProject {
  return ResearchProjectSchema.parse(data);
}

export function validateNewsArticle(data: unknown): NewsArticle {
  return NewsArticleSchema.parse(data);
}

export function validateEvent(data: unknown): Event {
  return EventSchema.parse(data);
}

export function validateContactForm(data: unknown): ContactFormData {
  return ContactFormSchema.parse(data);
}

export function validateNewsletterSignup(data: unknown): NewsletterSignupData {
  return NewsletterSignupSchema.parse(data);
}

export function validateSearchFilters(data: unknown): SearchFilters {
  return SearchFiltersSchema.parse(data);
}

// Array validation functions
export function validateFacultyMembers(data: unknown): FacultyMember[] {
  const arraySchema = z.array(FacultyMemberSchema);
  return arraySchema.parse(data);
}

export function validateResearchProjects(data: unknown): ResearchProject[] {
  const arraySchema = z.array(ResearchProjectSchema);
  return arraySchema.parse(data);
}

export function validateNewsArticles(data: unknown): NewsArticle[] {
  const arraySchema = z.array(NewsArticleSchema);
  return arraySchema.parse(data);
}

export function validateEvents(data: unknown): Event[] {
  const arraySchema = z.array(EventSchema);
  return arraySchema.parse(data);
}

// Safe validation functions that return validation results
export function safeParseFacultyMember(data: unknown) {
  return FacultyMemberSchema.safeParse(data);
}

export function safeParseResearchProject(data: unknown) {
  return ResearchProjectSchema.safeParse(data);
}

export function safeParseNewsArticle(data: unknown) {
  return NewsArticleSchema.safeParse(data);
}

export function safeParseEvent(data: unknown) {
  return EventSchema.safeParse(data);
}

// Utility functions for API responses
export function createApiResponse<T>(
  data: T,
  success: boolean = true,
  message?: string,
  error?: string
): ApiResponse<T> {
  return {
    data,
    success,
    message,
    error,
  };
}

export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
  success: boolean = true,
  message?: string,
  error?: string
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
    success,
    message,
    error,
  };
}

// Data transformation utilities
export function transformDateStrings<T extends Record<string, unknown>>(
  obj: T,
  dateFields: (keyof T)[]
): T {
  const transformed = { ...obj };
  
  for (const field of dateFields) {
    if (transformed[field] && typeof transformed[field] === 'string') {
      transformed[field] = new Date(transformed[field] as string) as T[keyof T];
    }
  }
  
  return transformed;
}

export function transformFacultyMemberDates(data: unknown): FacultyMember {
  // No date fields in FacultyMember that need transformation
  return data as FacultyMember;
}

export function transformResearchProjectDates(data: unknown): ResearchProject {
  return transformDateStrings(data as Record<string, unknown>, ['startDate', 'endDate']) as unknown as ResearchProject;
}

export function transformNewsArticleDates(data: unknown): NewsArticle {
  return transformDateStrings(data as Record<string, unknown>, ['publishDate', 'lastModified']) as unknown as NewsArticle;
}

export function transformEventDates(data: unknown): Event {
  return transformDateStrings(data as Record<string, unknown>, ['startDate', 'endDate']) as unknown as Event;
}

// Validation error handling
export class ValidationError extends Error {
  public readonly issues: z.ZodIssue[];

  constructor(error: z.ZodError) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.issues = error.issues;
  }

  public getFormattedErrors(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    for (const issue of this.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    }
    
    return errors;
  }
}

// Helper function to handle validation errors
export function handleValidationError(error: unknown): ValidationError | Error {
  if (error instanceof z.ZodError) {
    return new ValidationError(error);
  }
  
  if (error instanceof Error) {
    return error;
  }
  
  return new Error('Unknown validation error');
}