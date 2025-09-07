'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  ExternalLink,
  Download,
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle
} from 'lucide-react';
import { Program } from '@/types';
import { useApplicationInfo } from '@/hooks';
import { CourseList, ApplicationInfo } from '@/components/programs';
import { cn } from '@/lib/utils';

interface ProgramDetailClientProps {
  program: Program;
}

export function ProgramDetailClient({ program }: ProgramDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'application'>('overview');
  const { applicationInfo, loading: appInfoLoading } = useApplicationInfo(program.id);

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

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BookOpen },
    { id: 'courses' as const, label: 'Courses', icon: GraduationCap, count: program.courses.length },
    { id: 'application' as const, label: 'Application', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Programs</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className={cn(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border',
                  getTypeColor(program.type)
                )}>
                  <GraduationCap className="h-4 w-4" />
                  {program.type.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {program.level}
                </span>
                {program.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded-full border border-yellow-200">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {program.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {program.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Clock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{program.duration}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {program.format.replace('-', ' ')}
                  </div>
                  <div className="text-xs text-gray-500">Format</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <BookOpen className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{program.courses.length}</div>
                  <div className="text-xs text-gray-500">Courses</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <DollarSign className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    {formatTuition(program.tuition)}
                  </div>
                  <div className="text-xs text-gray-500">Tuition</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                {program.image && (
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                )}

                {program.applicationDeadline && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Application Deadline</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {program.applicationDeadline.toLocaleDateString()}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {program.applicationUrl && (
                    <a
                      href={program.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Apply Now
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  {program.brochureUrl && (
                    <a
                      href={program.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Download Brochure
                      <Download className="h-4 w-4" />
                    </a>
                  )}

                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Contact Admissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Requirements</h2>
              <div className="space-y-3">
                {program.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>

              {program.prerequisites.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h3>
                  <div className="space-y-2">
                    {program.prerequisites.map((prerequisite, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{prerequisite}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Details</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Program Type</dt>
                  <dd className="text-lg text-gray-900 capitalize">{program.type.replace('-', ' ')}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Level</dt>
                  <dd className="text-lg text-gray-900 capitalize">{program.level}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="text-lg text-gray-900">{program.duration}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Format</dt>
                  <dd className="text-lg text-gray-900 capitalize">{program.format.replace('-', ' ')}</dd>
                </div>
                
                {program.tuition && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tuition</dt>
                    <dd className="text-lg text-gray-900">{formatTuition(program.tuition)}</dd>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CourseList courses={program.courses} />
          </motion.div>
        )}

        {activeTab === 'application' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {appInfoLoading === 'loading' ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : applicationInfo ? (
              <ApplicationInfo applicationInfo={applicationInfo} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Application Information Coming Soon
                </h3>
                <p className="text-gray-500 mb-6">
                  Detailed application information for this program will be available soon.
                </p>
                <a
                  href="/contact"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Admissions
                </a>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}