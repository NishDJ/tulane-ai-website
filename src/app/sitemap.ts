import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { loadFacultyData } from '@/lib/data-loader';
import { loadResearchData } from '@/lib/data-loader';
import { loadNewsData } from '@/lib/data-loader';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/faculty`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/programs/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/publications`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/collaboration`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  try {
    // Dynamic faculty pages
    const facultyData = await loadFacultyData();
    const facultyPages = facultyData.map((faculty) => ({
      url: `${baseUrl}/faculty/${faculty.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Dynamic research pages
    const researchData = await loadResearchData();
    const researchPages = researchData.map((project) => ({
      url: `${baseUrl}/research/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Dynamic news pages
    const newsData = await loadNewsData();
    const newsPages = newsData.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.lastModified || article.publishDate),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }));

    // Dynamic program pages (if they exist)
    const programPages = [
      {
        url: `${baseUrl}/programs/degrees`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/programs/certificates`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/programs/continuing`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ];

    return [
      ...staticPages,
      ...facultyPages,
      ...researchPages,
      ...newsPages,
      ...programPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if dynamic data loading fails
    return staticPages;
  }
}