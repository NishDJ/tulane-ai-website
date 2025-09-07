'use client';

import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

interface UseRetryReturn<T> {
  execute: (fn: () => Promise<T>) => Promise<T>;
  retry: () => Promise<void>;
  isRetrying: boolean;
  retryCount: number;
  canRetry: boolean;
  reset: () => void;
}

export function useRetry<T = any>({
  maxRetries = 3,
  retryDelay = 1000,
  backoffMultiplier = 2,
  onRetry,
  onMaxRetriesReached
}: UseRetryOptions = {}): UseRetryReturn<T> {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFailedFunction, setLastFailedFunction] = useState<(() => Promise<T>) | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const execute = useCallback(async (fn: () => Promise<T>): Promise<T> => {
    setLastFailedFunction(() => fn);
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          setIsRetrying(true);
          const delay = retryDelay * Math.pow(backoffMultiplier, attempt - 1);
          await sleep(delay);
          onRetry?.(attempt);
        }

        const result = await fn();
        
        // Success - reset state
        setRetryCount(0);
        setIsRetrying(false);
        setLastFailedFunction(null);
        
        return result;
      } catch (error) {
        setRetryCount(attempt + 1);
        
        if (attempt === maxRetries) {
          setIsRetrying(false);
          onMaxRetriesReached?.();
          throw error;
        }
      }
    }

    throw new Error('Max retries exceeded');
  }, [maxRetries, retryDelay, backoffMultiplier, onRetry, onMaxRetriesReached]);

  const retry = useCallback(async (): Promise<void> => {
    if (!lastFailedFunction || retryCount >= maxRetries) {
      return;
    }

    try {
      await execute(lastFailedFunction);
    } catch (error) {
      // Error is already handled in execute
    }
  }, [lastFailedFunction, retryCount, maxRetries, execute]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
    setLastFailedFunction(null);
  }, []);

  const canRetry = retryCount < maxRetries && lastFailedFunction !== null;

  return {
    execute,
    retry,
    isRetrying,
    retryCount,
    canRetry,
    reset
  };
}