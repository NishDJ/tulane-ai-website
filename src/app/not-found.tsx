'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

// Metadata moved to layout since this is now a client component

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-tulane-green/20 mb-4">404</h1>
          <div className="w-24 h-1 bg-tulane-green mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's help you find what you need.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-tulane-green text-white rounded-lg hover:bg-tulane-green/90 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Site
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 text-tulane-green hover:text-tulane-green/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Link
              href="/faculty"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              Faculty
            </Link>
            <Link
              href="/research"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              Research
            </Link>
            <Link
              href="/programs"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              Programs
            </Link>
            <Link
              href="/news"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              News
            </Link>
            <Link
              href="/events"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/resources"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/contact"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="text-tulane-green hover:text-tulane-green/80 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}