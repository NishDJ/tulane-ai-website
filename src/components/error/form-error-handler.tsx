'use client';

import { useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRetry } from '@/hooks/useRetry';

interface FormErrorHandlerProps {
  children: (props: {
    isSubmitting: boolean;
    error: string | null;
    success: boolean;
    submitWithErrorHandling: (submitFn: () => Promise<void>) => Promise<void>;
    reset: () => void;
  }) => React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
}

export default function FormErrorHandler({
  children,
  onSuccess,
  onError,
  maxRetries = 3
}: FormErrorHandlerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { execute, retry, isRetrying, canRetry } = useRetry({
    maxRetries,
    retryDelay: 1000,
    onRetry: (attempt) => {
      console.log(`Retrying form submission, attempt ${attempt}`);
    },
    onMaxRetriesReached: () => {
      setError('Maximum retry attempts reached. Please try again later.');
    }
  });

  const submitWithErrorHandling = useCallback(async (submitFn: () => Promise<void>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await execute(submitFn);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  }, [execute, onSuccess, onError]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  }, []);

  return (
    <>
      {children({
        isSubmitting: isSubmitting || isRetrying,
        error,
        success,
        submitWithErrorHandling,
        reset
      })}
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {canRetry && (
                <button
                  onClick={retry}
                  disabled={isRetrying}
                  className={cn(
                    'mt-2 inline-flex items-center text-sm text-red-600 hover:text-red-800',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <RefreshCw className={cn('h-4 w-4 mr-1', isRetrying && 'animate-spin')} />
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <p className="text-sm text-green-700">
              Your submission was successful!
            </p>
          </div>
        </div>
      )}
    </>
  );
}