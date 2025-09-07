import { Metadata } from 'next';
import { NewsPageClient } from './news-page-client';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: "News & Updates",
  description: "Stay updated with the latest news, research breakthroughs, and announcements from the Tulane AI and Data Science Division.",
  url: "/news",
  type: "website",
  tags: ['AI news', 'data science updates', 'Tulane research', 'medical AI', 'healthcare technology'],
});

export default function NewsPage() {
  return <NewsPageClient />;
}