'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'spinner',
  className = '',
  color = 'primary'
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-tulane-green',
    secondary: 'text-tulane-blue',
    white: 'text-white'
  };

  if (variant === 'spinner') {
    return (
      <motion.div
        className={cn(
          'border-2 border-current border-t-transparent rounded-full',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              'rounded-full',
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
              colorClasses[color] === 'text-white' ? 'bg-white' : 
              colorClasses[color] === 'text-tulane-blue' ? 'bg-tulane-blue' : 'bg-tulane-green'
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(
          'rounded-full',
          sizeClasses[size],
          colorClasses[color] === 'text-white' ? 'bg-white' : 
          colorClasses[color] === 'text-tulane-blue' ? 'bg-tulane-blue' : 'bg-tulane-green',
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex space-x-1 items-end', className)}>
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className={cn(
              'w-1 rounded-sm',
              colorClasses[color] === 'text-white' ? 'bg-white' : 
              colorClasses[color] === 'text-tulane-blue' ? 'bg-tulane-blue' : 'bg-tulane-green'
            )}
            style={{
              height: size === 'sm' ? '8px' : size === 'md' ? '16px' : size === 'lg' ? '24px' : '32px'
            }}
            animate={{
              scaleY: [1, 2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export const PageLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <LoadingSpinner size="lg" variant="spinner" />
    <motion.p
      className="text-gray-600 dark:text-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {message}
    </motion.p>
  </div>
);

export const InlineLoader = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
  <LoadingSpinner size={size} variant="spinner" className="inline-block" />
);