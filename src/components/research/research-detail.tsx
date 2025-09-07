'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Users, 
  Tag, 
  ExternalLink, 
  DollarSign,
  User,
  Download,
  Eye,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { type ResearchProject } from '@/types';

interface ResearchDetailProps {
  project: ResearchProject;
  isOpen: boolean;
  onClose: () => void;
}

export function ResearchDetail({ project, isOpen, onClose }: ResearchDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { delay: 0.1, duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'public':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'restricted':
        return <Eye className="h-4 w-4 text-orange-600" />;
      case 'private':
        return <Lock className="h-4 w-4 text-red-600" />;
      default:
        return <Globe className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'restricted':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'private':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image Gallery */}
          {project.images.length > 0 && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
              <Image
                src={project.images[currentImageIndex] || '/images/research/default-research.jpg'}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              
              {/* Image Navigation */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-orange-100 text-orange-800 border-orange-200'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span><strong>PI:</strong> {project.principalInvestigator}</span>
                </div>
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
                  <span>{project.collaborators.length + 1} team members</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            {/* Team Members */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Members</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-3 py-1 font-medium text-tulane-green">
                    <User className="h-3 w-3" />
                    {project.principalInvestigator} (Principal Investigator)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.collaborators.map((collaborator, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      <User className="h-3 w-3" />
                      {collaborator}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Areas</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-3 py-1 text-sm font-medium text-tulane-green"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Funding */}
            {project.fundingSource && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Funding</h3>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{project.fundingSource}</span>
                </div>
              </div>
            )}

            {/* Publications */}
            {project.publications && project.publications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Publications</h3>
                <div className="space-y-3">
                  {project.publications.map((publication, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">{publication.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {publication.authors.join(', ')} ({publication.year})
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <em>{publication.journal}</em>
                      </p>
                      {(publication.doi || publication.url) && (
                        <div className="flex gap-2">
                          {publication.doi && (
                            <a
                              href={`https://doi.org/${publication.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-tulane-green hover:text-tulane-green/80"
                            >
                              <ExternalLink className="h-3 w-3" />
                              DOI
                            </a>
                          )}
                          {publication.url && (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-tulane-green hover:text-tulane-green/80"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Datasets */}
            {project.datasets && project.datasets.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Datasets</h3>
                <div className="space-y-3">
                  {project.datasets.map((dataset, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-medium text-gray-900">{dataset.name}</h4>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getAccessLevelColor(dataset.accessLevel)}`}>
                          {getAccessLevelIcon(dataset.accessLevel)}
                          {dataset.accessLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <span><strong>Size:</strong> {dataset.size}</span>
                        <span><strong>Format:</strong> {dataset.format}</span>
                      </div>
                      {dataset.downloadUrl && dataset.accessLevel === 'public' && (
                        <a
                          href={dataset.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-tulane-green hover:text-tulane-green/80"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}