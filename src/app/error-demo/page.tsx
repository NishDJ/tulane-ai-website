'use client';

import { useState } from 'react';
import { 
  ErrorBoundary, 
  LoadingSpinner, 
  LoadingState, 
  RetryButton, 
  ProgressIndicator,
  FormErrorHandler 
} from '@/components/error';
import { useRetry, useOnlineStatus } from '@/hooks';

// Component that throws an error for testing
function ErrorComponent(): never {
  throw new Error('This is a test error for demonstration');
}

// Component that simulates async operation
function AsyncComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const simulateAsyncOperation = async () => {
    setIsLoading(true);
    setProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={simulateAsyncOperation}
        disabled={isLoading}
        className="px-4 py-2 bg-tulane-green text-white rounded hover:bg-tulane-green/90 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Start Async Operation'}
      </button>
      
      {isLoading && (
        <div className="space-y-4">
          <LoadingSpinner size="lg" />
          <ProgressIndicator 
            progress={progress} 
            showPercentage 
            label="Processing..." 
          />
        </div>
      )}
    </div>
  );
}

// Component that demonstrates retry functionality
function RetryComponent() {
  const { execute, retry, isRetrying, canRetry } = useRetry({
    maxRetries: 3,
    retryDelay: 1000
  });
  
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const failingOperation = async () => {
    // Simulate random failure
    if (Math.random() < 0.7) {
      throw new Error('Random failure occurred');
    }
    return 'Operation succeeded!';
  };

  const handleExecute = async () => {
    setError(null);
    setResult(null);
    
    try {
      const res = await execute(failingOperation);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleExecute}
        disabled={isRetrying}
        className="px-4 py-2 bg-tulane-blue text-white rounded hover:bg-tulane-blue/90 disabled:opacity-50"
      >
        {isRetrying ? 'Retrying...' : 'Execute Failing Operation'}
      </button>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">{error}</p>
          {canRetry && (
            <RetryButton 
              onRetry={retry}
              className="mt-2"
            />
          )}
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700">{result}</p>
        </div>
      )}
    </div>
  );
}

// Form component with error handling
function FormComponent() {
  return (
    <FormErrorHandler
      onSuccess={() => console.log('Form submitted successfully')}
      onError={(error) => console.error('Form error:', error)}
    >
      {({ isSubmitting, error, success, submitWithErrorHandling, reset }) => (
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await submitWithErrorHandling(async () => {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Simulate random failure
                if (Math.random() < 0.5) {
                  throw new Error('Form submission failed');
                }
              });
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-tulane-green"
              disabled={isSubmitting}
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-tulane-green text-white rounded hover:bg-tulane-green/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </form>
          
          {(error || success) && (
            <button
              onClick={reset}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </FormErrorHandler>
  );
}

export default function ErrorDemoPage() {
  const [showErrorComponent, setShowErrorComponent] = useState(false);
  const { isOnline } = useOnlineStatus();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-tulane-green mb-8">
        Error Handling & Loading States Demo
      </h1>
      
      <div className="space-y-12">
        {/* Online Status */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Online Status</h2>
          <div className={`p-4 rounded ${isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            Status: {isOnline ? 'Online' : 'Offline'}
          </div>
        </section>

        {/* Error Boundary Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Error Boundary</h2>
          <button
            onClick={() => setShowErrorComponent(!showErrorComponent)}
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {showErrorComponent ? 'Hide Error' : 'Trigger Error'}
          </button>
          
          <ErrorBoundary>
            <div className="p-4 border border-gray-200 rounded">
              {showErrorComponent ? (
                <ErrorComponent />
              ) : (
                <p>No error - component is working normally</p>
              )}
            </div>
          </ErrorBoundary>
        </section>

        {/* Loading States Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Loading Spinners</h3>
              <div className="flex items-center space-x-4">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
                <LoadingSpinner size="xl" />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Loading State Component</h3>
              <LoadingState message="Loading demo content..." size="sm" />
            </div>
          </div>
        </section>

        {/* Async Operations Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Async Operations with Progress</h2>
          <AsyncComponent />
        </section>

        {/* Retry Mechanism Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Retry Mechanism</h2>
          <RetryComponent />
        </section>

        {/* Form Error Handling Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Form Error Handling</h2>
          <FormComponent />
        </section>
      </div>
    </div>
  );
}