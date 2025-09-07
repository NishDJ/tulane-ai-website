import { 
  type FacultyMember, 
  type ApiResponse, 
  type PaginatedResponse, 
  type SearchFilters, 
  type SortOptions 
} from '@/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : '';
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry<T>(
    endpoint: string, 
    options: RequestInit = {},
    retryOptions: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      backoffMultiplier = 2
    } = retryOptions;

    const url = `${this.baseUrl}/api${endpoint}`;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          ...options,
        });

        if (!response.ok) {
          const isRetryable = response.status >= 500 || response.status === 429;
          const error = new ApiError(
            `API request failed: ${response.statusText}`,
            response.status,
            response.statusText,
            isRetryable
          );

          // Don't retry on client errors (4xx) except 429 (rate limit)
          if (!isRetryable || attempt === maxRetries) {
            throw error;
          }

          // Wait before retrying
          const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
          await this.sleep(delay);
          continue;
        }

        return await response.json();
      } catch (error) {
        if (error instanceof ApiError) {
          if (!error.isRetryable || attempt === maxRetries) {
            throw error;
          }
        } else {
          // Network error - always retryable
          if (attempt === maxRetries) {
            throw new ApiError('Network error occurred', 0, 'Network Error', true);
          }
        }

        // Wait before retrying
        const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
        await this.sleep(delay);
      }
    }

    throw new ApiError('Max retries exceeded', 0, 'Max Retries', false);
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetchWithRetry<T>(endpoint, options);
  }

  // Faculty API methods
  async getFaculty(): Promise<ApiResponse<FacultyMember[]>> {
    return this.fetchApi<ApiResponse<FacultyMember[]>>('/faculty');
  }

  async getFacultyMember(id: string): Promise<ApiResponse<FacultyMember | null>> {
    return this.fetchApi<ApiResponse<FacultyMember | null>>(`/faculty/${id}`);
  }

  async searchFaculty(
    filters: SearchFilters = {},
    sortOptions: SortOptions = { field: 'name', direction: 'asc' },
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<FacultyMember>> {
    const params = new URLSearchParams();
    
    if (filters.query) params.append('query', filters.query);
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    if (page > 1) params.append('page', page.toString());
    if (limit !== 10) params.append('limit', limit.toString());
    if (sortOptions.field !== 'name') params.append('sortField', sortOptions.field);
    if (sortOptions.direction !== 'asc') params.append('sortDirection', sortOptions.direction);

    const queryString = params.toString();
    const endpoint = queryString ? `/faculty?${queryString}` : '/faculty';
    
    return this.fetchApi<PaginatedResponse<FacultyMember>>(endpoint);
  }
}

export const apiClient = new ApiClient();