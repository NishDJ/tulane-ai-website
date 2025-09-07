'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Database, 
  Code, 
  FileText,
  Bookmark,
  Grid3X3,
  List,
  Loader2
} from 'lucide-react';
import { 
  PublicationCard, 
  DatasetCard, 
  SoftwareCard, 
  ResourceFilters,
  BookmarkManager
} from '@/components/resources';
import { useResources } from '@/hooks/useResources';
import { useBookmarks } from '@/hooks/useBookmarks';
import { 
  type PublicationResource, 
  type DatasetResource, 
  type SoftwareTool,
  type EducationalResource
} from '@/types';
import { cn } from '@/lib/utils';

type ResourceType = 'all' | 'publications' | 'datasets' | 'software' | 'educational';
type ViewMode = 'grid' | 'list';

interface FilterOptions {
  type: ResourceType;
  category: string;
  tags: string[];
  featured: boolean | null;
  openAccess: boolean | null;
  accessLevel: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  query: string;
}

const initialFilters: FilterOptions = {
  type: 'all',
  category: '',
  tags: [],
  featured: null,
  openAccess: null,
  accessLevel: '',
  sortBy: 'lastUpdated',
  sortOrder: 'desc',
  query: '',
};

export default function ResourcesPageClient() {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showBookmarks, setShowBookmarks] = useState(false);
  
  const { bookmarks } = useBookmarks();
  
  const { 
    resources, 
    loading, 
    error, 
    pagination,
    loadMore,
    hasMore 
  } = useResources({
    type: filters.type,
    category: filters.category || undefined,
    tags: filters.tags.length > 0 ? filters.tags : undefined,
    featured: filters.featured || undefined,
    openAccess: filters.openAccess || undefined,
    accessLevel: (filters.accessLevel as 'public' | 'restricted' | 'private') || undefined,
    query: filters.query || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    limit: 20,
  });

  // Extract unique categories and tags for filter options
  const { availableCategories, availableTags } = useMemo(() => {
    const categories = new Set<string>();
    const tags = new Set<string>();
    
    resources.forEach((resource) => {
      categories.add(resource.category);
      resource.tags.forEach(tag => tags.add(tag));
    });
    
    return {
      availableCategories: Array.from(categories).sort(),
      availableTags: Array.from(tags).sort(),
    };
  }, [resources]);

  const renderResourceCard = (resource: PublicationResource | DatasetResource | SoftwareTool | EducationalResource) => {
    const baseProps = {
      key: resource.id,
      className: cn(
        viewMode === 'list' && "mb-4"
      )
    };

    // Determine resource type and render appropriate card
    if ('authors' in resource && 'journal' in resource) {
      return <PublicationCard {...baseProps} publication={resource as PublicationResource} />;
    } else if ('format' in resource && 'accessLevel' in resource) {
      return <DatasetCard {...baseProps} dataset={resource as DatasetResource} />;
    } else if ('version' in resource && 'platform' in resource) {
      return <SoftwareCard {...baseProps} software={resource as SoftwareTool} />;
    } else {
      // Educational resource - create a simple card for now
      return (
        <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
          <p className="text-gray-600 text-sm mb-4">
            {'description' in resource ? resource.description : 'Educational Resource'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {'category' in resource ? resource.category : 'Resource'}
            </span>
            {'url' in resource && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tulane-green hover:text-tulane-green/80 text-sm font-medium"
              >
                View Resource
              </a>
            )}
          </div>
        </div>
      );
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Research Resources
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Explore our comprehensive collection of publications, datasets, software tools, 
              and educational materials advancing AI and data science in healthcare.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">150+</div>
                <div className="text-white/80">Publications</div>
              </div>
              <div className="text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">25+</div>
                <div className="text-white/80">Datasets</div>
              </div>
              <div className="text-center">
                <Code className="h-8 w-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">12+</div>
                <div className="text-white/80">Software Tools</div>
              </div>
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-white/80">Educational Resources</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <ResourceFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={availableCategories}
              availableTags={availableTags}
            />
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {pagination ? `${pagination.total} resources found` : 'Loading...'}
              </h2>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid'
                      ? "bg-tulane-green text-white"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'list'
                      ? "bg-tulane-green text-white"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bookmarks Button */}
            <button
              onClick={() => setShowBookmarks(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              My Bookmarks ({bookmarks.length})
            </button>
          </motion.div>

          {/* Resources Grid/List */}
          {loading === 'loading' && resources.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-tulane-green" />
              <span className="ml-2 text-gray-600">Loading resources...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">Error loading resources</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}
            >
              {resources.map((resource) => renderResourceCard(resource))}
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
                  'Load More Resources'
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bookmark Manager Modal */}
      <BookmarkManager
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
      />
    </div>
  );
}