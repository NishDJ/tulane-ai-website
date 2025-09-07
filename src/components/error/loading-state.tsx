import { cn } from '@/lib/utils';
import LoadingSpinner from './loading-spinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSpinner?: boolean;
}

const sizeClasses = {
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
};

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  className,
  showSpinner = true
}: LoadingStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizeClasses[size],
      className
    )}>
      {showSpinner && (
        <LoadingSpinner size="lg" className="mb-4" />
      )}
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}