import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, getClientIP, securityHeaders } from '@/lib/security';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // API routes have stricter limits
  '/api/contact': { maxAttempts: 3, windowMs: 15 * 60 * 1000 }, // 3 attempts per 15 minutes
  '/api/newsletter': { maxAttempts: 5, windowMs: 60 * 60 * 1000 }, // 5 attempts per hour
  '/api/search': { maxAttempts: 30, windowMs: 60 * 1000 }, // 30 attempts per minute
  // General API rate limit
  '/api/': { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 requests per minute
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers to all responses
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });

  // Get client IP for rate limiting
  const clientIP = getClientIP(request);
  const pathname = request.nextUrl.pathname;

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Find the most specific rate limit configuration
    let rateLimitConfig = RATE_LIMIT_CONFIG['/api/']; // Default
    
    for (const [path, config] of Object.entries(RATE_LIMIT_CONFIG)) {
      if (pathname.startsWith(path) && path !== '/api/') {
        rateLimitConfig = config;
        break;
      }
    }

    const isRateLimited = RateLimiter.isRateLimited(
      `${clientIP}:${pathname}`,
      rateLimitConfig.maxAttempts,
      rateLimitConfig.windowMs
    );

    if (isRateLimited) {
      const resetTime = RateLimiter.getResetTime(`${clientIP}:${pathname}`);
      const remainingAttempts = RateLimiter.getRemainingAttempts(
        `${clientIP}:${pathname}`,
        rateLimitConfig.maxAttempts
      );

      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(resetTime / 1000),
          remainingAttempts,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(resetTime / 1000).toString(),
            'X-RateLimit-Limit': rateLimitConfig.maxAttempts.toString(),
            'X-RateLimit-Remaining': remainingAttempts.toString(),
            'X-RateLimit-Reset': new Date(Date.now() + resetTime).toISOString(),
            ...Object.fromEntries(securityHeaders.map(({ key, value }) => [key, value])),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const remainingAttempts = RateLimiter.getRemainingAttempts(
      `${clientIP}:${pathname}`,
      rateLimitConfig.maxAttempts
    );
    
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxAttempts.toString());
    response.headers.set('X-RateLimit-Remaining', remainingAttempts.toString());
  }

  // Add CSRF token to form pages
  if (pathname.includes('/contact') || pathname.includes('/newsletter')) {
    // Generate session ID if not present
    const sessionId = request.cookies.get('session-id')?.value || generateSessionId();
    
    if (!request.cookies.get('session-id')) {
      response.cookies.set('session-id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
    }
  }

  return response;
}

// Helper function to generate session ID
function generateSessionId(): string {
  const array = new Uint8Array(32);
  // Use crypto.getRandomValues if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};