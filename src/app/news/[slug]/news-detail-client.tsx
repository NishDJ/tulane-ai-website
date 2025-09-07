'use client';

import { motion } from 'framer-motion';
import { NewsDetail } from '@/components/news';
import { NewsArticle } from '@/types';

interface NewsDetailClientProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

export function NewsDetailClient({ article, relatedArticles }: NewsDetailClientProps) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsDetail 
          article={article} 
          relatedArticles={relatedArticles} 
        />
      </div>
    </motion.div>
  );
}