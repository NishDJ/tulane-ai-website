import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function ResearchNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Research Project Not Found</h1>
          <p className="text-gray-600">
            The research project you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 bg-tulane-green text-white px-6 py-3 rounded-lg font-medium hover:bg-tulane-green/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Research
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try searching for a specific research area or project.</p>
          </div>
        </div>
      </div>
    </div>
  );
}