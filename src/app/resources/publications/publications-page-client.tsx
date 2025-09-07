'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Loader2 } from 'lucide-react';
import { PublicationCard } from '@/components/resources';
import { usePublications } from '@/hooks/useResources';
import { type PublicationResource } from '@/types';

export default function PublicationsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { 
    resources: publications, 
    loading, 
    error, 
    pagination,
    loadMore,
    hasMore 
  } = usePublications({
    query: searchQuery || undefined,
    category: selectedCategory || undefined,
    featured: featuredOnly || undefined,
    openAccess: openAccessOnly || undefined,
    sortBy,
    sortOrder,
    limit: 20,
  });

  // Extract unique categories and years for filter options
  const { availableCategories, availableYears } = useMemo(() => {
    const categories = new Set<string>();
    const years = new Set<number>();
    
    publications.forEach((pub) => {
      categories.add(pub.category);
      if ('year' in pub) {
        years.add(pub.year as number);
      }
    });
    
    return {
      availableCategories: Array.from(categories).sort(),
      availableYears: Array.from(years).sort((a, b) => b - a),
    };
  }, [publications]);

  const filteredPublications = useMemo(() => {
    let filtered = publications;
    
    if (selectedYear) {
      filtered = filtered.filter(pub => 
        'year' in pub && pub.year === parseInt(selectedYear)
      );
    }
    
    return filtered;
  }, [publications, selectedYear]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tulane-green to-tulane-blue text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Research Publications
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover our latest research contributions to AI and data science in healthcare, 
              published in top-tier journals and conferences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-8"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search publications by title, author, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                  >
                    <option value="year">Year</option>
                    <option value="title">Title</option>
                    <option value="citationCount">Citations</option>
                    <option value="lastUpdated">Last Updated</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>

              {/* Toggle Filters */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Filters
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="rounded border-gray-300 text-tulane-green focus:ring-tulane-green"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={openAccessOnly}
                      onChange={(e) => setOpenAccessOnly(e.target.checked)}
                      className="rounded border-gray-300 text-tulane-green focus:ring-tulane-green"
                    />
                    <span className="ml-2 text-sm text-gray-700">Open access only</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {pagination ? `${pagination.total} publications found` : 'Loading...'}
            </h2>
          </motion.div>

          {/* Publications Grid */}
          {loading === 'loading' && filteredPublications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-tulane-green" />
              <span className="ml-2 text-gray-600">Loading publications...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">Error loading publications</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPublications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication as PublicationResource}
                />
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loading === 'loading'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-tulane-green text-white rounded-lg hover:bg-tulane-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Publications'
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}