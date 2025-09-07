'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearchSuggestions } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className,
  showSuggestions = true,
  autoFocus = false,
  size = 'md',
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const { suggestions, isLoading } = useSearchSuggestions(
    showSuggestions ? value : '',
    5
  );

  const showSuggestionsList = showSuggestions && isFocused && suggestions.length > 0;

  const sizeClasses = {
    sm: 'h-9 sm:h-8 text-sm px-3',
    md: 'h-11 sm:h-10 text-base px-4',
    lg: 'h-12 sm:h-12 text-lg px-5',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch?.(value.trim());
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          onChange(selectedSuggestion);
          onSearch?.(selectedSuggestion);
          setIsFocused(false);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch?.(suggestion);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={iconSizes[size]}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicks
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-tulane-green focus:outline-none focus:ring-2 focus:ring-tulane-green/20 transition-colors',
              sizeClasses[size],
              className
            )}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {isLoading && (
              <Loader2 className="text-gray-400 animate-spin" size={iconSizes[size] - 4} />
            )}
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={iconSizes[size] - 4} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestionsList && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg',
                selectedSuggestionIndex === index && 'bg-tulane-green/10 text-tulane-green'
              )}
            >
              <div className="flex items-center">
                <Search className="mr-2 text-gray-400" size={16} />
                <span className="truncate">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}