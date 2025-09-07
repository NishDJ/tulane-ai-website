'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { type FacultyMember } from '@/types';
import { FacultyCard } from './faculty-card';

interface FacultyGridProps {
  faculty: FacultyMember[];
  loading?: boolean;
  className?: string;
}

export function FacultyGrid({ faculty, loading = false, className = '' }: FacultyGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading) {
    return (
      <div className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-xl bg-white shadow-md"
          >
            <div className="aspect-[4/3] bg-gray-200"></div>
            <div className="p-4 sm:p-6">
              <div className="mb-3 space-y-2">
                <div className="h-5 sm:h-6 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="h-4 w-2/3 rounded bg-gray-200"></div>
              </div>
              <div className="mb-4 flex gap-1">
                <div className="h-6 w-16 rounded-full bg-gray-200"></div>
                <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                <div className="h-6 w-14 rounded-full bg-gray-200"></div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                <div className="h-4 w-4/5 rounded bg-gray-200"></div>
              </div>
              <div className="h-11 sm:h-10 w-full rounded-lg bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (faculty.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">No faculty found</h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or clearing the filters.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {faculty.map((member, index) => (
          <motion.div
            key={member.id}
            variants={itemVariants}
            layout
            className="h-fit"
          >
            <FacultyCard faculty={member} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}