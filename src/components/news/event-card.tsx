'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ExternalLink, Tag } from 'lucide-react';
import Link from 'next/link';
import { Event } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5 }
  };

  const getEventTypeColor = (type: Event['eventType']) => {
    const colors = {
      seminar: 'bg-blue-100 text-blue-800 border-blue-200',
      conference: 'bg-purple-100 text-purple-800 border-purple-200',
      workshop: 'bg-green-100 text-green-800 border-green-200',
      social: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || colors.seminar;
  };

  const getEventTypeIcon = (type: Event['eventType']) => {
    const icons = {
      seminar: '🎓',
      conference: '🏛️',
      workshop: '🔧',
      social: '🎉'
    };
    return icons[type] || icons.seminar;
  };

  const isUpcoming = new Date(event.startDate) > new Date();
  const isPast = new Date(event.endDate || event.startDate) < new Date();

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-gray-100 ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      {/* Event Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getEventTypeColor(event.eventType)}`}>
          <span>{getEventTypeIcon(event.eventType)}</span>
          <span className="capitalize">{event.eventType}</span>
        </div>
        
        {/* Status Indicator */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isUpcoming ? 'bg-green-100 text-green-800' : 
          isPast ? 'bg-gray-100 text-gray-600' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {isUpcoming ? 'Upcoming' : isPast ? 'Past' : 'Ongoing'}
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-tulane-green transition-colors duration-200 ${
        compact ? 'text-lg' : 'text-xl'
      }`}>
        {event.title}
      </h3>

      {/* Description */}
      <p className={`text-gray-600 mb-4 ${
        compact ? 'line-clamp-2 text-sm' : 'line-clamp-3'
      }`}>
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <motion.div variants={iconVariants}>
            <Calendar className="w-4 h-4 text-tulane-blue" />
          </motion.div>
          <div>
            <span className="font-medium">{formatDate(event.startDate)}</span>
            {event.endDate && event.endDate !== event.startDate && (
              <span> - {formatDate(event.endDate)}</span>
            )}
            <div className="text-xs text-gray-500">
              {formatTime(event.startDate)}
              {event.endDate && (
                <span> - {formatTime(event.endDate)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <motion.div variants={iconVariants}>
            <MapPin className="w-4 h-4 text-tulane-blue" />
          </motion.div>
          <span>{event.location}</span>
        </div>

        {/* Capacity */}
        {event.capacity && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <motion.div variants={iconVariants}>
              <Users className="w-4 h-4 text-tulane-blue" />
            </motion.div>
            <span>Capacity: {event.capacity} attendees</span>
          </div>
        )}

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <motion.div variants={iconVariants} className="mt-0.5">
              <Users className="w-4 h-4 text-tulane-blue" />
            </motion.div>
            <div>
              <span className="font-medium">Speakers: </span>
              <span>{event.speakers.slice(0, 2).join(', ')}</span>
              {event.speakers.length > 2 && (
                <span className="text-gray-500"> +{event.speakers.length - 2} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs text-tulane-green bg-tulane-green/10 px-2 py-1 rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Registration Link */}
      {event.registrationUrl && isUpcoming && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 w-full justify-center bg-tulane-green text-white px-4 py-2 rounded-lg font-medium hover:bg-tulane-green/90 transition-colors duration-200"
          >
            <span>Register Now</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Past Event - View Details */}
      {isPast && (
        <div className="text-center">
          <span className="text-sm text-gray-500 font-medium">Event Completed</span>
        </div>
      )}
    </motion.article>
  );
}