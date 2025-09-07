'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Calendar, MapPin, User, BookOpen } from 'lucide-react';
import { Course } from '@/types';
import { cn } from '@/lib/utils';

interface CourseListProps {
  courses: Course[];
  showPrerequisites?: boolean;
  className?: string;
}

interface CourseItemProps {
  course: Course;
  showPrerequisites?: boolean;
}

function CourseItem({ course, showPrerequisites = true }: CourseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSemesterColor = (semester: Course['semester']) => {
    switch (semester) {
      case 'fall':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'spring':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'summer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'year-round':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      className="border border-gray-200 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {course.code}
              </span>
              <span className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border capitalize',
                getSemesterColor(course.semester)
              )}>
                {course.semester}
              </span>
              {course.isRequired && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full border border-red-200">
                  Required
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {course.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {course.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.credits} credit{course.credits !== 1 ? 's' : ''}</span>
              </div>
              
              {course.instructor && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{course.instructor}</span>
                </div>
              )}
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-4 space-y-4">
              {/* Schedule Information */}
              {course.schedule && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{course.schedule.days.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{course.schedule.time}</span>
                    </div>
                    {course.schedule.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{course.schedule.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {showPrerequisites && course.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Prerequisites</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded border border-blue-200"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus Link */}
              {course.syllabus && (
                <div>
                  <a
                    href={course.syllabus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Syllabus
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CourseList({ courses, showPrerequisites = true, className }: CourseListProps) {
  const [filter, setFilter] = useState<'all' | 'required' | 'elective'>('all');
  const [semesterFilter, setSemesterFilter] = useState<Course['semester'] | 'all'>('all');

  const filteredCourses = courses.filter(course => {
    if (filter === 'required' && !course.isRequired) return false;
    if (filter === 'elective' && course.isRequired) return false;
    if (semesterFilter !== 'all' && course.semester !== semesterFilter) return false;
    return true;
  });

  const requiredCourses = courses.filter(course => course.isRequired);
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
        <p className="text-gray-500">Course information will be available soon.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Course Summary */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-blue-800">Total Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalCredits}</div>
            <div className="text-sm text-blue-800">Total Credits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{requiredCourses.length}</div>
            <div className="text-sm text-blue-800">Required Courses</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Type
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Courses</option>
            <option value="required">Required Only</option>
            <option value="elective">Electives Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value as typeof semesterFilter)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Semesters</option>
            <option value="fall">Fall</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="year-round">Year Round</option>
          </select>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            showPrerequisites={showPrerequisites}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses match the selected filters.</p>
        </div>
      )}
    </div>
  );
}