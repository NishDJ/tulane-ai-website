import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadPrograms } from '@/lib/data-loader';
import { ProgramDetailClient } from './program-detail-client';

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const programs = await loadPrograms();
  const program = programs.find(p => p.id === id);

  if (!program) {
    return {
      title: 'Program Not Found | Tulane AI & Data Science',
    };
  }

  return {
    title: `${program.title} | Tulane AI & Data Science`,
    description: program.description,
    keywords: [
      program.title,
      program.type,
      program.level,
      'AI education',
      'data science',
      'Tulane University',
      'medical AI',
    ],
    openGraph: {
      title: `${program.title} | Tulane AI & Data Science`,
      description: program.description,
      type: 'website',
      images: program.image ? [{ url: program.image }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const programs = await loadPrograms();
  return programs.map((program) => ({
    id: program.id,
  }));
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params;
  const programs = await loadPrograms();
  const program = programs.find(p => p.id === id);

  if (!program) {
    notFound();
  }

  return <ProgramDetailClient program={program} />;
}