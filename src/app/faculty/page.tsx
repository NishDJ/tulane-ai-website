import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import FacultyPageClient from './faculty-page-client';

export const metadata: Metadata = generateMetadata({
  title: "Faculty",
  description: "Meet our world-class faculty members and their research specializations. Our diverse team of experts is advancing the frontiers of AI and data science in medicine.",
  url: "/faculty",
  type: "website",
});

export default function FacultyPage() {

  return <FacultyPageClient />;
}