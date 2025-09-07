import { Metadata } from 'next';
import { ProgramsPageClient } from './programs-page-client';
import { generateMetadata } from '@/lib/metadata';

// Force dynamic rendering to avoid SSG issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateMetadata({
  title: "Programs & Education",
  description: "Explore our comprehensive programs in AI and data science, including degree programs, certificates, and continuing education opportunities.",
  url: "/programs",
  type: "website",
  tags: ['AI programs', 'data science education', 'Tulane University', 'machine learning courses', 'medical AI'],
});

export default function ProgramsPage() {
  return <ProgramsPageClient />;
}