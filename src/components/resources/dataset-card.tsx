'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  HardDrive, 
  Download,
  Bookmark,
  BookmarkCheck,
  Lock,
  Unlock,
  Shield,
  FileText,
  Quote
} from 'lucide-react';
import { type DatasetResource } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface DatasetCardProps {
  dataset: DatasetResource;
  className?: string;
  showFullDescription?: boolean;
}

export function DatasetCard({ 
  dataset, 
  className,
  showFullDescription = false 
}: DatasetCardProps) {
  const [isExpanded, setIsExpanded] = useState(showFullDescription);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(dataset.id);
  const descriptionPreview = dataset.description.length > 200 
    ? dataset.description.substring(0, 200) + '...' 
    : dataset.description;

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'text-green-600 bg-green-50';
      case 'restricted': return 'text-yellow-600 bg-yellow-50';
      case 'private': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'public': return <Unlock className="h-4 w-4" />;
      case 'restricted': return <Shield className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleBookmark({
      id: dataset.id,
      type: 'dataset',
      title: dataset.title,
      url: dataset.downloadUrl || '#'
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
      {dataset.featured && (
        <div className="absolute -top-2 -right-2 bg-tulane-green text-white text-xs px-2 py-1 rounded-full font-medium">
          Featured
        </div>
      )}      {
/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-tulane-green" />
            <span className="text-sm font-medium text-tulane-green bg-tulane-green/10 px-2 py-1 rounded-full">
              {dataset.category}
            </span>
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              getAccessLevelColor(dataset.accessLevel)
            )}>
              {getAccessLevelIcon(dataset.accessLevel)}
              <span className="capitalize">{dataset.accessLevel}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-tulane-green transition-colors">
            {dataset.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <HardDrive className="h-4 w-4" />
              <span>{dataset.size}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{dataset.format.join(', ')}</span>
            </div>
            <span className="text-gray-400">v{dataset.version}</span>
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
          {isExpanded ? dataset.description : descriptionPreview}
        </p>
        {dataset.description.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-tulane-green text-sm font-medium mt-2 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Access Requirements */}
      {dataset.accessRequirements && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Access Requirements:</strong> {dataset.accessRequirements}
          </p>
        </div>
      )}

      {/* License */}
      {dataset.license && (
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            <strong>License:</strong> {dataset.license}
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {dataset.tags.length > 4 && (
          <span className="text-xs text-gray-500">
            +{dataset.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {dataset.citations && (
            <div className="flex items-center gap-1">
              <Quote className="h-4 w-4" />
              <span>{dataset.citations} citations</span>
            </div>
          )}
          <span>Updated {new Date(dataset.lastUpdated).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          {dataset.downloadUrl && (
            <button
              onClick={(e) => handleLinkClick(dataset.downloadUrl!, e)}
              className="flex items-center gap-1 text-tulane-green hover:text-tulane-green/80 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}