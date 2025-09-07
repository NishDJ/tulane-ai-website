'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  PlayCircle,
  Clock,
  Users,
  Tag
} from 'lucide-react';
import { type ResearchProject } from '@/types';

interface ResearchTimelineProps {
  projects: ResearchProject[];
  className?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  type: 'start' | 'end' | 'milestone';
  status: 'active' | 'completed' | 'planned';
  project: ResearchProject;
}

export function ResearchTimeline({ projects, className = '' }: ResearchTimelineProps) {
  // Create timeline events from projects
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    
    projects.forEach(project => {
      // Add start event
      events.push({
        id: `${project.id}-start`,
        title: `${project.title} - Started`,
        date: new Date(project.startDate),
        type: 'start',
        status: project.status,
        project
      });
      
      // Add end event if exists
      if (project.endDate) {
        events.push({
          id: `${project.id}-end`,
          title: `${project.title} - ${project.status === 'completed' ? 'Completed' : 'Expected End'}`,
          date: new Date(project.endDate),
          type: 'end',
          status: project.status,
          project
        });
      }
    });
    
    // Sort events by date
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [projects]);

  const getEventIcon = (event: TimelineEvent) => {
    if (event.type === 'start') {
      switch (event.status) {
        case 'active':
          return <PlayCircle className="h-5 w-5 text-green-600" />;
        case 'completed':
          return <CheckCircle className="h-5 w-5 text-blue-600" />;
        case 'planned':
          return <Clock className="h-5 w-5 text-orange-600" />;
        default:
          return <Circle className="h-5 w-5 text-gray-600" />;
      }
    } else {
      return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.type === 'start') {
      switch (event.status) {
        case 'active':
          return 'border-green-200 bg-green-50';
        case 'completed':
          return 'border-blue-200 bg-blue-50';
        case 'planned':
          return 'border-orange-200 bg-orange-50';
        default:
          return 'border-gray-200 bg-gray-50';
      }
    }
    return 'border-gray-200 bg-gray-50';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatYear = (date: Date) => {
    return date.getFullYear().toString();
  };

  // Group events by year for better organization
  const eventsByYear = useMemo(() => {
    const grouped: { [year: string]: TimelineEvent[] } = {};
    
    timelineEvents.forEach(event => {
      const year = formatYear(event.date);
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(event);
    });
    
    return grouped;
  }, [timelineEvents]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  if (timelineEvents.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Timeline</h2>
        <p className="text-gray-600">Track the progression of our research projects over time</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-tulane-green via-tulane-blue to-gray-300"></div>

        {Object.entries(eventsByYear).map(([year, events]) => (
          <div key={year} className="relative mb-12">
            {/* Year Header */}
            <div className="relative flex items-center mb-6">
              <div className="absolute left-6 w-4 h-4 bg-tulane-green rounded-full border-4 border-white shadow-lg z-10"></div>
              <div className="ml-16">
                <h3 className="text-xl font-bold text-tulane-green">{year}</h3>
              </div>
            </div>

            {/* Events for this year */}
            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="relative flex items-start"
                >
                  {/* Event Icon */}
                  <div className="absolute left-6 w-4 h-4 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-300 shadow-sm"></div>
                  </div>

                  {/* Event Content */}
                  <div className="ml-16 w-full">
                    <div className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${getEventColor(event)}`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          {getEventIcon(event)}
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(event.date)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {event.project.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>PI: {event.project.principalInvestigator}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{event.project.collaborators.length + 1} members</span>
                          </div>
                        </div>

                        {/* Project Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-0.5 text-xs font-medium text-gray-600"
                            >
                              <Tag className="h-2 w-2" />
                              {tag}
                            </span>
                          ))}
                          {event.project.tags.length > 3 && (
                            <span className="inline-block rounded-full bg-white/50 px-2 py-0.5 text-xs font-medium text-gray-500">
                              +{event.project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Timeline End */}
        <div className="relative flex items-center">
          <div className="absolute left-6 w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow-lg"></div>
          <div className="ml-16">
            <p className="text-sm text-gray-500 italic">Timeline continues...</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}