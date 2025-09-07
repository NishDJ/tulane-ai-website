import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadNewsData } from '@/lib/data-loader';
import { NewsDetailClient } from './news-detail-client';
import { generateMetadata as generateSEOMetadata, generateArticleStructuredData } from '@/lib/metadata';

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = await loadNewsData();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return generateSEOMetadata({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    });
  }

  return generateSEOMetadata({
    title: article.title,
    description: article.excerpt,
    url: `/news/${article.slug}`,
    type: 'article',
    publishedTime: article.publishDate.toISOString(),
    modifiedTime: article.lastModified.toISOString(),
    authors: [article.author],
    tags: article.tags,
    image: article.featuredImage,
  });
}

export async function generateStaticParams() {
  const articles = await loadNewsData();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const articles = await loadNewsData();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Get related articles (same tags, excluding current article)
  const relatedArticles = articles
    .filter(a => 
      a.id !== article.id && 
      a.tags.some(tag => article.tags.includes(tag))
    )
    .slice(0, 3);

  const articleStructuredData = generateArticleStructuredData({
    title: article.title,
    description: article.excerpt,
    author: article.author,
    publishDate: article.publishDate.toISOString(),
    modifiedDate: article.lastModified.toISOString(),
    image: article.featuredImage,
    url: `/news/${article.slug}`,
    tags: article.tags,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <NewsDetailClient 
        article={article} 
        relatedArticles={relatedArticles} 
      />
    </>
  );
}