import type { Metadata } from 'next';
import { loadResearchProjects } from '@/lib/data-loader';
import { ResearchGrid } from '@/components/research';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: "Research",
  description: "Explore our cutting-edge research projects in medical AI and data science. Discover innovative solutions advancing healthcare through artificial intelligence and machine learning.",
  url: "/research",
  type: "website",
});

export default async function ResearchPage() {
  const response = await loadResearchProjects();
  const projects = response.success ? response.data : [];

  if (!response.success) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-tulane-green mb-4">Research</h1>
          <p className="text-red-600">Failed to load research projects: {response.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ResearchGrid projects={projects} />
    </div>
  );
}