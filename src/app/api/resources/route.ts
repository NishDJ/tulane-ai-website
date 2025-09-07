import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { 
  PublicationResourceSchema, 
  DatasetResourceSchema, 
  SoftwareToolSchema,
  EducationalResourceSchema,
  type PublicationResource,
  type DatasetResource,
  type SoftwareTool,
  type EducationalResource
} from '@/types';
import { z } from 'zod';

const QuerySchema = z.object({
  type: z.enum(['publications', 'datasets', 'software', 'educational']).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  openAccess: z.string().transform(val => val === 'true').optional(),
  accessLevel: z.enum(['public', 'restricted', 'private']).optional(),
  query: z.string().optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
  offset: z.string().transform(val => parseInt(val, 10)).optional(),
  sortBy: z.enum(['title', 'year', 'lastUpdated', 'citations']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

type ResourceItem = PublicationResource | DatasetResource | SoftwareTool | EducationalResource;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const allResources: (ResourceItem & { resourceType: string })[] = [];

    // Load different resource types based on query
    const typesToLoad = query.type ? [query.type] : ['publications', 'datasets', 'software', 'educational'];

    for (const type of typesToLoad) {
      let filePath: string;
      let schema: z.ZodSchema;

      switch (type) {
        case 'publications':
          filePath = join(process.cwd(), 'src/data/resources/publications.json');
          schema = PublicationResourceSchema;
          break;
        case 'datasets':
          filePath = join(process.cwd(), 'src/data/resources/datasets.json');
          schema = DatasetResourceSchema;
          break;
        case 'software':
          filePath = join(process.cwd(), 'src/data/resources/software.json');
          schema = SoftwareToolSchema;
          break;
        case 'educational':
          filePath = join(process.cwd(), 'src/data/programs/resources.json');
          schema = EducationalResourceSchema;
          break;
        default:
          continue;
      }

      try {
        const fileContent = await readFile(filePath, 'utf-8');
        const resources = JSON.parse(fileContent);
        const validatedResources = resources.map((resource: unknown) => {
          const validated = schema.parse(resource) as ResourceItem;
          return { ...validated, resourceType: type } as ResourceItem & { resourceType: string };
        });
        allResources.push(...validatedResources);
      } catch (error) {
        console.warn(`Failed to load ${type} resources:`, error);
      }
    }

    // Apply filters
    let filteredResources: (ResourceItem & { resourceType: string })[] = allResources;

    if (query.category) {
      filteredResources = filteredResources.filter((resource) => 
        resource.category.toLowerCase().includes(query.category!.toLowerCase())
      );
    }

    if (query.featured !== undefined) {
      filteredResources = filteredResources.filter((resource) => 
        'featured' in resource && resource.featured === query.featured
      );
    }

    if (query.openAccess !== undefined) {
      filteredResources = filteredResources.filter((resource) => 
        'openAccess' in resource && resource.openAccess === query.openAccess
      );
    }

    if (query.accessLevel) {
      filteredResources = filteredResources.filter((resource) => 
        'accessLevel' in resource && resource.accessLevel === query.accessLevel
      );
    }

    if (query.tags) {
      const searchTags = query.tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredResources = filteredResources.filter((resource) =>
        resource.tags.some((tag: string) => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }

    if (query.query) {
      const searchQuery = query.query.toLowerCase();
      filteredResources = filteredResources.filter((resource) => {
        const description = 'description' in resource ? resource.description : 
                           'abstract' in resource ? resource.abstract : '';
        const authors = 'authors' in resource ? resource.authors : [];
        const maintainers = 'maintainers' in resource ? resource.maintainers : [];
        
        const searchableText = [
          resource.title,
          description,
          ...resource.tags,
          resource.category,
          ...authors,
          ...maintainers
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchQuery);
      });
    }

    // Apply sorting
    const sortBy = query.sortBy || 'lastUpdated';
    const sortOrder = query.sortOrder || 'desc';

    filteredResources.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'year':
          aValue = 'year' in a ? a.year : new Date(a.lastUpdated).getFullYear();
          bValue = 'year' in b ? b.year : new Date(b.lastUpdated).getFullYear();
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'citations':
          aValue = ('citationCount' in a ? a.citationCount : 'citations' in a ? a.citations : 0) || 0;
          bValue = ('citationCount' in b ? b.citationCount : 'citations' in b ? b.citations : 0) || 0;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
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