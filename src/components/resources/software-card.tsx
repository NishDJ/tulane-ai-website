'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Download, 
  ExternalLink,
  Github,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Monitor,
  Users,
  Tag
} from 'lucide-react';
import { type SoftwareTool } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface SoftwareCardProps {
  software: SoftwareTool;
  className?: string;
  showFullDescription?: boolean;
}

export function SoftwareCard({ 
  software, 
  className,
  showFullDescription = false 
}: SoftwareCardProps) {
  const [isExpanded, setIsExpanded] = useState(showFullDescription);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(software.id);
  const descriptionPreview = software.description.length > 200 
    ? software.description.substring(0, 200) + '...' 
    : software.description;

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleBookmark({
      id: software.id,
      type: 'software',
      title: software.title,
      url: software.url || software.githubUrl || software.downloadUrl || '#'
    });
  };

  const handleLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300",
        "hover:border-tulane-green/20",
        className
      )}
    >
      {/* Featured Badge */}
      {software.featured && (
        <div className="absolute -top-2 -right-2 bg-tulane-green text-white text-xs px-2 py-1 rounded-full font-medium">
          Featured
        </div>
      )}      {
/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-tulane-green" />
            <span className="text-sm font-medium text-tulane-green bg-tulane-green/10 px-2 py-1 rounded-full">
              {software.category}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              v{software.version}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-tulane-green transition-colors">
            {software.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span>{software.platform.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{software.license}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Users className="h-4 w-4" />
            <span>Maintained by {software.maintainers.join(', ')}</span>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkToggle}
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            bookmarked 
              ? "text-tulane-green bg-tulane-green/10 hover:bg-tulane-green/20" 
              : "text-gray-400 hover:text-tulane-green hover:bg-tulane-green/10"
          )}
          title={bookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {isExpanded ? software.description : descriptionPreview}
        </p>
        {software.description.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-tulane-green text-sm font-medium mt-2 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Key Features */}
      {software.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {software.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1 h-1 bg-tulane-green rounded-full mt-2 flex-shrink-0"></span>
                <span>{feature}</span>
              </li>
            ))}
            {software.features.length > 3 && (
              <li className="text-gray-400 text-xs">
                +{software.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {software.requirements.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Requirements:</h4>
          <p className="text-sm text-blue-800">
            {software.requirements.join(', ')}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {software.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {software.tags.length > 4 && (
          <span className="text-xs text-gray-500">
            +{software.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Updated {new Date(software.lastUpdated).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-2">
          {software.documentationUrl && (
            <button
              onClick={(e) => handleLinkClick(software.documentationUrl!, e)}
              className="flex items-center gap-1 text-tulane-green hover:text-tulane-green/80 text-sm font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </button>
          )}
          {software.githubUrl && (
            <button
              onClick={(e) => handleLinkClick(software.githubUrl!, e)}
              className="flex items-center gap-1 text-tulane-green hover:text-tulane-green/80 text-sm font-medium transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </button>
          )}
          {software.downloadUrl && (
            <button
              onClick={(e) => handleLinkClick(software.downloadUrl!, e)}
              className="flex items-center gap-1 text-tulane-green hover:text-tulane-green/80 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}
          {software.url && !software.downloadUrl && (
            <button
              onClick={(e) => handleLinkClick(software.url!, e)}
              className="flex items-center gap-1 text-tulane-green hover:text-tulane-green/80 text-sm font-medium transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Visit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}