'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error
    console.error('Global application error:', error);
    
    // Report to error monitoring in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service
      console.error('Critical production error:', {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      });
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Critical Error
            </h1>
            
            <p className="text-gray-600 mb-8">
              A critical error occurred that prevented the application from loading properly.
            </p>

            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Reload Application
            </button>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-white border rounded text-xs overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}