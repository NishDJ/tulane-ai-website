import { Metadata } from 'next';
import { EventsPageClient } from './events-page-client';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: "Events & Calendar",
  description: "Discover upcoming seminars, conferences, workshops, and social events hosted by the Tulane AI and Data Science Division.",
  url: "/events",
  type: "website",
  tags: ['AI events', 'data science seminars', 'Tulane conferences', 'medical AI workshops', 'healthcare technology events'],
});

export default function EventsPage() {
  return <EventsPageClient />;
}