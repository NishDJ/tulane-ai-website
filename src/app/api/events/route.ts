import { NextRequest, NextResponse } from 'next/server';
import { loadEventsData } from '@/lib/data-loader';
import { Event } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('type') as Event['eventType'] | null;
    const upcoming = searchParams.get('upcoming');
    const month = searchParams.get('month'); // Format: YYYY-MM
    const limit = searchParams.get('limit');

    let events = await loadEventsData();

    // Filter by event type
    if (eventType && ['seminar', 'conference', 'workshop', 'social'].includes(eventType)) {
      events = events.filter(event => event.eventType === eventType);
    }

    // Filter by upcoming/past
    const now = new Date();
    if (upcoming === 'true') {
      events = events.filter(event => new Date(event.startDate) > now);
    } else if (upcoming === 'false') {
      events = events.filter(event => new Date(event.endDate || event.startDate) < now);
    }

    // Filter by month
    if (month) {
      events = events.filter(event => {
        const eventMonth = new Date(event.startDate).toISOString().slice(0, 7);
        return eventMonth === month;
      });
    }

    // Sort by start date
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        events = events.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events',
        data: []
      },
      { status: 500 }
    );
  }
}