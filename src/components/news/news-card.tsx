'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types';
import { formatDate } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const imageVariants = {
    hover: { scale: 1.05 }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <Link href={`/news/${article.slug}`} className="block">
        {/* Featured Image */}
        {article.featuredImage && (
          <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
            <motion.div
              variants={imageVariants}
              className="w-full h-full"
            >
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              />
            </motion.div>
            
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />
            
            {/* Featured Badge */}
            {article.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-tulane-green text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs text-tulane-blue bg-tulane-blue/10 px-2 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-tulane-green transition-colors duration-200 ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className={`text-gray-600 mb-4 line-clamp-3 ${
            featured ? 'text-base md:text-lg' : 'text-sm'
          }`}>
            {article.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.publishDate.toISOString()}>
                  {formatDate(article.publishDate)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            </div>

            {/* Read More Arrow */}
            <motion.div
              className="flex items-center gap-1 text-tulane-green font-medium"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}