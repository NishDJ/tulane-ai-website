'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  BookmarkCheck, 
  X, 
  Search,
  BookOpen,
  Database,
  Code,
  FileText,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { type BookmarkItem } from '@/types';
import { useBookmarksWithMetadata } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface BookmarkManagerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const typeIcons = {
  publication: BookOpen,
  dataset: Database,
  software: Code,
  resource: FileText,
};

const typeColors = {
  publication: 'text-blue-600 bg-blue-50',
  dataset: 'text-green-600 bg-green-50',
  software: 'text-purple-600 bg-purple-50',
  resource: 'text-orange-600 bg-orange-50',
};

export function BookmarkManager({ isOpen, onClose, className }: BookmarkManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<BookmarkItem['type'] | 'all'>('all');
  
  const {
    bookmarks,
    removeBookmark,
    clearBookmarks,
    getBookmarkStats,
    searchBookmarks,
    getBookmarksByType
  } = useBookmarksWithMetadata();

  const stats = getBookmarkStats();
  
  const filteredBookmarks = searchQuery 
    ? searchBookmarks(searchQuery)
    : selectedType === 'all' 
      ? bookmarks 
      : getBookmarksByType(selectedType);

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <BookmarkCheck className="h-6 w-6 text-tulane-green" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Bookmarks</h2>
                <p className="text-sm text-gray-600">
                  {stats.total} bookmarks saved
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-tulane-green">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.byType.publication}</div>
                <div className="text-sm text-gray-600">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.byType.dataset}</div>
                <div className="text-sm text-gray-600">Datasets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.byType.software}</div>
                <div className="text-sm text-gray-600">Software</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.byType.resource}</div>
                <div className="text-sm text-gray-600">Resources</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedType === 'all'
                      ? "bg-tulane-green text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  All
                </button>
                {Object.entries(typeIcons).map(([type, Icon]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as BookmarkItem['type'])}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedType === type
                        ? "bg-tulane-green text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Clear All */}
              {bookmarks.length > 0 && (
                <button
                  onClick={clearBookmarks}
                  className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Bookmarks List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No matching bookmarks' : 'No bookmarks yet'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start bookmarking resources to see them here'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookmarks.map((bookmark) => {
                  const Icon = typeIcons[bookmark.type];
                  return (
                    <motion.div
                      key={bookmark.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        typeColors[bookmark.type]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {bookmark.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="capitalize">{bookmark.type}</span>
                          <span>•</span>
                          <span>Added {bookmark.addedAt.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLinkClick(bookmark.url)}
                          className="p-2 text-tulane-green hover:bg-tulane-green/10 rounded-lg transition-colors"
                          title="Open link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove bookmark"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}