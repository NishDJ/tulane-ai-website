import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { mockFetch, mockLocalStorage } from '@/test/utils';
import userEvent from '@testing-library/user-event';

// Mock components for integration testing
const MockContactForm = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      alert('Form submitted successfully');
    } else {
      alert('Form submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form">
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required />
      
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />
      
      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" required></textarea>
      
      <button type="submit">Submit</button>
    </form>
  );
};

const MockSearchComponent = () => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        data-testid="search-input"
      />
      
      {loading && <div data-testid="loading">Loading...</div>}
      
      <div data-testid="search-results">
        {results.map((result, index) => (
          <div key={index} data-testid="search-result">
            <h3>{result.title}</h3>
            <p>{result.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MockBookmarkManager = () => {
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const addBookmark = (id: string) => {
    const updated = [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b !== id);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  return (
    <div>
      <button onClick={() => addBookmark('item-1')} data-testid="add-bookmark">
        Add Bookmark
      </button>
      <button onClick={() => removeBookmark('item-1')} data-testid="remove-bookmark">
        Remove Bookmark
      </button>
      <div data-testid="bookmark-count">{bookmarks.length}</div>
    </div>
  );
};

// Add React import for the mock components
import React from 'react';

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Contact Form Submission Flow', () => {
    it('should submit form successfully with valid data', async () => {
      const user = userEvent.setup();
      mockFetch({ success: true, message: 'Form submitted' });
      
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<MockContactForm />);
      
      // Fill out the form
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'Test message');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      
      // Wait for the submission to complete
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Form submitted successfully');
      });
      
      alertSpy.mockRestore();
    });

    it('should handle form submission errors', async () => {
      const user = userEvent.setup();
      mockFetch({ error: 'Server error' }, false);
      
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<MockContactForm />);
      
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'Test message');
      
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Form submission failed');
      });
      
      alertSpy.mockRestore();
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();
      render(<MockContactForm />);
      
      // Try to submit without filling required fields
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      
      // Check that HTML5 validation prevents submission
      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toBeInvalid();
    });
  });

  describe('Search Functionality Flow', () => {
    it('should perform search and display results', async () => {
      const user = userEvent.setup();
      const mockResults = {
        results: [
          { title: 'Dr. John Doe', content: 'Professor of AI' },
          { title: 'AI Research Project', content: 'Machine learning research' },
        ],
      };
      
      mockFetch(mockResults);
      
      render(<MockSearchComponent />);
      
      const searchInput = screen.getByTestId('search-input');
      
      // Type in search query
      await user.type(searchInput, 'machine learning');
      
      // Wait for results (loading state might be too fast to catch)
      await waitFor(() => {
        expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
        expect(screen.getByText('AI Research Project')).toBeInTheDocument();
      });
      
      const results = screen.getAllByTestId('search-result');
      expect(results).toHaveLength(2);
    });

    it('should handle empty search queries', async () => {
      const user = userEvent.setup();
      render(<MockSearchComponent />);
      
      const searchInput = screen.getByTestId('search-input');
      
      // Type and then clear the search
      await user.type(searchInput, 'test');
      await user.clear(searchInput);
      
      // Should not show any results
      await waitFor(() => {
        const results = screen.queryAllByTestId('search-result');
        expect(results).toHaveLength(0);
      });
    });

    it('should handle search errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock fetch to reject
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      render(<MockSearchComponent />);
      
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test query');
      
      // Should not crash and should show no results
      await waitFor(() => {
        const results = screen.queryAllByTestId('search-result');
        expect(results).toHaveLength(0);
      });
    });

    it('should debounce search requests', async () => {
      const user = userEvent.setup();
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });
      global.fetch = fetchSpy;
      
      render(<MockSearchComponent />);
      
      const searchInput = screen.getByTestId('search-input');
      
      // Type multiple characters quickly
      await user.type(searchInput, 'test');
      
      // Should only make one request after debounce
      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Bookmark Management Flow', () => {
    beforeEach(() => {
      // Mock localStorage
      const mockStorage = mockLocalStorage();
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
      });
    });

    it('should add and remove bookmarks', async () => {
      const user = userEvent.setup();
      render(<MockBookmarkManager />);
      
      const addButton = screen.getByTestId('add-bookmark');
      const removeButton = screen.getByTestId('remove-bookmark');
      const countDisplay = screen.getByTestId('bookmark-count');
      
      // Initially no bookmarks
      expect(countDisplay).toHaveTextContent('0');
      
      // Add a bookmark
      await user.click(addButton);
      expect(countDisplay).toHaveTextContent('1');
      
      // Remove the bookmark
      await user.click(removeButton);
      expect(countDisplay).toHaveTextContent('0');
    });

    it('should persist bookmarks in localStorage', async () => {
      const user = userEvent.setup();
      render(<MockBookmarkManager />);
      
      const addButton = screen.getByTestId('add-bookmark');
      
      // Add a bookmark
      await user.click(addButton);
      
      // Check localStorage was called
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'bookmarks',
        JSON.stringify(['item-1'])
      );
    });

    it('should load bookmarks from localStorage on mount', () => {
      // Pre-populate localStorage
      localStorage.setItem('bookmarks', JSON.stringify(['item-1', 'item-2']));
      
      render(<MockBookmarkManager />);
      
      const countDisplay = screen.getByTestId('bookmark-count');
      expect(countDisplay).toHaveTextContent('2');
    });
  });

  describe('Navigation Flow', () => {
    it('should handle navigation between pages', () => {
      // Simple navigation test without Next.js router
      const NavigationTest = () => {
        const [currentPage, setCurrentPage] = React.useState('/');
        
        return (
          <div>
            <div data-testid="current-page">{currentPage}</div>
            <button onClick={() => setCurrentPage('/faculty/john-doe')}>
              View Faculty
            </button>
            <button onClick={() => setCurrentPage('/research')}>
              View Research
            </button>
          </div>
        );
      };

      render(<NavigationTest />);
      
      expect(screen.getByTestId('current-page')).toHaveTextContent('/');
      
      fireEvent.click(screen.getByText('View Faculty'));
      expect(screen.getByTestId('current-page')).toHaveTextContent('/faculty/john-doe');
      
      fireEvent.click(screen.getByText('View Research'));
      expect(screen.getByTestId('current-page')).toHaveTextContent('/research');
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock fetch to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      render(<MockSearchComponent />);
      
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');
      
      // Should not crash the application
      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });
    });

    it('should handle malformed API responses', async () => {
      const user = userEvent.setup();
      
      // Mock fetch to return malformed response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null),
      });
      
      render(<MockSearchComponent />);
      
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');
      
      // Should handle gracefully and show no results
      await waitFor(() => {
        const results = screen.queryAllByTestId('search-result');
        expect(results).toHaveLength(0);
      });
    });
  });
});