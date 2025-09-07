'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, MapPin } from 'lucide-react';
import { EventsCalendar, NewsletterSignup } from '@/components/news';
import { useEvents } from '@/hooks';

export function EventsPageClient() {
  const { events, loading, error } = useEvents();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  // Get event statistics
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date());
  const eventTypes = {
    seminar: events.filter(e => e.eventType === 'seminar').length,
    conference: events.filter(e => e.eventType === 'conference').length,
    workshop: events.filter(e => e.eventType === 'workshop').length,
    social: events.filter(e => e.eventType === 'social').length,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Events & Calendar</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700">Error loading events: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Events & Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for seminars, conferences, workshops, and networking events that advance 
            the field of AI and data science in healthcare.
          </p>
        </motion.div>

        {/* Event Statistics */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Calendar className="w-8 h-8 text-tulane-green mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : upcomingEvents.length}
              </div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Users className="w-8 h-8 text-tulane-blue mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : eventTypes.seminar}
              </div>
              <div className="text-sm text-gray-600">Seminars</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <MapPin className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : eventTypes.workshop}
              </div>
              <div className="text-sm text-gray-600">Workshops</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : eventTypes.conference}
              </div>
              <div className="text-sm text-gray-600">Conferences</div>
            </div>
          </div>
        </motion.div>

        {/* Events Calendar */}
        <motion.div variants={itemVariants} className="mb-12">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-6 w-1/3" />
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-4">
                  {[...Array(35)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EventsCalendar events={events} />
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-tulane-blue to-tulane-green rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss an Event</h2>
            <p className="text-lg mb-6 opacity-90">
              Subscribe to our newsletter to get notified about upcoming events and registration deadlines.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterSignup compact className="bg-white/10 backdrop-blur-sm border-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Event Submission Info */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Want to Host an Event?
            </h3>
            <p className="text-gray-600 mb-6">
              We welcome proposals for seminars, workshops, and collaborative events. 
              Contact us to discuss your ideas and get support for organizing your event.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-tulane-green text-white px-6 py-3 rounded-lg font-medium hover:bg-tulane-green/90 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Contact Us</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}