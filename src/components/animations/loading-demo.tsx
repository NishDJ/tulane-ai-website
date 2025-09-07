'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FacultySkeleton, 
  ResearchSkeleton, 
  NewsSkeleton,
  PageLoader
} from '@/components/animations';

interface LoadingDemoProps {
  type: 'faculty' | 'research' | 'news' | 'page';
  count?: number;
  duration?: number;
}

export const LoadingDemo = ({ 
  type, 
  count = 3, 
  duration = 2000 
}: LoadingDemoProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const renderSkeletons = () => {
    const skeletons = Array.from({ length: count }, (_, index) => {
      switch (type) {
        case 'faculty':
          return <FacultySkeleton key={index} />;
        case 'research':
          return <ResearchSkeleton key={index} />;
        case 'news':
          return <NewsSkeleton key={index} />;
        default:
          return <FacultySkeleton key={index} />;
      }
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons}
      </div>
    );
  };

  const renderContent = () => {
    const content = Array.from({ length: count }, (_, index) => (
      <motion.div
        key={index}
        className="p-6 border rounded-lg bg-white shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {type === 'faculty' && `Dr. Faculty Member ${index + 1}`}
          {type === 'research' && `Research Project ${index + 1}`}
          {type === 'news' && `News Article ${index + 1}`}
        </h3>
        <p className="text-gray-600">
          Content has loaded successfully with smooth animations.
        </p>
      </motion.div>
    ));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content}
      </div>
    );
  };

  if (type === 'page') {
    return isLoading ? (
      <PageLoader message="Loading content..." />
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Content Loaded!
        </h2>
        <p className="text-gray-600">
          This demonstrates the page loading animation.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {type.charAt(0).toUpperCase() + type.slice(1)} Loading Demo
        </h2>
        <button
          onClick={() => setIsLoading(true)}
          className="px-4 py-2 bg-tulane-green text-white rounded-lg hover:bg-tulane-green/90 transition-colors"
        >
          Reload Demo
        </button>
      </div>
      
      {isLoading ? renderSkeletons() : renderContent()}
    </div>
  );
};