import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { extractTextFromMDX, validateContentStructure } from './search';

// Content validation schemas
const MDXFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
});

const ContentFileSchema = z.object({
  slug: z.string(),
  frontmatter: MDXFrontmatterSchema,
  content: z.string(),
  excerpt: z.string().optional(),
  readingTime: z.number().optional(),
});

export type MDXFrontmatter = z.infer<typeof MDXFrontmatterSchema>;
export type ContentFile = z.infer<typeof ContentFileSchema>;

// Content parsing errors
export class ContentParsingError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ContentParsingError';
  }
}

export class ContentValidationError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly validationErrors: z.ZodError
  ) {
    super(message);
    this.name = 'ContentValidationError';
  }
}

// MDX content parsing
export async function parseMDXFile(filePath: string): Promise<ContentFile> {
  try {
    const fullPath = path.resolve(filePath);
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    
    const { data: frontmatter, content } = matter(fileContents);
    
    // Validate frontmatter
    const validationResult = MDXFrontmatterSchema.safeParse(frontmatter);
    if (!validationResult.success) {
      throw new ContentValidationError(
        'Invalid frontmatter structure',
        filePath,
        validationResult.error
      );
    }

    // Generate slug from filename
    const slug = path.basename(filePath, path.extname(filePath));
    
    // Extract plain text content
    const plainTextContent = extractTextFromMDX(content);
    
    // Generate excerpt if not provided
    const excerpt = frontmatter.excerpt || generateExcerpt(plainTextContent);
    
    // Calculate reading time
    const readingTime = calculateReadingTime(plainTextContent);

    return {
      slug,
      frontmatter: validationResult.data,
      content,
      excerpt,
      readingTime,
    };
  } catch (error) {
    if (error instanceof ContentValidationError) {
      throw error;
    }
    
    throw new ContentParsingError(
      `Failed to parse MDX file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      filePath,
      error instanceof Error ? error : undefined
    );
  }
}

// Parse multiple MDX files from a directory
export async function parseMDXDirectory(directoryPath: string): Promise<ContentFile[]> {
  try {
    const fullPath = path.resolve(directoryPath);
    const files = await fs.promises.readdir(fullPath);
    
    const mdxFiles = files.filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );

    const contentFiles = await Promise.allSettled(
      mdxFiles.map(file => parseMDXFile(path.join(fullPath, file)))
    );

    const results: ContentFile[] = [];
    const errors: ContentParsingError[] = [];

    contentFiles.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        errors.push(new ContentParsingError(
          `Failed to parse ${mdxFiles[index]}: ${result.reason.message}`,
          path.join(fullPath, mdxFiles[index]),
          result.reason
        ));
      }
    });

    // Log errors but don't throw - allow partial success
    if (errors.length > 0) {
      console.warn(`Content parsing warnings: ${errors.length} files failed to parse`);
      errors.forEach(error => console.warn(error.message));
    }

    return results;
  } catch (error) {
    throw new ContentParsingError(
      `Failed to read directory: ${error instanceof Error ? error.message : 'Unknown error'}`,
      directoryPath,
      error instanceof Error ? error : undefined
    );
  }
}

// JSON data validation and parsing
export async function parseJSONFile<T>(
  filePath: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const fullPath = path.resolve(filePath);
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      throw new ContentValidationError(
        'Invalid JSON structure',
        filePath,
        validationResult.error
      );
    }

    return validationResult.data;
  } catch (error) {
    if (error instanceof ContentValidationError) {
      throw error;
    }
    
    if (error instanceof SyntaxError) {
      throw new ContentParsingError(
        `Invalid JSON syntax: ${error.message}`,
        filePath,
        error
      );
    }
    
    throw new ContentParsingError(
      `Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      filePath,
      error instanceof Error ? error : undefined
    );
  }
}

// Content validation utilities
export function validateDataFile(filePath: string, data: unknown): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Basic structure validation
    if (!data) {
      errors.push('File is empty or contains no data');
      return { isValid: false, errors, warnings };
    }

    // Determine content type from file path
    const contentType = determineContentType(filePath);
    
    if (!validateContentStructure(data, contentType)) {
      errors.push(`Invalid structure for ${contentType} content`);
    }

    // Check for common issues
    if (Array.isArray(data)) {
      if (data.length === 0) {
        warnings.push('Array is empty');
      }
      
      // Check for duplicate IDs
      const ids = data
        .filter(item => item && typeof item === 'object' && 'id' in item)
        .map(item => (item as { id: string }).id);
      
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        errors.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { isValid: false, errors, warnings };
  }
}

// Content repair utilities
export function repairMalformedData(data: unknown, contentType: string): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => repairDataItem(item, contentType)).filter(Boolean);
  }

  return repairDataItem(data, contentType);
}

function repairDataItem(item: unknown, contentType: string): unknown {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const obj = item as Record<string, unknown>;
  const repaired: Record<string, unknown> = {};

  // Ensure required fields exist
  switch (contentType) {
    case 'faculty':
      repaired.id = obj.id || generateId();
      repaired.name = obj.name || 'Unknown';
      repaired.title = obj.title || 'Faculty Member';
      repaired.department = obj.department || 'Unknown Department';
      repaired.email = obj.email || '';
      repaired.bio = obj.bio || '';
      repaired.researchAreas = Array.isArray(obj.researchAreas) ? obj.researchAreas : [];
      repaired.education = Array.isArray(obj.education) ? obj.education : [];
      repaired.publications = Array.isArray(obj.publications) ? obj.publications : [];
      repaired.profileImage = obj.profileImage || '/images/faculty/default.jpg';
      repaired.isActive = typeof obj.isActive === 'boolean' ? obj.isActive : true;
      break;
      
    case 'research':
      repaired.id = obj.id || generateId();
      repaired.title = obj.title || 'Untitled Project';
      repaired.description = obj.description || '';
      repaired.status = ['active', 'completed', 'planned'].includes(obj.status as string) 
        ? obj.status : 'active';
      repaired.startDate = obj.startDate || new Date().toISOString();
      repaired.principalInvestigator = obj.principalInvestigator || 'Unknown';
      repaired.collaborators = Array.isArray(obj.collaborators) ? obj.collaborators : [];
      repaired.tags = Array.isArray(obj.tags) ? obj.tags : [];
      repaired.images = Array.isArray(obj.images) ? obj.images : [];
      repaired.featured = typeof obj.featured === 'boolean' ? obj.featured : false;
      break;
      
    default:
      return obj;
  }

  // Copy over other valid fields
  Object.keys(obj).forEach(key => {
    if (!(key in repaired) && obj[key] !== undefined && obj[key] !== null) {
      repaired[key] = obj[key];
    }
  });

  return repaired;
}

// Utility functions
function determineContentType(filePath: string): string {
  const fileName = path.basename(filePath).toLowerCase();
  
  if (fileName.includes('faculty')) return 'faculty';
  if (fileName.includes('research')) return 'research';
  if (fileName.includes('news')) return 'news';
  if (fileName.includes('event')) return 'event';
  
  return 'unknown';
}

function generateExcerpt(content: string, maxLength = 160): string {
  const cleaned = content.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Content health check
export async function performContentHealthCheck(dataDirectory: string): Promise<{
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  warnings: number;
  errors: Array<{
    file: string;
    type: 'error' | 'warning';
    message: string;
  }>;
}> {
  const results = {
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    warnings: 0,
    errors: [] as Array<{
      file: string;
      type: 'error' | 'warning';
      message: string;
    }>,
  };

  try {
    const files = await fs.promises.readdir(dataDirectory, { recursive: true });
    const dataFiles = files.filter(file => 
      typeof file === 'string' && (file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.mdx'))
    );

    results.totalFiles = dataFiles.length;

    for (const file of dataFiles) {
      const filePath = path.join(dataDirectory, file as string);
      
      try {
        if (file.endsWith('.json')) {
          const content = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
          const validation = validateDataFile(filePath, content);
          
          if (validation.isValid) {
            results.validFiles++;
          } else {
            results.invalidFiles++;
          }
          
          validation.errors.forEach(error => {
            results.errors.push({
              file: file as string,
              type: 'error',
              message: error,
            });
          });
          
          validation.warnings.forEach(warning => {
            results.warnings++;
            results.errors.push({
              file: file as string,
              type: 'warning',
              message: warning,
            });
          });
        } else {
          // MDX file
          await parseMDXFile(filePath);
          results.validFiles++;
        }
      } catch (error) {
        results.invalidFiles++;
        results.errors.push({
          file: file as string,
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  } catch (error) {
    results.errors.push({
      file: dataDirectory,
      type: 'error',
      message: `Failed to read directory: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }

  return results;
}