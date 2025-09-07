import { Metadata } from 'next';
import ResourcesPageClient from './resources-page-client';
import { generateMetadata } from '@/lib/metadata';

// Force dynamic rendering to avoid SSG issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateMetadata({
  title: "Resources",
  description: "Access our comprehensive collection of publications, datasets, software tools, and educational resources for AI and data science in healthcare.",
  url: "/resources",
  type: "website",
  tags: [
    'AI resources',
    'medical publications',
    'healthcare datasets',
    'software tools',
    'educational materials',
    'research resources',
    'Tulane AI'
  ],
});

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}