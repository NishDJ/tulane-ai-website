'use client';

import { motion } from 'framer-motion';
import { FacultySearch, FacultyGrid } from '@/components/faculty';
import { useFaculty } from '@/hooks/useFaculty';

export default function FacultyPageClient() {
  const { faculty, filteredFaculty, loading, error, setFilters } = useFaculty();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-tulane-green lg:text-5xl">
          Faculty
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
          Meet our world-class faculty members and their research specializations. 
          Our diverse team of experts is advancing the frontiers of AI and data science in medicine.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <FacultySearch
          allFaculty={faculty}
          onFilterChange={setFilters}
        />
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Faculty Data
          </h3>
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Faculty Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FacultyGrid
          faculty={filteredFaculty}
          loading={loading === 'loading'}
        />
      </motion.div>

      {/* Results Count */}
      {loading === 'success' && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          Showing {filteredFaculty.length} faculty member{filteredFaculty.length !== 1 ? 's' : ''}
        </motion.div>
      )}
    </div>
  );
}