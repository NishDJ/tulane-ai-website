'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';

interface UseEventsOptions {
  type?: Event['eventType'];
  upcoming?: boolean;
  month?: string; // Format: YYYY-MM
  limit?: number;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.type) {
        params.append('type', options.type);
      }
      if (options.upcoming !== undefined) {
        params.append('upcoming', options.upcoming.toString());
      }
      if (options.month) {
        params.append('month', options.month);
      }
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      // Transform date strings back to Date objects
      const transformedEvents = data.data.map((event: Event & { startDate: string; endDate?: string }) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined
      }));

      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [options.type, options.upcoming, options.month, options.limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
}

// Hook for getting events by month for calendar view
export function useEventsByMonth(currentDate: Date) {
  const month = currentDate.toISOString().slice(0, 7);
  return useEvents({ month });
}

// Hook for getting upcoming events
export function useUpcomingEvents(limit?: number) {
  return useEvents({ upcoming: true, limit });
}

// Hook for getting events by type
export function useEventsByType(type: Event['eventType'], limit?: number) {
  return useEvents({ type, limit });
}