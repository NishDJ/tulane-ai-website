import { NextRequest, NextResponse } from 'next/server';
import { type NewsletterSignupData } from '@/types';
import { SecureNewsletterSignupSchema, RateLimiter, getClientIP, CSRFProtection } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limiting (additional check beyond middleware)
    if (RateLimiter.isRateLimited(`${clientIP}:newsletter`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests',
          message: 'Please wait before subscribing again.'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate the request body with security measures
    const validation = SecureNewsletterSignupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data',
          details: validation.error.issues.map(issue => ({
            field: issue.path[0],
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { csrfToken, ...formData } = validation.data;
    
    // Validate CSRF token
    const sessionId = request.cookies.get('session-id')?.value;
    if (!sessionId || !CSRFProtection.validateToken(csrfToken, sessionId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid security token',
          message: 'Please refresh the page and try again.'
        },
        { status: 403 }
      );
    }

    // Log the sanitized newsletter signup (data is already sanitized by SecureNewsletterSignupSchema)
    console.log('Secure newsletter signup:', {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      interests: formData.interests,
      clientIP: clientIP.substring(0, 10) + '...', // Partially mask IP for privacy
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.substring(0, 50) + '...',
    });

    // Simulate newsletter subscription processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, you would:
    // 1. Add email to newsletter service (MailChimp, SendGrid, etc.)
    // 2. Store subscription in database with proper encryption
    // 3. Send welcome email to the subscriber
    // 4. Implement double opt-in for GDPR compliance
    // 5. Handle unsubscribe functionality
    // 6. Implement honeypot fields for additional bot protection

    /*
    const newsletterService = new NewsletterService();
    await newsletterService.subscribe({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      interests: formData.interests,
      source: 'website',
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent'),
    });

    await newsletterService.sendWelcomeEmail({
      to: formData.email,
      firstName: formData.firstName,
      interests: formData.interests,
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.',
    });

  } catch (error) {
    // Log error without exposing sensitive information
    console.error('Newsletter signup error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      ip: getClientIP(request).substring(0, 10) + '...',
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Please try again later or contact us directly at ai@tulane.edu'
      },
      { status: 500 }
    );
  }
}

// Helper function to generate welcome email template (would be implemented in production)
function generateWelcomeEmailTemplate(formData: NewsletterSignupData): string {
  return `
    <h2>Welcome to Tulane AI & Data Science Newsletter!</h2>
    <p>Dear ${formData.firstName || 'Subscriber'},</p>
    <p>Thank you for subscribing to our newsletter. You'll receive updates about:</p>
    <ul>
      ${formData.interests?.map(interest => `<li>${interest}</li>`).join('') || '<li>Latest AI and Data Science news</li>'}
    </ul>
    <p>You can unsubscribe at any time by clicking the link at the bottom of our emails.</p>
    <p>Best regards,<br>
    Tulane AI & Data Science Division</p>
  `;
}