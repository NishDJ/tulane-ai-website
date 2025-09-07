import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { DatasetResourceSchema, type DatasetResource } from '@/types';
import { z } from 'zod';

const QuerySchema = z.object({
  category: z.string().optional(),
  tags: z.string().optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  accessLevel: z.enum(['public', 'restricted', 'private']).optional(),
  format: z.string().optional(),
  query: z.string().optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
  offset: z.string().transform(val => parseInt(val, 10)).optional(),
  sortBy: z.enum(['title', 'lastUpdated', 'citations', 'size']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const filePath = join(process.cwd(), 'src/data/resources/datasets.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const datasets = JSON.parse(fileContent);
    
    // Validate data
    const validatedDatasets = datasets.map((dataset: unknown) => 
      DatasetResourceSchema.parse(dataset)
    );
    
    // Apply filters
    let filteredDatasets: DatasetResource[] = validatedDatasets;
    
    if (query.category) {
      filteredDatasets = filteredDatasets.filter((dataset: DatasetResource) => 
        dataset.category.toLowerCase().includes(query.category!.toLowerCase())
      );
    }
    
    if (query.featured !== undefined) {
      filteredDatasets = filteredDatasets.filter((dataset: DatasetResource) => 
        dataset.featured === query.featured
      );
    }
    
    if (query.accessLevel) {
      filteredDatasets = filteredDatasets.filter((dataset: DatasetResource) => 
        dataset.accessLevel === query.accessLevel
      );
    }
    
    if (query.format) {
      filteredDatasets = filteredDatasets.filter((dataset: DatasetResource) =>
        dataset.format.some((format: string) => 
          format.toLowerCase().includes(query.format!.toLowerCase())
        )
      );
    }
    
    if (query.tags) {
      const searchTags = query.tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredDatasets = filteredDatasets.filter((dataset: DatasetResource) =>
        dataset.tags.some((tag: string) => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }
    
    if (query.query) {
      const searchQuery = query.query.toLowerCase();
      filteredDatasets = filteredDatasets.filter((dataset: DatasetResource) => {
        const searchableText = [
          dataset.title,
          dataset.description,
          ...dataset.tags,
          dataset.category,
          ...dataset.format,
          dataset.license || ''
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchQuery);
      });
    }
    
    // Apply sorting
    const sortBy = query.sortBy || 'lastUpdated';
    const sortOrder = query.sortOrder || 'desc';
    
    filteredDatasets.sort((a: DatasetResource, b: DatasetResource) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'citations':
          aValue = a.citations || 0;
          bValue = b.citations || 0;
          break;
        case 'size':
          // Simple size comparison (assumes format like "2.5 TB", "850 GB", etc.)
          const getSizeInBytes = (sizeStr: string) => {
            const match = sizeStr.match(/^([\d.]+)\s*(TB|GB|MB|KB)$/i);
            if (!match) return 0;
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            const multipliers = { KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4 };
            return value * (multipliers[unit as keyof typeof multipliers] || 1);
          };
          aValue = getSizeInBytes(a.size);
          bValue = getSizeInBytes(b.size);
          break;
        default:
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    // Apply pagination
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    const total = filteredDatasets.length;
    const paginatedDatasets = filteredDatasets.slice(offset, offset + limit);
    
    return NextResponse.json({
      data: {
        items: paginatedDatasets,
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
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to fetch datasets',
      },
      { status: 500 }
    );
  }
}