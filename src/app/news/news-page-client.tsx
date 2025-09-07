'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Rss } from 'lucide-react';
import { NewsGrid, NewsletterSignup } from '@/components/news';
import { useNews } from '@/hooks';

export function NewsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showFeatured, setShowFeatured] = useState(false);

  const { articles, loading, error } = useNews({
    featured: showFeatured || undefined,
    tag: selectedTag || undefined
  });

  // Filter articles by search query on client side
  const filteredArticles = articles.filter(article => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Get all unique tags from articles
  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags))
  ).sort();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">News & Updates</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700">Error loading news: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            News & Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about the latest developments, research breakthroughs, and announcements 
            from the Tulane AI and Data Science Division.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search news articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tag Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={showFeatured}
                  onChange={(e) => setShowFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-tulane-green focus:ring-tulane-green"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Only
                </label>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        <motion.div variants={itemVariants} className="mb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NewsGrid articles={filteredArticles} showFeatured={!showFeatured} />
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-tulane-green to-tulane-blue rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-lg mb-6 opacity-90">
              Get the latest news and updates delivered directly to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterSignup compact className="bg-white/10 backdrop-blur-sm border-white/20" />
            </div>
          </div>
        </motion.div>

        {/* RSS Feed Link */}
        <motion.div variants={itemVariants} className="text-center">
          <a
            href="/api/rss"
            className="inline-flex items-center gap-2 text-tulane-green hover:text-tulane-green/80 transition-colors"
          >
            <Rss className="w-5 h-5" />
            <span>Subscribe to RSS Feed</span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}