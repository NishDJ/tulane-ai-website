import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { EducationalResourceSchema, type EducationalResource } from '@/types';
import { z } from 'zod';

const QuerySchema = z.object({
  category: z.string().optional(),
  type: z.enum(['pdf', 'video', 'link', 'document']).optional(),
  downloadable: z.string().transform(val => val === 'true').optional(),
  tags: z.string().optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
  offset: z.string().transform(val => parseInt(val, 10)).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const filePath = join(process.cwd(), 'src/data/programs/resources.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const resources = JSON.parse(fileContent);
    
    // Validate data
    const validatedResources = resources.map((resource: unknown) => EducationalResourceSchema.parse(resource));
    
    // Apply filters
    let filteredResources: EducationalResource[] = validatedResources;
    
    if (query.category) {
      filteredResources = filteredResources.filter((resource: EducationalResource) => 
        resource.category.toLowerCase().includes(query.category!.toLowerCase())
      );
    }
    
    if (query.type) {
      filteredResources = filteredResources.filter((resource: EducationalResource) => resource.type === query.type);
    }
    
    if (query.downloadable !== undefined) {
      filteredResources = filteredResources.filter((resource: EducationalResource) => resource.downloadable === query.downloadable);
    }
    
    if (query.tags) {
      const searchTags = query.tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredResources = filteredResources.filter((resource: EducationalResource) =>
        resource.tags.some((tag: string) => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }
    
    // Sort by last updated (newest first)
    filteredResources.sort((a: EducationalResource, b: EducationalResource) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    
    // Apply pagination
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    const total = filteredResources.length;
    const paginatedResources = filteredResources.slice(offset, offset + limit);
    
    return NextResponse.json({
      data: {
        items: paginatedResources,
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
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to fetch resources',
      },
      { status: 500 }
    );
  }
}