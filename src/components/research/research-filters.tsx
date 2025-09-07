'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Tag, 
  CheckCircle,
  Circle,
  PlayCircle,
  ChevronDown
} from 'lucide-react';
import { type ResearchProject, type SearchFilters } from '@/types';

interface ResearchFiltersProps {
  projects: ResearchProject[];
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export function ResearchFilters({ projects, onFiltersChange, className = '' }: ResearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract all unique tags from projects
  const allTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort();

  // Extract all unique statuses
  const allStatuses = Array.from(
    new Set(projects.map(project => project.status))
  ).sort();

  // Update filters when any filter changes
  useEffect(() => {
    const filters: SearchFilters = {
      query: searchQuery || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      status: selectedStatus || undefined,
    };

    onFiltersChange(filters);
  }, [searchQuery, selectedTags, selectedStatus, onFiltersChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(prev => prev === status ? '' : status);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedStatus('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'planned':
        return <Circle className="h-4 w-4 text-orange-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string, isSelected: boolean) => {
    const baseClasses = 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer';
    
    if (isSelected) {
      switch (status) {
        case 'active':
          return `${baseClasses} bg-green-100 text-green-800 border-2 border-green-300`;
        case 'completed':
          return `${baseClasses} bg-blue-100 text-blue-800 border-2 border-blue-300`;
        case 'planned':
          return `${baseClasses} bg-orange-100 text-orange-800 border-2 border-orange-300`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 border-2 border-gray-300`;
      }
    }
    
    return `${baseClasses} bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300`;
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    selectedTags.length + 
    (selectedStatus ? 1 : 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search research projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm placeholder-gray-500 focus:border-tulane-green focus:outline-none focus:ring-1 focus:ring-tulane-green"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tulane-green focus:ring-offset-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-tulane-green text-xs font-medium text-white">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Project Status</h3>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={getStatusColor(status, selectedStatus === status)}
                    >
                      {getStatusIcon(status)}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Research Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-tulane-green text-white border-2 border-tulane-green'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-3 py-1 text-sm font-medium text-tulane-green">
              <Search className="h-3 w-3" />
              &quot;{searchQuery}&quot;
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:text-tulane-green/80"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {selectedStatus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-3 py-1 text-sm font-medium text-tulane-green">
              {getStatusIcon(selectedStatus)}
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              <button
                onClick={() => setSelectedStatus('')}
                className="ml-1 hover:text-tulane-green/80"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-3 py-1 text-sm font-medium text-tulane-green"
            >
              <Tag className="h-3 w-3" />
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:text-tulane-green/80"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}