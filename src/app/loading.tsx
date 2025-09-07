import { LoadingState } from '@/components/error';

export default function Loading() {
  return (
    <LoadingState 
      message="Loading page..." 
      size="lg"
      className="min-h-[60vh]"
    />
  );
}