# SEO Implementation Guide

This document outlines the comprehensive SEO optimization and metadata management implementation for the Tulane AI & Data Science Division website.

## Overview

The SEO implementation includes:
- Dynamic metadata generation using Next.js Metadata API
- Open Graph and Twitter Card metadata for social sharing
- XML sitemap and robots.txt generation
- Structured data markup for rich search results
- Canonical URLs and proper heading hierarchy
- Performance optimizations for Core Web Vitals

## Implementation Details

### 1. Metadata Management (`src/lib/metadata.ts`)

#### Core Functions:
- `generateMetadata()`: Creates comprehensive metadata for pages
- `generateOrganizationStructuredData()`: Organization schema markup
- `generatePersonStructuredData()`: Faculty profile schema markup
- `generateResearchProjectStructuredData()`: Research project schema markup
- `generateArticleStructuredData()`: News article schema markup
- `generateEventStructuredData()`: Event schema markup

#### Features:
- Dynamic Open Graph and Twitter Card generation
- Canonical URL management
- Proper meta tag structure
- Social media optimization
- Search engine verification tags

### 2. Sitemap Generation (`src/app/sitemap.ts`)

Automatically generates XML sitemap including:
- Static pages with appropriate priorities and change frequencies
- Dynamic faculty profile pages
- Dynamic research project pages
- Dynamic news article pages
- Program pages

#### Priority Structure:
- Homepage: 1.0
- Main sections (Faculty, Research): 0.9
- Programs: 0.8
- Individual profiles/projects: 0.7
- News articles: 0.6
- Utility pages: 0.3

### 3. Robots.txt (`src/app/robots.ts`)

Configures search engine crawling:
- Allows crawling of public content
- Blocks API routes and private directories
- Blocks AI crawlers (GPTBot, ChatGPT-User, etc.)
- References sitemap location

### 4. Open Graph Images

#### Dynamic OG Images:
- `src/app/opengraph-image.tsx`: Main site OG image
- `src/app/twitter-image.tsx`: Twitter-optimized image
- Uses Next.js ImageResponse API for dynamic generation
- Branded with Tulane colors and styling

### 5. Structured Data Implementation

#### Organization Schema (Root Layout):
```json
{
  "@type": "EducationalOrganization",
  "name": "Tulane AI & Data Science Division",
  "description": "...",
  "address": {...},
  "contactPoint": {...}
}
```

#### Person Schema (Faculty Pages):
```json
{
  "@type": "Person",
  "name": "...",
  "jobTitle": "...",
  "affiliation": {...},
  "publications": [...]
}
```

#### Research Project Schema:
```json
{
  "@type": "ResearchProject",
  "name": "...",
  "description": "...",
  "creator": {...},
  "sponsor": {...}
}
```

#### Article Schema (News):
```json
{
  "@type": "Article",
  "headline": "...",
  "author": {...},
  "publisher": {...},
  "datePublished": "..."
}
```

### 6. Page-Specific Metadata

Each page includes optimized metadata:

#### Homepage:
- Title: "Home | Tulane AI & Data Science Division"
- Description: Comprehensive overview of the division
- Type: "website"

#### Faculty Pages:
- Dynamic titles with faculty names
- Descriptions including research areas
- Type: "profile" for individual pages

#### Research Pages:
- Project-specific titles and descriptions
- Type: "article" for individual projects
- Tags for research areas

#### News Pages:
- Article-specific metadata
- Author information
- Publication and modification dates
- Type: "article"

### 7. SEO Utilities (`src/lib/seo-utils.ts`)

Additional SEO tools:
- `validateHeadingHierarchy()`: Ensures proper h1-h6 structure
- `generateBreadcrumbStructuredData()`: Breadcrumb schema
- `generateFAQStructuredData()`: FAQ schema
- `optimizeContentForSEO()`: Content optimization recommendations
- `validateMetaDescription()`: Meta description validation
- `validatePageTitle()`: Title tag validation

## Usage Examples

### Adding Metadata to a New Page:

```typescript
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: "Page Title",
  description: "Page description for SEO",
  url: "/page-path",
  type: "website",
  tags: ["keyword1", "keyword2"],
});
```

### Adding Structured Data:

```typescript
import { generatePersonStructuredData } from '@/lib/metadata';

const structuredData = generatePersonStructuredData({
  name: person.name,
  title: person.title,
  email: person.email,
  bio: person.bio,
  // ... other properties
});

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
    {/* Page content */}
  </>
);
```

## Configuration

### Environment Variables:
- `NEXT_PUBLIC_SITE_URL`: Base URL for the site (default: https://tulane.ai)
- `GOOGLE_SITE_VERIFICATION`: Google Search Console verification
- `YANDEX_VERIFICATION`: Yandex verification
- `YAHOO_SITE_VERIFICATION`: Yahoo verification

### Site Configuration (`src/lib/constants.ts`):
```typescript
export const SITE_CONFIG = {
  name: "Tulane AI & Data Science Division",
  description: "...",
  url: "https://tulane.ai",
  ogImage: "/opengraph-image",
  links: {
    twitter: "https://twitter.com/tulaneai",
    // ... other social links
  },
};
```

## Best Practices Implemented

### 1. Metadata Optimization:
- Unique titles for each page (30-60 characters)
- Compelling meta descriptions (120-160 characters)
- Proper Open Graph and Twitter Card tags
- Canonical URLs to prevent duplicate content

### 2. Structured Data:
- Schema.org markup for better search understanding
- Organization, Person, Article, and ResearchProject schemas
- Proper JSON-LD implementation

### 3. Technical SEO:
- XML sitemap with proper priorities
- Robots.txt configuration
- Proper heading hierarchy (h1 → h2 → h3)
- Clean URL structure

### 4. Performance:
- Optimized images with Next.js Image component
- Dynamic imports for code splitting
- Proper caching strategies

### 5. Accessibility:
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility

## Monitoring and Validation

### Tools for Testing:
1. **Google Search Console**: Monitor search performance
2. **Google Rich Results Test**: Validate structured data
3. **Facebook Sharing Debugger**: Test Open Graph tags
4. **Twitter Card Validator**: Test Twitter Cards
5. **Lighthouse**: Performance and SEO audits
6. **Schema.org Validator**: Validate structured data

### Key Metrics to Monitor:
- Core Web Vitals (LCP, FID, CLS)
- Search rankings for target keywords
- Click-through rates from search results
- Social media sharing engagement
- Crawl errors and indexing status

## Future Enhancements

### Planned Improvements:
1. **Dynamic OG Images**: Generate page-specific Open Graph images
2. **FAQ Schema**: Add FAQ structured data for relevant pages
3. **Breadcrumb Schema**: Implement breadcrumb navigation
4. **Local Business Schema**: Add location-specific markup
5. **Course Schema**: Add structured data for educational programs
6. **Review Schema**: Add review markup for programs/faculty

### Analytics Integration:
- Google Analytics 4 implementation
- Search Console integration
- Performance monitoring
- User behavior tracking

## Troubleshooting

### Common Issues:
1. **Missing metadataBase**: Ensure NEXT_PUBLIC_SITE_URL is set
2. **Duplicate titles**: Check for unique titles across pages
3. **Invalid structured data**: Use Google's Rich Results Test
4. **Sitemap errors**: Verify all URLs are accessible
5. **Robots.txt blocking**: Check robots.txt configuration

### Debug Commands:
```bash
# Build and check for SEO issues
npm run build

# Test sitemap generation
curl http://localhost:3000/sitemap.xml

# Test robots.txt
curl http://localhost:3000/robots.txt

# Validate structured data
# Use Google's Rich Results Test tool
```

This implementation provides a solid foundation for SEO optimization while maintaining flexibility for future enhancements and customizations.