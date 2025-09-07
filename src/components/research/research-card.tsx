'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ResearchImage } from '@/components/ui/optimized-image';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Tag, 
  ExternalLink, 
  FileText, 
  Database,
  CheckCircle,
  Circle,
  PlayCircle
} from 'lucide-react';
import { type ResearchProject } from '@/types';

interface ResearchCardProps {
  project: ResearchProject;
  index?: number;
  onViewDetails?: (project: ResearchProject) => void;
}

export function ResearchCard({ project, index = 0, onViewDetails }: ResearchCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(new Date(date));
  };

  const primaryImage = project.images[0] || '/images/research/default-research.jpg';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl touch-manipulation"
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center rounded-full bg-tulane-green px-2.5 py-0.5 text-xs font-medium text-white">
            Featured
          </span>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute right-4 top-4 z-10">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)}
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.div variants={imageVariants} className="h-full w-full">
          <ResearchImage
            src={primaryImage}
            alt={`${project.title} research project`}
            fill
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>

        {/* Hover Overlay */}
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        >
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4 text-white text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(project.startDate)}</span>
                {project.endDate && (
                  <>
                    <span>-</span>
                    <span>{formatDate(project.endDate)}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{project.collaborators.length + 1} members</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-tulane-green transition-colors duration-200 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm font-medium text-tulane-blue mt-1">
            PI: {project.principalInvestigator}
          </p>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-2 py-1 text-xs font-medium text-tulane-green"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Funding Source */}
        {project.fundingSource && (
          <div className="mb-4 text-xs text-gray-500">
            <strong>Funding:</strong> {project.fundingSource}
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
          {project.publications && project.publications.length > 0 && (
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{project.publications.length} publications</span>
            </div>
          )}
          {project.datasets && project.datasets.length > 0 && (
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>{project.datasets.length} datasets</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(project)}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-tulane-green px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-tulane-green/90 focus:outline-none focus:ring-2 focus:ring-tulane-green focus:ring-offset-2"
          >
            View Details
          </button>
          <Link
            href={`/research/${project.id}`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tulane-green focus:ring-offset-2"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}