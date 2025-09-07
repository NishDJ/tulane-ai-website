'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Award, Users } from 'lucide-react';
import { usePrograms } from '@/hooks';
import { ProgramGrid, ProgramFilters, ProgramFiltersType } from '@/components/programs';
import { Program } from '@/types';

export function ProgramsPageClient() {
  const [filters, setFilters] = useState<ProgramFiltersType>({
    search: '',
    type: 'all',
    level: 'all',
    format: 'all',
    featured: null,
  });

  const { programs, loading, error } = usePrograms({
    featured: filters.featured || undefined,
  });

  // Remove the onClick handler since we'll use Link navigation in the card

  // Filter programs based on client-side filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = filters.search === '' || 
      program.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      program.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type === 'all' || program.type === filters.type;
    const matchesLevel = filters.level === 'all' || program.level === filters.level;
    const matchesFormat = filters.format === 'all' || program.format === filters.format;
    
    return matchesSearch && matchesType && matchesLevel && matchesFormat;
  });

  // Get statistics
  const stats = {
    total: programs.length,
    degrees: programs.filter(p => p.type === 'degree').length,
    certificates: programs.filter(p => p.type === 'certificate').length,
    continuingEd: programs.filter(p => p.type === 'continuing-education').length,
  };

  if (loading === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Programs</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Programs & Education
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Advance your career with our comprehensive AI and data science programs, 
              designed for healthcare professionals and researchers.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <GraduationCap className="h-8 w-8 mx-auto text-blue-200" />
                </div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-blue-200 text-sm">Total Programs</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <BookOpen className="h-8 w-8 mx-auto text-blue-200" />
                </div>
                <div className="text-2xl font-bold">{stats.degrees}</div>
                <div className="text-blue-200 text-sm">Degree Programs</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <Award className="h-8 w-8 mx-auto text-blue-200" />
                </div>
                <div className="text-2xl font-bold">{stats.certificates}</div>
                <div className="text-blue-200 text-sm">Certificates</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <Users className="h-8 w-8 mx-auto text-blue-200" />
                </div>
                <div className="text-2xl font-bold">{stats.continuingEd}</div>
                <div className="text-blue-200 text-sm">Continuing Ed</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ProgramFilters
                  onFiltersChange={setFilters}
                  className="mb-8"
                />
              </div>
            </div>

            {/* Programs Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Programs
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredPrograms.length} of {programs.length} programs
                  </p>
                </div>
              </div>

              <ProgramGrid
                programs={filteredPrograms}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community of healthcare professionals and researchers advancing 
              the field of AI and data science in medicine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Admissions
              </a>
              <Link
                href="/programs/resources"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}