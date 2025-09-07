'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  File,
  Search,
  Filter,
  Calendar,
  Tag
} from 'lucide-react';
import { EducationalResource } from '@/types';
import { cn } from '@/lib/utils';

interface ResourcesSectionProps {
  resources: EducationalResource[];
  className?: string;
}

interface ResourceCardProps {
  resource: EducationalResource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const getTypeIcon = (type: EducationalResource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <LinkIcon className="h-5 w-5" />;
      case 'document':
        return <File className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: EducationalResource['type']) => {
    switch (type) {
      case 'pdf':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'video':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'link':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'document':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatFileSize = (size?: string) => {
    if (!size) return null;
    return size;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleResourceClick = () => {
    if (resource.downloadable) {
      // For downloadable resources, trigger download
      const link = document.createElement('a');
      link.href = resource.url;
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For non-downloadable resources, open in new tab
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
      onClick={handleResourceClick}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'p-2 rounded-lg border',
          getTypeColor(resource.type)
        )}>
          {getTypeIcon(resource.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {resource.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-400 ml-2">
              {resource.downloadable ? (
                <Download className="h-4 w-4" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {resource.category}
              </span>
              
              {resource.size && (
                <span>{formatFileSize(resource.size)}</span>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Updated {formatDate(resource.lastUpdated)}</span>
              </div>
            </div>
          </div>
          
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  <Tag className="h-2 w-2" />
                  {tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{resource.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ResourcesSection({ resources, className }: ResourcesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<EducationalResource['type'] | 'all'>('all');
  const [showDownloadableOnly, setShowDownloadableOnly] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(resources.map(r => r.category))).sort();

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDownloadable = !showDownloadableOnly || resource.downloadable;
    
    return matchesSearch && matchesCategory && matchesType && matchesDownloadable;
  });

  // Group resources by category for display
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, EducationalResource[]>);

  const totalResources = resources.length;
  const downloadableCount = resources.filter(r => r.downloadable).length;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Educational Resources</h2>
        <p className="text-gray-600 mb-6">
          Access a comprehensive collection of educational materials, including guides, videos, templates, and tools 
          to support your learning journey in AI and data science.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalResources}</div>
            <div className="text-sm text-blue-800">Total Resources</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{downloadableCount}</div>
            <div className="text-sm text-green-800">Downloadable</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-purple-800">Categories</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="video">Videos</option>
            <option value="link">External Links</option>
            <option value="document">Documents</option>
          </select>

          {/* Downloadable Filter */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showDownloadableOnly}
              onChange={(e) => setShowDownloadableOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Downloadable only</span>
          </label>
        </div>
      </div>

      {/* Resources Grid */}
      {Object.keys(groupedResources).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria to find more resources.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedResources).map(([category, categoryResources]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                {category}
                <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                  {categoryResources.length}
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}