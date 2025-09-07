'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  maxRetries?: number;
}

export default function RetryButton({
  onRetry,
  disabled = false,
  className,
  children = 'Try Again',
  maxRetries = 3
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    if (isRetrying || disabled || retryCount >= maxRetries) return;

    setIsRetrying(true);
    try {
      await onRetry();
      setRetryCount(0); // Reset on success
    } catch (error) {
      setRetryCount(prev => prev + 1);
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const isMaxRetriesReached = retryCount >= maxRetries;

  return (
    <button
      onClick={handleRetry}
      disabled={disabled || isRetrying || isMaxRetriesReached}
      className={cn(
        'inline-flex items-center px-4 py-2 rounded-lg transition-colors',
        'bg-tulane-green text-white hover:bg-tulane-green/90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <RefreshCw 
        className={cn(
          'h-4 w-4 mr-2',
          isRetrying && 'animate-spin'
        )} 
      />
      {isRetrying ? 'Retrying...' : 
       isMaxRetriesReached ? 'Max retries reached' : 
       children}
    </button>
  );
}