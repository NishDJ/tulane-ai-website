import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';

// Mock data for testing
export const mockFacultyMember = {
  id: 'john-doe',
  name: 'Dr. John Doe',
  title: 'Professor of AI',
  department: 'Computer Science',
  email: 'john@example.com',
  bio: 'Expert in machine learning and artificial intelligence',
  researchAreas: ['Machine Learning', 'AI', 'Data Science'],
  education: [
    {
      degree: 'Ph.D.',
      institution: 'Stanford University',
      year: 2010,
      field: 'Computer Science',
    },
  ],
  publications: [
    {
      title: 'Advances in Machine Learning',
      authors: ['John Doe', 'Jane Smith'],
      journal: 'AI Journal',
      year: 2023,
      doi: '10.1000/test',
    },
  ],
  profileImage: '/images/faculty/john-doe.jpg',
  socialLinks: {
    twitter: 'https://twitter.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  isActive: true,
};

export const mockResearchProject = {
  id: 'ai-healthcare',
  title: 'AI in Healthcare Diagnostics',
  description: 'Developing machine learning models for medical image analysis',
  status: 'active' as const,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2024-12-31'),
  principalInvestigator: 'Dr. John Doe',
  collaborators: ['Dr. Jane Smith', 'Dr. Bob Johnson'],
  fundingSource: 'NIH Grant R01-123456',
  tags: ['AI', 'Healthcare', 'Machine Learning', 'Medical Imaging'],
  publications: [
    {
      title: 'Deep Learning for Medical Diagnosis',
      authors: ['John Doe', 'Jane Smith'],
      journal: 'Medical AI Journal',
      year: 2023,
    },
  ],
  datasets: [
    {
      name: 'Medical Images Dataset',
      description: 'Anonymized medical images for research',
      size: '10GB',
      format: 'DICOM',
      accessLevel: 'restricted' as const,
    },
  ],
  images: ['/images/research/ai-healthcare-1.jpg'],
  featured: true,
};

export const mockNewsArticle = {
  id: 'breakthrough-ai',
  title: 'Breakthrough in AI Research',
  slug: 'breakthrough-ai-research',
  excerpt: 'Our team has made significant progress in AI development',
  content: '# Breakthrough in AI Research\n\nThis is exciting news...',
  author: 'Dr. John Doe',
  publishDate: new Date('2023-12-01'),
  lastModified: new Date('2023-12-01'),
  tags: ['AI', 'Research', 'Breakthrough'],
  featuredImage: '/images/news/breakthrough.jpg',
  featured: true,
};

export const mockEvent = {
  id: 'ai-symposium',
  title: 'AI Symposium 2024',
  description: 'Annual symposium on artificial intelligence in medicine',
  startDate: new Date('2024-03-15T09:00:00'),
  endDate: new Date('2024-03-15T17:00:00'),
  location: 'Tulane University Medical Center',
  eventType: 'conference' as const,
  registrationUrl: 'https://example.com/register',
  capacity: 200,
  speakers: ['Dr. John Doe', 'Dr. Jane Smith'],
  tags: ['AI', 'Conference', 'Medicine'],
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Utility functions for testing
export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

export const createMockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

export const mockFetch = (response: any, ok = true) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
};

export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));