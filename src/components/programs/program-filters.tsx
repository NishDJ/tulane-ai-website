'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Program } from '@/types';

interface ProgramFiltersProps {
  onFiltersChange: (filters: ProgramFilters) => void;
  className?: string;
}

export interface ProgramFilters {
  search: string;
  type: Program['type'] | 'all';
  level: Program['level'] | 'all';
  format: Program['format'] | 'all';
  featured: boolean | null;
}

export function ProgramFilters({ onFiltersChange, className }: ProgramFiltersProps) {
  const [filters, setFilters] = useState<ProgramFilters>({
    search: '',
    type: 'all',
    level: 'all',
    format: 'all',
    featured: null,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<ProgramFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ProgramFilters = {
      search: '',
      type: 'all',
      level: 'all',
      format: 'all',
      featured: null,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.level !== 'all' ||
    filters.format !== 'all' ||
    filters.featured !== null;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search programs..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Expandable Filters */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {/* Program Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => updateFilters({ type: e.target.value as Program['type'] | 'all' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="degree">Degree Programs</option>
              <option value="certificate">Certificates</option>
              <option value="continuing-education">Continuing Education</option>
            </select>
          </div>

          {/* Program Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => updateFilters({ level: e.target.value as Program['level'] | 'all' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
              <option value="doctoral">Doctoral</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={filters.format}
              onChange={(e) => updateFilters({ format: e.target.value as Program['format'] | 'all' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Formats</option>
              <option value="on-campus">On Campus</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Featured Toggle */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured === true}
                onChange={(e) => updateFilters({ featured: e.target.checked ? true : null })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured programs only</span>
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}