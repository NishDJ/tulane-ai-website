import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  section?: string;
}

/**
 * Generate comprehensive metadata for pages
 */
export function generateMetadata({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
  section,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const fullUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;
  const fullImage = image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    
    // Basic meta tags
    keywords: tags?.join(', '),
    authors: authors?.map(name => ({ name })),
    
    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(section && { section }),
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@tulaneai',
      site: '@tulaneai',
    },
    
    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification tags (for future use)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
    },
  };

  return metadata;
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    sameAs: [
      SITE_CONFIG.links.twitter,
      SITE_CONFIG.links.linkedin,
      SITE_CONFIG.links.github,
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1430 Tulane Avenue',
      addressLocality: 'New Orleans',
      addressRegion: 'LA',
      postalCode: '70112',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-504-988-5263',
      contactType: 'customer service',
      email: 'info@tulane.ai',
    },
    parentOrganization: {
      '@type': 'EducationalOrganization',
      name: 'Tulane University School of Medicine',
      url: 'https://medicine.tulane.edu',
    },
  };
}

/**
 * Generate structured data for person (faculty)
 */
export function generatePersonStructuredData(person: {
  name: string;
  title: string;
  email: string;
  bio: string;
  image?: string;
  researchAreas?: string[];
  publications?: Array<{ title: string; url?: string; year: number }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.title,
    email: person.email,
    description: person.bio,
    ...(person.image && { image: `${SITE_CONFIG.url}${person.image}` }),
    affiliation: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    ...(person.researchAreas && {
      knowsAbout: person.researchAreas,
    }),
    ...(person.publications && {
      publications: person.publications.map(pub => ({
        '@type': 'ScholarlyArticle',
        name: pub.title,
        ...(pub.url && { url: pub.url }),
        datePublished: pub.year.toString(),
      })),
    }),
  };
}

/**
 * Generate structured data for research project
 */
export function generateResearchProjectStructuredData(project: {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  principalInvestigator: string;
  status: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    name: project.title,
    description: project.description,
    startDate: project.startDate,
    ...(project.endDate && { endDate: project.endDate }),
    creator: {
      '@type': 'Person',
      name: project.principalInvestigator,
    },
    sponsor: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    ...(project.tags && { keywords: project.tags.join(', ') }),
  };
}

/**
 * Generate structured data for article/news
 */
export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    datePublished: article.publishDate,
    ...(article.modifiedDate && { dateModified: article.modifiedDate }),
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}${article.image}`,
      },
    }),
    url: `${SITE_CONFIG.url}${article.url}`,
    ...(article.tags && { keywords: article.tags.join(', ') }),
  };
}

/**
 * Generate structured data for event
 */
export function generateEventStructuredData(event: {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  eventType: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    location: {
      '@type': 'Place',
      name: event.location,
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    ...(event.url && { url: `${SITE_CONFIG.url}${event.url}` }),
  };
}