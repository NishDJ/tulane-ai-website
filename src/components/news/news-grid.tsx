'use client';

import { motion } from 'framer-motion';
import { NewsCard } from './news-card';
import { NewsArticle } from '@/types';

interface NewsGridProps {
  articles: NewsArticle[];
  showFeatured?: boolean;
}

export function NewsGrid({ articles, showFeatured = true }: NewsGridProps) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Separate featured and regular articles
  const featuredArticles = showFeatured ? articles.filter(article => article.featured) : [];
  const regularArticles = articles.filter(article => !article.featured || !showFeatured);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              featured={true}
            />
          ))}
        </div>
      )}

      {/* Regular Articles */}
      {regularArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              featured={false}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found.</p>
        </div>
      )}
    </motion.div>
  );
}