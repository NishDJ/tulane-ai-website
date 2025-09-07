import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Input sanitization utilities
export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
    });
  }

  /**
   * Sanitize plain text input by removing potentially dangerous characters
   */
  static sanitizeText(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^\w@.-]/g, '') // Only allow word chars, @, ., and -
      .trim();
  }

  /**
   * Sanitize phone number input
   */
  static sanitizePhone(input: string): string {
    return input
      .replace(/[^\d\s\-\(\)\+\.]/g, '') // Only allow digits, spaces, and common phone chars
      .trim();
  }

  /**
   * Sanitize URL input
   */
  static sanitizeUrl(input: string): string {
    try {
      const url = new URL(input);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol');
      }
      return url.toString();
    } catch {
      return '';
    }
  }

  /**
   * General purpose input sanitizer
   */
  static sanitizeInput(input: string, type: 'text' | 'email' | 'phone' | 'url' | 'html' = 'text'): string {
    if (!input || typeof input !== 'string') return '';

    switch (type) {
      case 'html':
        return this.sanitizeHtml(input);
      case 'email':
        return this.sanitizeEmail(input);
      case 'phone':
        return this.sanitizePhone(input);
      case 'url':
        return this.sanitizeUrl(input);
      case 'text':
      default:
        return this.sanitizeText(input);
    }
  }
}

// Rate limiting utilities
export class RateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: number }>();

  /**
   * Check if an IP/identifier has exceeded rate limits
   */
  static isRateLimited(
    identifier: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      // Reset or create new attempt record
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (attempt.count >= maxAttempts) {
      return true;
    }

    // Increment attempt count
    attempt.count++;
    this.attempts.set(identifier, attempt);
    return false;
  }

  /**
   * Get remaining attempts for an identifier
   */
  static getRemainingAttempts(
    identifier: string,
    maxAttempts: number = 5
  ): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - attempt.count);
  }

  /**
   * Get time until rate limit reset
   */
  static getResetTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return 0;
    }
    return attempt.resetTime - Date.now();
  }

  /**
   * Clear rate limit for an identifier (for testing or admin override)
   */
  static clearRateLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// CSRF protection utilities
export class CSRFProtection {
  private static readonly SECRET_KEY = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';

  /**
   * Generate a CSRF token
   */
  static generateToken(sessionId: string): string {
    const timestamp = Date.now().toString();
    const payload = `${sessionId}:${timestamp}`;
    
    // In production, use a proper HMAC implementation
    const token = Buffer.from(payload).toString('base64');
    return token;
  }

  /**
   * Validate a CSRF token
   */
  static validateToken(token: string, sessionId: string, maxAge: number = 3600000): boolean {
    try {
      const payload = Buffer.from(token, 'base64').toString();
      const [tokenSessionId, timestamp] = payload.split(':');
      
      if (tokenSessionId !== sessionId) {
        return false;
      }

      const tokenTime = parseInt(timestamp, 10);
      const now = Date.now();
      
      if (now - tokenTime > maxAge) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

// Enhanced form validation schemas with security measures
export const SecureContactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .transform(val => InputSanitizer.sanitizeInput(val, 'text')),
  email: z.string()
    .email('Valid email is required')
    .max(254, 'Email must be less than 254 characters')
    .transform(val => InputSanitizer.sanitizeInput(val, 'email')),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters')
    .transform(val => InputSanitizer.sanitizeInput(val, 'text')),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .transform(val => InputSanitizer.sanitizeInput(val, 'text')),
  organization: z.string()
    .max(200, 'Organization must be less than 200 characters')
    .optional()
    .transform(val => val ? InputSanitizer.sanitizeInput(val, 'text') : undefined),
  phone: z.string()
    .max(20, 'Phone must be less than 20 characters')
    .optional()
    .transform(val => val ? InputSanitizer.sanitizeInput(val, 'phone') : undefined),
  csrfToken: z.string().min(1, 'CSRF token is required'),
});

export const SecureNewsletterSignupSchema = z.object({
  email: z.string()
    .email('Valid email is required')
    .max(254, 'Email must be less than 254 characters')
    .transform(val => InputSanitizer.sanitizeInput(val, 'email')),
  firstName: z.string()
    .max(50, 'First name must be less than 50 characters')
    .optional()
    .transform(val => val ? InputSanitizer.sanitizeInput(val, 'text') : undefined),
  lastName: z.string()
    .max(50, 'Last name must be less than 50 characters')
    .optional()
    .transform(val => val ? InputSanitizer.sanitizeInput(val, 'text') : undefined),
  interests: z.array(z.string().max(50)).max(10, 'Too many interests selected').optional(),
  csrfToken: z.string().min(1, 'CSRF token is required'),
});

// Security headers configuration
export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

// Utility to get client IP address
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

// Session management utilities
export class SessionManager {
  /**
   * Generate a secure session ID
   */
  static generateSessionId(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for server-side
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate session ID format
   */
  static isValidSessionId(sessionId: string): boolean {
    return /^[a-f0-9]{64}$/.test(sessionId);
  }
}