'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { type FacultyMember, type SearchFilters } from '@/types';

interface FacultySearchProps {
  allFaculty: FacultyMember[];
  onFilterChange: (filters: SearchFilters) => void;
  className?: string;
}

export function FacultySearch({ allFaculty, onFilterChange, className = '' }: FacultySearchProps) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Get all unique research areas for filtering
  const allResearchAreas = useMemo(() => {
    const areas = new Set<string>();
    allFaculty.forEach(member => {
      member.researchAreas.forEach(area => areas.add(area));
    });
    return Array.from(areas).sort();
  }, [allFaculty]);

  // Update filters when search or tags change
  useEffect(() => {
    const filters: SearchFilters = {};
    
    if (debouncedQuery.trim()) {
      filters.query = debouncedQuery.trim();
    }
    
    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }
    
    onFilterChange(filters);
  }, [debouncedQuery, selectedTags, onFilterChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setShowFilters(false);
  };

  const hasActiveFilters = query.trim() || selectedTags.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search faculty by name, title, or research area..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-gray-900 placeholder-gray-500 focus:border-tulane-green focus:outline-none focus:ring-2 focus:ring-tulane-green/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tulane-green/20"
        >
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${
              showFilters ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-lg bg-tulane-green/10 px-3 py-2 text-sm font-medium text-tulane-green hover:bg-tulane-green/20"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </motion.button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6"
          >
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Research Areas</h3>
              <div className="flex flex-wrap gap-2">
                {allResearchAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => handleTagToggle(area)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                      selectedTags.includes(area)
                        ? 'bg-tulane-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {selectedTags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-3 py-1 text-sm font-medium text-tulane-green"
              >
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 hover:text-tulane-green/70"
                  aria-label={`Remove ${tag} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}