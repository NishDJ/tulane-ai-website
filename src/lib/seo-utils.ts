/**
 * SEO utility functions for heading hierarchy and content optimization
 */

/**
 * Validates heading hierarchy in content
 * Ensures proper h1 -> h2 -> h3 structure
 */
export function validateHeadingHierarchy(content: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: Array<{ level: number; text: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, '').trim(),
    });
  }

  const issues: string[] = [];
  const suggestions: string[] = [];
  let isValid = true;

  // Check for multiple h1 tags
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count > 1) {
    issues.push(`Multiple h1 tags found (${h1Count}). Use only one h1 per page.`);
    suggestions.push('Use h2-h6 for subheadings instead of multiple h1 tags.');
    isValid = false;
  }

  // Check for missing h1
  if (h1Count === 0) {
    issues.push('No h1 tag found. Every page should have exactly one h1 tag.');
    suggestions.push('Add an h1 tag as the main page heading.');
    isValid = false;
  }

  // Check for heading level skips
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];
    
    if (current.level > previous.level + 1) {
      issues.push(`Heading level skip: h${previous.level} followed by h${current.level}`);
      suggestions.push(`Use h${previous.level + 1} instead of h${current.level} after h${previous.level}`);
      isValid = false;
    }
  }

  return { isValid, issues, suggestions };
}

/**
 * Generates breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generates FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Optimizes content for SEO
 */
export function optimizeContentForSEO(content: string, targetKeywords: string[] = []): {
  optimizedContent: string;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  const optimizedContent = content;

  // Check content length
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    recommendations.push('Content is quite short. Consider expanding to at least 300 words for better SEO.');
  }

  // Check for target keywords
  if (targetKeywords.length > 0) {
    const contentLower = content.toLowerCase();
    const missingKeywords = targetKeywords.filter(keyword => 
      !contentLower.includes(keyword.toLowerCase())
    );
    
    if (missingKeywords.length > 0) {
      recommendations.push(`Consider including these keywords: ${missingKeywords.join(', ')}`);
    }
  }

  // Check for alt text on images
  const imgRegex = /<img[^>]*>/gi;
  const images = content.match(imgRegex) || [];
  const imagesWithoutAlt = images.filter(img => !img.includes('alt='));
  
  if (imagesWithoutAlt.length > 0) {
    recommendations.push(`${imagesWithoutAlt.length} image(s) missing alt text. Add descriptive alt attributes for accessibility and SEO.`);
  }

  // Check for internal links
  const internalLinkRegex = /<a[^>]*href=["'][^"']*\/[^"']*["'][^>]*>/gi;
  const internalLinks = content.match(internalLinkRegex) || [];
  
  if (internalLinks.length === 0) {
    recommendations.push('Consider adding internal links to related content to improve site navigation and SEO.');
  }

  return { optimizedContent, recommendations };
}

/**
 * Generates canonical URL
 */
export function generateCanonicalUrl(baseUrl: string, path: string): string {
  // Remove trailing slash from baseUrl and leading slash from path
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  
  // Handle root path
  if (!cleanPath) {
    return cleanBaseUrl;
  }
  
  return `${cleanBaseUrl}/${cleanPath}`;
}

/**
 * Validates meta description
 */
export function validateMetaDescription(description: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let isValid = true;

  if (!description) {
    issues.push('Meta description is missing.');
    suggestions.push('Add a meta description between 150-160 characters.');
    isValid = false;
  } else {
    if (description.length < 120) {
      issues.push('Meta description is too short.');
      suggestions.push('Expand meta description to at least 120 characters.');
      isValid = false;
    }
    
    if (description.length > 160) {
      issues.push('Meta description is too long and may be truncated in search results.');
      suggestions.push('Shorten meta description to under 160 characters.');
      isValid = false;
    }
  }

  return { isValid, issues, suggestions };
}

/**
 * Validates page title
 */
export function validatePageTitle(title: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let isValid = true;

  if (!title) {
    issues.push('Page title is missing.');
    suggestions.push('Add a descriptive page title.');
    isValid = false;
  } else {
    if (title.length < 30) {
      issues.push('Page title is too short.');
      suggestions.push('Expand page title to at least 30 characters.');
      isValid = false;
    }
    
    if (title.length > 60) {
      issues.push('Page title is too long and may be truncated in search results.');
      suggestions.push('Shorten page title to under 60 characters.');
      isValid = false;
    }
  }

  return { isValid, issues, suggestions };
}