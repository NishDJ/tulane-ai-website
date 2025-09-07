import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function ProgramNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
          <p className="text-gray-600">
            The program you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Programs
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try searching for a specific program:</p>
            <Link
              href="/programs"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse all programs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}