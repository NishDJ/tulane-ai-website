'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { EventCard } from './event-card';
import { Event } from '@/types';

interface EventsCalendarProps {
  events: Event[];
}

export function EventsCalendar({ events }: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<'all' | Event['eventType']>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  // Filter events based on selected filter
  const filteredEvents = useMemo(() => {
    return events.filter(event => 
      selectedFilter === 'all' || event.eventType === selectedFilter
    );
  }, [events, selectedFilter]);

  // Group events by month for calendar view
  const eventsByMonth = useMemo(() => {
    const grouped: { [key: string]: Event[] } = {};
    filteredEvents.forEach(event => {
      const monthKey = new Date(event.startDate).toISOString().slice(0, 7);
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const currentMonthKey = currentDate.toISOString().slice(0, 7);
  const currentMonthEvents = eventsByMonth[currentMonthKey] || [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const eventTypes: Array<{ value: 'all' | Event['eventType']; label: string; count: number }> = [
    { value: 'all', label: 'All Events', count: events.length },
    { value: 'seminar', label: 'Seminars', count: events.filter(e => e.eventType === 'seminar').length },
    { value: 'conference', label: 'Conferences', count: events.filter(e => e.eventType === 'conference').length },
    { value: 'workshop', label: 'Workshops', count: events.filter(e => e.eventType === 'workshop').length },
    { value: 'social', label: 'Social Events', count: events.filter(e => e.eventType === 'social').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Navigation and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <h2 className="text-2xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-tulane-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar' 
                ? 'bg-tulane-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Event Type Filters */}
      <div className="flex flex-wrap gap-2">
        {eventTypes.map(({ value, label, count }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedFilter(value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
              selectedFilter === value
                ? 'bg-tulane-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>{label}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {count}
            </span>
          </motion.button>
        ))}
      </div>  
    {/* Events Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentMonthKey}-${selectedFilter}-${viewMode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMonthEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <CalendarView 
              events={currentMonthEvents} 
              currentDate={currentDate}
            />
          )}

          {/* Empty State */}
          {currentMonthEvents.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events this month
              </h3>
              <p className="text-gray-500">
                {selectedFilter === 'all' 
                  ? 'There are no events scheduled for this month.' 
                  : `No ${selectedFilter} events scheduled for this month.`
                }
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Calendar Grid View Component
function CalendarView({ events, currentDate }: { events: Event[]; currentDate: Date }) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days = [];
  const currentDateObj = new Date(startDate);

  // Generate calendar days
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDateObj));
    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }

  // Group events by date
  const eventsByDate: { [key: string]: Event[] } = {};
  events.forEach(event => {
    const dateKey = new Date(event.startDate).toDateString();
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(event);
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const dayEvents = eventsByDate[day.toDateString()] || [];

          return (
            <motion.div
              key={index}
              className={`min-h-[100px] p-2 border-b border-r border-gray-100 ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
              }`}
              whileHover={{ backgroundColor: isCurrentMonth ? '#f9fafb' : undefined }}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-tulane-green' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: eventIndex * 0.1 }}
                    className="text-xs p-1 rounded bg-tulane-green/10 text-tulane-green truncate cursor-pointer hover:bg-tulane-green/20 transition-colors"
                    title={event.title}
                  >
                    {event.title}
                  </motion.div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}