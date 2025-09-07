'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  ExternalLink, 
  Download, 
  Quote,
  Bookmark,
  BookmarkCheck,
  Lock,
  Unlock
} from 'lucide-react';
import { type PublicationResource } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface PublicationCardProps {
  publication: PublicationResource;
  className?: string;
  showFullAbstract?: boolean;
}

export function PublicationCard({ 
  publication, 
  className,
  showFullAbstract = false 
}: PublicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(showFullAbstract);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(publication.id);
  const abstractPreview = publication.abstract.length > 200 
    ? publication.abstract.substring(0, 200) + '...' 
    : publication.abstract;

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleBookmark({
      id: publication.id,
      type: 'publication',
      title: publication.title,
      url: publication.url || publication.pdfUrl || '#'
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
      {publication.featured && (
        <div className="absolute -top-2 -right-2 bg-tulane-green text-white text-xs px-2 py-1 rounded-full font-medium">
          Featured
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-tulane-green" />
            <span className="text-sm font-medium text-tulane-green bg-tulane-green/10 px-2 py-1 rounded-full">
              {publication.category}
            </span>
            {publication.openAccess && (
              <div className="flex items-center gap-1 text-green-600">
                <Unlock className="h-4 w-4" />
                <span className="text-xs font-medium">Open Access</span>
              </div>
            )}
            {!publication.openAccess && (
              <div className="flex items-center gap-1 text-gray-500">
                <Lock className="h-4 w-4" />
                <span className="text-xs">Restricted</span>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-tulane-green transition-colors">
            {publication.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{publication.authors.slice(0, 3).join(', ')}</span>
              {publication.authors.length > 3 && (
                <span className="text-gray-400">+{publication.authors.length - 3} more</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{publication.year}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 font-medium mb-2">
            {publication.journal}
          </p>
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

      {/* Abstract */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {isExpanded ? publication.abstract : abstractPreview}
        </p>
        {publication.abstract.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-tulane-green text-sm font-medium mt-2 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {publication.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {publication.tags.length > 4 && (
          <span className="text-xs text-gray-500">
            +{publication.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {publication.citationCount && (
            <div className="flex items-center gap-1">
              <Quote className="h-4 w-4" />
              <span>{publication.citationCount} citations</span>
            </div>
          )}
          {publication.doi && (
            <span className="font-mono text-xs">
              DOI: {publication.doi}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {publication.pdfUrl && (
            <button
              onClick={(e) => handleLinkClick(publication.pdfUrl!, e)}
              className="flex items-center gap-1 text-tulane-green hover:text-tulane-green/80 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
          )}
          {publication.url && (
            <button
              onClick={(e) => handleLinkClick(publication.url!, e)}
              className="flex items-center gap-1 text-tulane-green hover:text-tulane-green/80 text-sm font-medium transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}