import { Metadata } from 'next';
import { ResourcesPageClient } from './resources-page-client';

// Force dynamic rendering to avoid SSG issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Educational Resources | Tulane AI & Data Science',
  description: 'Access comprehensive educational resources including guides, videos, templates, and tools for AI and data science learning.',
  keywords: ['educational resources', 'AI learning materials', 'data science guides', 'Tulane University', 'medical AI resources'],
  openGraph: {
    title: 'Educational Resources | Tulane AI & Data Science',
    description: 'Access comprehensive educational resources including guides, videos, templates, and tools for AI and data science learning.',
    type: 'website',
  },
};

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}