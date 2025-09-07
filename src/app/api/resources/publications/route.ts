import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PublicationResourceSchema, type PublicationResource } from '@/types';
import { z } from 'zod';

const QuerySchema = z.object({
  category: z.string().optional(),
  tags: z.string().optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  openAccess: z.string().transform(val => val === 'true').optional(),
  year: z.string().transform(val => parseInt(val, 10)).optional(),
  author: z.string().optional(),
  journal: z.string().optional(),
  query: z.string().optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
  offset: z.string().transform(val => parseInt(val, 10)).optional(),
  sortBy: z.enum(['title', 'year', 'citationCount', 'lastUpdated']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const filePath = join(process.cwd(), 'src/data/resources/publications.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const publications = JSON.parse(fileContent);
    
    // Validate data
    const validatedPublications = publications.map((publication: unknown) => 
      PublicationResourceSchema.parse(publication)
    );
    
    // Apply filters
    let filteredPublications: PublicationResource[] = validatedPublications;
    
    if (query.category) {
      filteredPublications = filteredPublications.filter((pub: PublicationResource) => 
        pub.category.toLowerCase().includes(query.category!.toLowerCase())
      );
    }
    
    if (query.featured !== undefined) {
      filteredPublications = filteredPublications.filter((pub: PublicationResource) => 
        pub.featured === query.featured
      );
    }
    
    if (query.openAccess !== undefined) {
      filteredPublications = filteredPublications.filter((pub: PublicationResource) => 
        pub.openAccess === query.openAccess
      );
    }
    
    if (query.year) {
      filteredPublications = filteredPublications.filter((pub: PublicationResource) => 
        pub.year === query.year
      );
    }
    
    if (query.author) {
      filteredPublications = filteredPublications.filter((pub: PublicationResource) =>
        pub.authors.some((author: string) => 
          author.toLowerCase().includes(query.author!.toLowerCase())
        )
      );
    }
    
    if (query.journal) {
      filteredPublications = filteredPublications.filter((pub: PublicationResource) => 
        pub.journal.toLowerCase().includes(query.journal!.toLowerCase())
      );
    }
    
    if (query.tags) {
      const searchTags = query.tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredPublications = filteredPublications.filter((pub: PublicationResource) =>
        pub.tags.some((tag: string) => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }
    
    if (query.query) {
      const searchQuery = query.query.toLowerCase();
      filteredPublications = filteredPublications.filter((pub: PublicationResource) => {
        const searchableText = [
          pub.title,
          pub.abstract,
          pub.journal,
          ...pub.authors,
          ...pub.tags,
          pub.category
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchQuery);
      });
    }
    
    // Apply sorting
    const sortBy = query.sortBy || 'year';
    const sortOrder = query.sortOrder || 'desc';
    
    filteredPublications.sort((a: PublicationResource, b: PublicationResource) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'citationCount':
          aValue = a.citationCount || 0;
          bValue = b.citationCount || 0;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        default:
          aValue = a.year;
          bValue = b.year;
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
    const total = filteredPublications.length;
    const paginatedPublications = filteredPublications.slice(offset, offset + limit);
    
    return NextResponse.json({
      data: {
        items: paginatedPublications,
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
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to fetch publications',
      },
      { status: 500 }
    );
  }
}