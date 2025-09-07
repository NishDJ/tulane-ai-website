import { useState, useEffect } from 'react';
import { type BookmarkItem } from '@/types';

interface UseBookmarksReturn {
  bookmarks: BookmarkItem[];
  isBookmarked: (id: string) => boolean;
  addBookmark: (item: Omit<BookmarkItem, 'addedAt'>) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (item: Omit<BookmarkItem, 'addedAt'>) => void;
  clearBookmarks: () => void;
  getBookmarksByType: (type: BookmarkItem['type']) => BookmarkItem[];
}

const BOOKMARKS_STORAGE_KEY = 'tulane-ai-bookmarks';

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) {
        const parsedBookmarks = JSON.parse(stored);
        // Ensure dates are properly parsed
        const bookmarksWithDates = parsedBookmarks.map((bookmark: BookmarkItem & { addedAt: string }) => ({
          ...bookmark,
          addedAt: new Date(bookmark.addedAt)
        }));
        setBookmarks(bookmarksWithDates);
      }
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }, [bookmarks]);

  const isBookmarked = (id: string): boolean => {
    return bookmarks.some(bookmark => bookmark.id === id);
  };

  const addBookmark = (item: Omit<BookmarkItem, 'addedAt'>) => {
    if (isBookmarked(item.id)) {
      return; // Already bookmarked
    }

    const newBookmark: BookmarkItem = {
      ...item,
      addedAt: new Date()
    };

    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const toggleBookmark = (item: Omit<BookmarkItem, 'addedAt'>) => {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark(item);
    }
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  const getBookmarksByType = (type: BookmarkItem['type']): BookmarkItem[] => {
    return bookmarks.filter(bookmark => bookmark.type === type);
  };

  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearBookmarks,
    getBookmarksByType,
  };
}

// Hook for managing bookmarks with additional metadata
export function useBookmarksWithMetadata() {
  const bookmarkHook = useBookmarks();
  
  const getBookmarkStats = () => {
    const stats = {
      total: bookmarkHook.bookmarks.length,
      byType: {
        publication: 0,
        dataset: 0,
        software: 0,
        resource: 0
      },
      recentlyAdded: 0 // Added in last 7 days
    };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    bookmarkHook.bookmarks.forEach(bookmark => {
      stats.byType[bookmark.type]++;
      if (bookmark.addedAt > oneWeekAgo) {
        stats.recentlyAdded++;
      }
    });

    return stats;
  };

  const getRecentBookmarks = (limit: number = 5): BookmarkItem[] => {
    return bookmarkHook.bookmarks
      .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
      .slice(0, limit);
  };

  const searchBookmarks = (query: string): BookmarkItem[] => {
    const searchTerm = query.toLowerCase();
    return bookmarkHook.bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.type.toLowerCase().includes(searchTerm)
    );
  };

  return {
    ...bookmarkHook,
    getBookmarkStats,
    getRecentBookmarks,
    searchBookmarks,
  };
}