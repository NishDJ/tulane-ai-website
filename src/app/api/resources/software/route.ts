import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { SoftwareToolSchema, type SoftwareTool } from '@/types';
import { z } from 'zod';

const QuerySchema = z.object({
  category: z.string().optional(),
  tags: z.string().optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  platform: z.string().optional(),
  license: z.string().optional(),
  query: z.string().optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
  offset: z.string().transform(val => parseInt(val, 10)).optional(),
  sortBy: z.enum(['title', 'lastUpdated', 'version']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const filePath = join(process.cwd(), 'src/data/resources/software.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const software = JSON.parse(fileContent);
    
    // Validate data
    const validatedSoftware = software.map((tool: unknown) => 
      SoftwareToolSchema.parse(tool)
    );
    
    // Apply filters
    let filteredSoftware: SoftwareTool[] = validatedSoftware;
    
    if (query.category) {
      filteredSoftware = filteredSoftware.filter((tool: SoftwareTool) => 
        tool.category.toLowerCase().includes(query.category!.toLowerCase())
      );
    }
    
    if (query.featured !== undefined) {
      filteredSoftware = filteredSoftware.filter((tool: SoftwareTool) => 
        tool.featured === query.featured
      );
    }
    
    if (query.platform) {
      filteredSoftware = filteredSoftware.filter((tool: SoftwareTool) =>
        tool.platform.some((platform: string) => 
          platform.toLowerCase().includes(query.platform!.toLowerCase())
        )
      );
    }
    
    if (query.license) {
      filteredSoftware = filteredSoftware.filter((tool: SoftwareTool) => 
        tool.license.toLowerCase().includes(query.license!.toLowerCase())
      );
    }
    
    if (query.tags) {
      const searchTags = query.tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredSoftware = filteredSoftware.filter((tool: SoftwareTool) =>
        tool.tags.some((tag: string) => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }
    
    if (query.query) {
      const searchQuery = query.query.toLowerCase();
      filteredSoftware = filteredSoftware.filter((tool: SoftwareTool) => {
        const searchableText = [
          tool.title,
          tool.description,
          ...tool.tags,
          tool.category,
          tool.license,
          ...tool.platform,
          ...tool.features,
          ...tool.maintainers
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchQuery);
      });
    }
    
    // Apply sorting
    const sortBy = query.sortBy || 'lastUpdated';
    const sortOrder = query.sortOrder || 'desc';
    
    filteredSoftware.sort((a: SoftwareTool, b: SoftwareTool) => {
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
        case 'version':
          // Simple version comparison (assumes semantic versioning)
          const parseVersion = (version: string) => {
            const parts = version.split('.').map(part => parseInt(part.replace(/\D/g, ''), 10) || 0);
            return parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
          };
          aValue = parseVersion(a.version);
          bValue = parseVersion(b.version);
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
    const total = filteredSoftware.length;
    const paginatedSoftware = filteredSoftware.slice(offset, offset + limit);
    
    return NextResponse.json({
      data: {
        items: paginatedSoftware,
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
    console.error('Error fetching software tools:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to fetch software tools',
      },
      { status: 500 }
    );
  }
}