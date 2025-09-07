import { z } from 'zod';

// Core Data Interfaces
export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  office?: string;
  bio: string;
  researchAreas: string[];
  education: Education[];
  publications: Publication[];
  profileImage: string;
  socialLinks?: SocialLinks;
  isActive: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  field?: string;
}

export interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url?: string;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "planned";
  startDate: Date;
  endDate?: Date;
  principalInvestigator: string;
  collaborators: string[];
  fundingSource?: string;
  tags: string[];
  publications?: Publication[];
  datasets?: Dataset[];
  images: string[];
  featured: boolean;
}

export interface Dataset {
  name: string;
  description: string;
  size: string;
  format: string;
  accessLevel: "public" | "restricted" | "private";
  downloadUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  lastModified: Date;
  tags: string[];
  featuredImage?: string;
  featured: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  eventType: "seminar" | "conference" | "workshop" | "social";
  registrationUrl?: string;
  capacity?: number;
  speakers?: string[];
  tags: string[];
}

export interface Program {
  id: string;
  title: string;
  type: "degree" | "certificate" | "continuing-education";
  level: "undergraduate" | "graduate" | "doctoral" | "professional";
  description: string;
  duration: string;
  format: "on-campus" | "online" | "hybrid";
  requirements: string[];
  prerequisites: string[];
  courses: Course[];
  applicationDeadline?: Date;
  applicationUrl?: string;
  tuition?: {
    amount: number;
    period: "semester" | "year" | "total";
    currency: string;
  };
  featured: boolean;
  isActive: boolean;
  image?: string;
  brochureUrl?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  prerequisites: string[];
  instructor?: string;
  schedule?: {
    days: string[];
    time: string;
    location?: string;
  };
  semester: "fall" | "spring" | "summer" | "year-round";
  isRequired: boolean;
  syllabus?: string;
}

export interface ApplicationInfo {
  id: string;
  programId: string;
  requirements: ApplicationRequirement[];
  process: ApplicationStep[];
  deadlines: ApplicationDeadline[];
  contactInfo: {
    email: string;
    phone?: string;
    office?: string;
  };
  faq: FAQ[];
}

export interface ApplicationRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  documents: string[];
}

export interface ApplicationStep {
  id: string;
  step: number;
  title: string;
  description: string;
  estimatedTime?: string;
  url?: string;
}

export interface ApplicationDeadline {
  id: string;
  type: "application" | "documents" | "interview" | "decision";
  date: Date;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "link" | "document";
  category: string;
  url: string;
  downloadable: boolean;
  size?: string;
  lastUpdated: Date;
  tags: string[];
}

export interface PublicationResource {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  doi?: string;
  pmid?: string;
  url?: string;
  pdfUrl?: string;
  citationCount?: number;
  tags: string[];
  category: string;
  featured: boolean;
  openAccess: boolean;
  lastUpdated: Date;
}

export interface DatasetResource {
  id: string;
  title: string;
  description: string;
  size: string;
  format: string[];
  accessLevel: "public" | "restricted" | "private";
  downloadUrl?: string;
  accessRequirements?: string;
  license?: string;
  version: string;
  lastUpdated: Date;
  tags: string[];
  category: string;
  featured: boolean;
  citations?: number;
  relatedPublications?: string[];
}

export interface SoftwareTool {
  id: string;
  title: string;
  description: string;
  version: string;
  category: string;
  url?: string;
  githubUrl?: string;
  documentationUrl?: string;
  downloadUrl?: string;
  license: string;
  platform: string[];
  requirements: string[];
  features: string[];
  screenshots?: string[];
  tags: string[];
  featured: boolean;
  lastUpdated: Date;
  maintainers: string[];
}

export interface BookmarkItem {
  id: string;
  type: 'publication' | 'dataset' | 'software' | 'resource';
  title: string;
  url: string;
  addedAt: Date;
}

export interface NavigationItem {
  title: string;
  href: string;
  children?: NavigationItem[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  office: string;
}

// Utility Types for Common Patterns
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

export type FormData<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export type SearchFilters = {
  query?: string;
  tags?: string[];
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string;
};

export type SortOptions = {
  field: string;
  direction: 'asc' | 'desc';
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  organization?: string;
  phone?: string;
};

export type NewsletterSignupData = {
  email: string;
  firstName?: string;
  lastName?: string;
  interests?: string[];
};

// Zod Validation Schemas
export const SocialLinksSchema = z.object({
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
});

export const EducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 10),
  field: z.string().optional(),
});

export const PublicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  journal: z.string().min(1, 'Journal is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  doi: z.string().optional(),
  url: z.string().url().optional(),
});

export const FacultyMemberSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  office: z.string().optional(),
  bio: z.string().min(1, 'Bio is required'),
  researchAreas: z.array(z.string()).min(1, 'At least one research area is required'),
  education: z.array(EducationSchema),
  publications: z.array(PublicationSchema),
  profileImage: z.string().min(1, 'Profile image is required'),
  socialLinks: SocialLinksSchema.optional(),
  isActive: z.boolean(),
});

export const DatasetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  size: z.string().min(1, 'Size is required'),
  format: z.string().min(1, 'Format is required'),
  accessLevel: z.enum(['public', 'restricted', 'private']),
  downloadUrl: z.string().url().optional(),
});

export const ResearchProjectSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['active', 'completed', 'planned']),
  startDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  endDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  principalInvestigator: z.string().min(1, 'Principal investigator is required'),
  collaborators: z.array(z.string()),
  fundingSource: z.string().optional(),
  tags: z.array(z.string()),
  publications: z.array(PublicationSchema).optional(),
  datasets: z.array(DatasetSchema).optional(),
  images: z.array(z.string()),
  featured: z.boolean(),
});

export const NewsArticleSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  publishDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  lastModified: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  tags: z.array(z.string()),
  featuredImage: z.string().optional(),
  featured: z.boolean(),
});

export const EventSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  endDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  location: z.string().min(1, 'Location is required'),
  eventType: z.enum(['seminar', 'conference', 'workshop', 'social']),
  registrationUrl: z.string().url().optional(),
  capacity: z.number().int().positive().optional(),
  speakers: z.array(z.string()).optional(),
  tags: z.array(z.string()),
});

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  organization: z.string().optional(),
  phone: z.string().optional(),
});

export const NewsletterSignupSchema = z.object({
  email: z.string().email('Valid email is required'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  status: z.string().optional(),
});

export const CourseSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  code: z.string().min(1, 'Course code is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  credits: z.number().int().positive('Credits must be positive'),
  prerequisites: z.array(z.string()),
  instructor: z.string().optional(),
  schedule: z.object({
    days: z.array(z.string()),
    time: z.string(),
    location: z.string().optional(),
  }).optional(),
  semester: z.enum(['fall', 'spring', 'summer', 'year-round']),
  isRequired: z.boolean(),
  syllabus: z.string().optional(),
});

export const ProgramSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['degree', 'certificate', 'continuing-education']),
  level: z.enum(['undergraduate', 'graduate', 'doctoral', 'professional']),
  description: z.string().min(1, 'Description is required'),
  duration: z.string().min(1, 'Duration is required'),
  format: z.enum(['on-campus', 'online', 'hybrid']),
  requirements: z.array(z.string()),
  prerequisites: z.array(z.string()),
  courses: z.array(CourseSchema),
  applicationDeadline: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  applicationUrl: z.string().optional(),
  tuition: z.object({
    amount: z.number().positive(),
    period: z.enum(['semester', 'year', 'total']),
    currency: z.string().min(1),
  }).optional(),
  featured: z.boolean(),
  isActive: z.boolean(),
  image: z.string().optional(),
  brochureUrl: z.string().optional(),
});

export const ApplicationRequirementSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  required: z.boolean(),
  documents: z.array(z.string()),
});

export const ApplicationStepSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  step: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  estimatedTime: z.string().optional(),
  url: z.string().optional(),
});

export const ApplicationDeadlineSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  type: z.enum(['application', 'documents', 'interview', 'decision']),
  date: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  description: z.string().min(1, 'Description is required'),
});

export const FAQSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
});

export const ApplicationInfoSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  programId: z.string().min(1, 'Program ID is required'),
  requirements: z.array(ApplicationRequirementSchema),
  process: z.array(ApplicationStepSchema),
  deadlines: z.array(ApplicationDeadlineSchema),
  contactInfo: z.object({
    email: z.string().min(1, 'Email is required'),
    phone: z.string().optional(),
    office: z.string().optional(),
  }),
  faq: z.array(FAQSchema),
});

export const EducationalResourceSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['pdf', 'video', 'link', 'document']),
  category: z.string().min(1, 'Category is required'),
  url: z.string().min(1, 'URL is required'),
  downloadable: z.boolean(),
  size: z.string().optional(),
  lastUpdated: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  tags: z.array(z.string()),
});

export const PublicationResourceSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  journal: z.string().min(1, 'Journal is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  abstract: z.string().min(1, 'Abstract is required'),
  doi: z.string().optional(),
  pmid: z.string().optional(),
  url: z.string().optional(),
  pdfUrl: z.string().optional(),
  citationCount: z.number().int().min(0).optional(),
  tags: z.array(z.string()),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean(),
  openAccess: z.boolean(),
  lastUpdated: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
});

export const DatasetResourceSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  size: z.string().min(1, 'Size is required'),
  format: z.array(z.string()).min(1, 'At least one format is required'),
  accessLevel: z.enum(['public', 'restricted', 'private']),
  downloadUrl: z.string().optional(),
  accessRequirements: z.string().optional(),
  license: z.string().optional(),
  version: z.string().min(1, 'Version is required'),
  lastUpdated: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  tags: z.array(z.string()),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean(),
  citations: z.number().int().min(0).optional(),
  relatedPublications: z.array(z.string()).optional(),
});

export const SoftwareToolSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  version: z.string().min(1, 'Version is required'),
  category: z.string().min(1, 'Category is required'),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  documentationUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  license: z.string().min(1, 'License is required'),
  platform: z.array(z.string()).min(1, 'At least one platform is required'),
  requirements: z.array(z.string()),
  features: z.array(z.string()),
  screenshots: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  lastUpdated: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  maintainers: z.array(z.string()),
});

export const BookmarkItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  type: z.enum(['publication', 'dataset', 'software', 'resource']),
  title: z.string().min(1, 'Title is required'),
  url: z.string().min(1, 'URL is required'),
  addedAt: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
});