import { NextRequest, NextResponse } from 'next/server';
import { loadPrograms } from '@/lib/data-loader';
import { ProgramSchema } from '@/types';
import { z } from 'zod';

const QuerySchema = z.object({
  type: z.enum(['degree', 'certificate', 'continuing-education']).optional(),
  level: z.enum(['undergraduate', 'graduate', 'doctoral', 'professional']).optional(),
  format: z.enum(['on-campus', 'online', 'hybrid']).optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  active: z.string().transform(val => val === 'true').optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
  offset: z.string().transform(val => parseInt(val, 10)).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const programs = await loadPrograms();
    
    // Validate data
    const validatedPrograms = programs.map(program => ProgramSchema.parse(program));
    
    // Apply filters
    let filteredPrograms = validatedPrograms;
    
    if (query.type) {
      filteredPrograms = filteredPrograms.filter(program => program.type === query.type);
    }
    
    if (query.level) {
      filteredPrograms = filteredPrograms.filter(program => program.level === query.level);
    }
    
    if (query.format) {
      filteredPrograms = filteredPrograms.filter(program => program.format === query.format);
    }
    
    if (query.featured !== undefined) {
      filteredPrograms = filteredPrograms.filter(program => program.featured === query.featured);
    }
    
    if (query.active !== undefined) {
      filteredPrograms = filteredPrograms.filter(program => program.isActive === query.active);
    }
    
    // Apply pagination
    const limit = query.limit || 10;
    const offset = query.offset || 0;
    const total = filteredPrograms.length;
    const paginatedPrograms = filteredPrograms.slice(offset, offset + limit);
    
    return NextResponse.json({
      data: {
        items: paginatedPrograms,
        pagination: {
          page: Math.floor(offset / limit) + 1,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to fetch programs',
      },
      { status: 500 }
    );
  }
}