'use client';

import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types';
import { formatDate } from '@/lib/utils';
import { SocialShare } from './social-share';

interface NewsDetailProps {
  article: NewsArticle;
  relatedArticles?: NewsArticle[];
}

export function NewsDetail({ article, relatedArticles = [] }: NewsDetailProps) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const readingTime = Math.ceil(article.content.split(' ').length / 200);

  return (
    <motion.article
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto"
    >
      {/* Back Navigation */}
      <motion.div variants={itemVariants} className="mb-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-tulane-green hover:text-tulane-green/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News</span>
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header variants={itemVariants} className="mb-8">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-sm text-tulane-blue bg-tulane-blue/10 px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <time dateTime={article.publishDate.toISOString()}>
              {formatDate(article.publishDate)}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Social Share */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
          <SocialShare
            url={`/news/${article.slug}`}
            title={article.title}
            description={article.excerpt}
          />
          
          {article.lastModified !== article.publishDate && (
            <div className="text-sm text-gray-500">
              Updated: {formatDate(article.lastModified)}
            </div>
          )}
        </div>
      </motion.header>

      {/* Featured Image */}
      {article.featuredImage && (
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        </motion.div>
      )}

      {/* Article Content */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-tulane-green prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
          {/* For now, render content as HTML. In a real implementation, you'd use MDX */}
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
        </div>
      </motion.div>

      {/* Article Footer */}
      <motion.footer variants={itemVariants} className="border-t border-gray-200 pt-8 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this article</h3>
            <SocialShare
              url={`/news/${article.slug}`}
              title={article.title}
              description={article.excerpt}
            />
          </div>
          
          {/* Author Info */}
          <div className="text-right">
            <p className="text-sm text-gray-600">Written by</p>
            <p className="font-semibold text-gray-900">{article.author}</p>
          </div>
        </div>
      </motion.footer>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <motion.section variants={itemVariants} className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/news/${relatedArticle.slug}`}
                className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {relatedArticle.featuredImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-tulane-green transition-colors">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={relatedArticle.publishDate.toISOString()}>
                      {formatDate(relatedArticle.publishDate)}
                    </time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.article>
  );
}