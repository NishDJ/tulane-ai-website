'use client';

import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '@/types';

interface UseNewsOptions {
  featured?: boolean;
  limit?: number;
  tag?: string;
}

interface UseNewsReturn {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.featured !== undefined) {
        params.append('featured', options.featured.toString());
      }
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options.tag) {
        params.append('tag', options.tag);
      }

      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      // Transform date strings back to Date objects
      const transformedArticles = data.data.map((article: NewsArticle & { publishDate: string; lastModified: string }) => ({
        ...article,
        publishDate: new Date(article.publishDate),
        lastModified: new Date(article.lastModified)
      }));

      setArticles(transformedArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [options.featured, options.limit, options.tag]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    articles,
    loading,
    error,
    refetch: fetchNews
  };
}

interface UseNewsArticleReturn {
  article: NewsArticle | null;
  relatedArticles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNewsArticle(slug: string): UseNewsArticleReturn {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/news/${slug}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch article');
      }

      // Transform date strings back to Date objects
      const transformedArticle = {
        ...data.data.article,
        publishDate: new Date(data.data.article.publishDate),
        lastModified: new Date(data.data.article.lastModified)
      };

      const transformedRelated = data.data.relatedArticles.map((article: NewsArticle & { publishDate: string; lastModified: string }) => ({
        ...article,
        publishDate: new Date(article.publishDate),
        lastModified: new Date(article.lastModified)
      }));

      setArticle(transformedArticle);
      setRelatedArticles(transformedRelated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setArticle(null);
      setRelatedArticles([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug, fetchArticle]);

  return {
    article,
    relatedArticles,
    loading,
    error,
    refetch: fetchArticle
  };
}