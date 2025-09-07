'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  BookOpen,
  Database,
  Code,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ResourceType = 'all' | 'publications' | 'datasets' | 'software' | 'educational';

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

interface ResourceFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  availableTags: string[];
  className?: string;
}

const resourceTypes = [
  { value: 'all', label: 'All Resources', icon: FileText },
  { value: 'publications', label: 'Publications', icon: BookOpen },
  { value: 'datasets', label: 'Datasets', icon: Database },
  { value: 'software', label: 'Software Tools', icon: Code },
  { value: 'educational', label: 'Educational', icon: FileText },
];

const sortOptions = [
  { value: 'lastUpdated', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'year', label: 'Year' },
  { value: 'citations', label: 'Citations' },
];

export function ResourceFilters({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  className
}: ResourceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.query);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, query: searchQuery });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateFilter = (key: keyof FilterOptions, value: string | boolean | string[] | null) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
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
    setSearchQuery('');
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.type !== 'all' ||
    filters.category !== '' ||
    filters.tags.length > 0 ||
    filters.featured !== null ||
    filters.openAccess !== null ||
    filters.accessLevel !== '' ||
    filters.query !== '';

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
        />
      </div>

      {/* Resource Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {resourceTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => updateFilter('type', type.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                filters.type === type.value
                  ? "bg-tulane-green text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-tulane-green hover:text-tulane-green/80 font-medium"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
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

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={cn(
                      "px-3 py-2 border border-gray-300 rounded-lg font-medium",
                      "hover:bg-gray-50 transition-colors"
                    )}
                  >
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>

              {/* Access Level (for datasets) */}
              {(filters.type === 'datasets' || filters.type === 'all') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <select
                    value={filters.accessLevel}
                    onChange={(e) => updateFilter('accessLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                  >
                    <option value="">All Access Levels</option>
                    <option value="public">Public</option>
                    <option value="restricted">Restricted</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              )}

              {/* Featured Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFilter('featured', filters.featured === true ? null : true)}
                    className={cn(
                      "flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors",
                      filters.featured === true
                        ? "bg-tulane-green text-white border-tulane-green"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Featured Only
                  </button>
                </div>
              </div>

              {/* Open Access Filter (for publications) */}
              {(filters.type === 'publications' || filters.type === 'all') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFilter('openAccess', filters.openAccess === true ? null : true)}
                      className={cn(
                        "flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors",
                        filters.openAccess === true
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Open Access
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tags Filter */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 12).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const newTags = filters.tags.includes(tag)
                        ? filters.tags.filter(t => t !== tag)
                        : [...filters.tags, tag];
                      updateFilter('tags', newTags);
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                      filters.tags.includes(tag)
                        ? "bg-tulane-green text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.type !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-tulane-green/10 text-tulane-green text-sm rounded-full">
                Type: {resourceTypes.find(t => t.value === filters.type)?.label}
                <button onClick={() => updateFilter('type', 'all')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-tulane-green/10 text-tulane-green text-sm rounded-full">
                Category: {filters.category}
                <button onClick={() => updateFilter('category', '')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-tulane-green/10 text-tulane-green text-sm rounded-full">
                {tag}
                <button onClick={() => updateFilter('tags', filters.tags.filter(t => t !== tag))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}