'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Clock, LayoutGrid } from 'lucide-react';
import { type ResearchProject, type SearchFilters } from '@/types';
import { ResearchCard } from './research-card';
import { ResearchDetail } from './research-detail';
import { ResearchFilters } from './research-filters';
import { ResearchTimeline } from './research-timeline';
import { filterResearchProjects } from '@/lib/client-utils';

interface ResearchGridProps {
  projects: ResearchProject[];
  className?: string;
}

type ViewMode = 'grid' | 'list' | 'timeline';

export function ResearchGrid({ projects, className = '' }: ResearchGridProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return filterResearchProjects(projects, filters);
  }, [projects, filters]);

  // Sort projects to show featured first, then by start date
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by start date (newest first)
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [filteredProjects]);

  const handleViewDetails = (project: ResearchProject) => {
    setSelectedProject(project);
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
  };

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'grid':
        return <LayoutGrid className="h-4 w-4" />;
      case 'list':
        return <List className="h-4 w-4" />;
      case 'timeline':
        return <Clock className="h-4 w-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Projects</h1>
          <p className="text-gray-600 mt-1">
            {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1">
          {(['grid', 'list', 'timeline'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-tulane-green text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {getViewModeIcon(mode)}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      {viewMode !== 'timeline' && (
        <ResearchFilters
          projects={projects}
          onFiltersChange={setFilters}
        />
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResearchTimeline projects={sortedProjects} />
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className={viewMode === 'list' ? 'w-full' : ''}
                >
                  <ResearchCard
                    project={project}
                    index={index}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <LayoutGrid className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <ResearchDetail
        project={selectedProject!}
        isOpen={!!selectedProject}
        onClose={handleCloseDetails}
      />
    </div>
  );
}