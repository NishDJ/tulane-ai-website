'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, GraduationCap, DollarSign, ExternalLink } from 'lucide-react';
import { Program } from '@/types';
import { cn } from '@/lib/utils';

interface ProgramCardProps {
  program: Program;
  className?: string;
}

export function ProgramCard({ program, className }: ProgramCardProps) {
  const formatTuition = (tuition: Program['tuition']) => {
    if (!tuition) return 'Contact for pricing';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: tuition.currency,
      minimumFractionDigits: 0,
    });
    
    return `${formatter.format(tuition.amount)}/${tuition.period}`;
  };

  const getTypeColor = (type: Program['type']) => {
    switch (type) {
      case 'degree':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'certificate':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'continuing-education':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = () => {
    return <GraduationCap className="h-4 w-4" />;
  };

  return (
    <Link href={`/programs/${program.id}`}>
      <motion.div
        className={cn(
          'group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
          'hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer',
          className
        )}
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      {/* Featured Badge */}
      {program.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full border border-yellow-200">
            Featured
          </span>
        </div>
      )}

      {/* Image */}
      {program.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-6">
        {/* Type and Level */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
            getTypeColor(program.type)
          )}>
            {getLevelIcon()}
            {program.type.replace('-', ' ')}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {program.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {program.description}
        </p>

        {/* Program Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{program.duration}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="capitalize">{program.format.replace('-', ' ')}</span>
          </div>

          {program.tuition && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DollarSign className="h-4 w-4" />
              <span>{formatTuition(program.tuition)}</span>
            </div>
          )}

          {program.applicationDeadline && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>
                Apply by {program.applicationDeadline.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
            Learn More
          </button>
          
          {program.applicationUrl && (
            <a
              href={program.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Apply Now
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
    </Link>
  );
}