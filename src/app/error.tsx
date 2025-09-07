'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
    
    // Report to error monitoring in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service
      console.error('Production error:', {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl">
        {/* Error Visual */}
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 text-red-500 mx-auto mb-6" />
          <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We encountered an unexpected error while processing your request. 
          Our team has been notified and is working to fix the issue.
        </p>

        {/* Error Details for Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
            <p className="text-sm text-red-700 mb-2">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-red-600">Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-tulane-green text-white rounded-lg hover:bg-tulane-green/90 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 text-tulane-green hover:text-tulane-green/80 transition-colors"
          >
            <Mail className="h-5 w-5 mr-2" />
            Report Issue
          </Link>
        </div>

        {/* Help Text */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500">
            If this problem persists, please{' '}
            <Link
              href="/contact"
              className="text-tulane-green hover:text-tulane-green/80 underline"
            >
              contact our support team
            </Link>{' '}
            with details about what you were trying to do.
          </p>
        </div>
      </div>
    </div>
  );
}