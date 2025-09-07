import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';

export default function FacultyNotFound() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-gray-100 p-6">
          <Users className="h-16 w-16 text-gray-400" />
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Faculty Member Not Found
        </h1>
        
        <p className="mb-8 max-w-md text-gray-600">
          The faculty member you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        
        <Link
          href="/faculty"
          className="inline-flex items-center gap-2 rounded-lg bg-tulane-green px-6 py-3 text-white transition-colors duration-200 hover:bg-tulane-green/90 focus:outline-none focus:ring-2 focus:ring-tulane-green focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Faculty
        </Link>
      </div>
    </div>
  );
}