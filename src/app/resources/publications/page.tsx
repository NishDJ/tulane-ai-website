import { Metadata } from 'next';
import PublicationsPageClient from './publications-page-client';

export const metadata: Metadata = {
  title: 'Publications | Tulane AI & Data Science Division',
  description: 'Browse our latest research publications in AI and data science for healthcare, including peer-reviewed articles, conference papers, and preprints.',
  keywords: [
    'AI publications',
    'medical AI research',
    'healthcare data science',
    'research papers',
    'peer-reviewed articles',
    'Tulane research'
  ],
};

export default function PublicationsPage() {
  return <PublicationsPageClient />;
}