import { NextRequest, NextResponse } from 'next/server';
import { type ContactFormData } from '@/types';
import { SecureContactFormSchema, RateLimiter, getClientIP, CSRFProtection } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limiting (additional check beyond middleware)
    if (RateLimiter.isRateLimited(`${clientIP}:contact-form`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests',
          message: 'Please wait before submitting another message.'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate the request body with security measures
    const validation = SecureContactFormSchema.safeParse(body);
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

    // Log the sanitized form submission (data is already sanitized by SecureContactFormSchema)
    console.log('Secure contact form submission:', {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message?.substring(0, 100) + '...', // Log only first 100 chars of message
      organization: formData.organization,
      phone: formData.phone,
      clientIP: clientIP.substring(0, 10) + '...', // Partially mask IP for privacy
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.substring(0, 50) + '...',
    });

    // In a real implementation, you would:
    // 1. Send email using a service like SendGrid, AWS SES, or Nodemailer
    // 2. Store the submission in a database with proper encryption
    // 3. Send confirmation email to the user
    // 4. Notify the appropriate team members
    // 5. Implement honeypot fields for additional bot protection

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would implement actual email sending here:
    /*
    const emailService = new EmailService();
    await emailService.sendContactFormNotification({
      to: 'ai-datascience@tulane.edu',
      from: formData.email,
      subject: `Contact Form: ${formData.subject}`,
      html: generateContactEmailTemplate(formData),
    });

    await emailService.sendConfirmationEmail({
      to: formData.email,
      subject: 'Thank you for contacting Tulane AI & Data Science Division',
      html: generateConfirmationEmailTemplate(formData),
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24-48 hours.',
    });

  } catch (error) {
    // Log error without exposing sensitive information
    console.error('Contact form submission error:', {
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

// Helper function to generate email template (would be implemented in production)
function generateContactEmailTemplate(formData: ContactFormData): string {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Organization:</strong> ${formData.organization || 'Not provided'}</p>
    <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${formData.subject}</p>
    <p><strong>Message:</strong></p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${formData.message.replace(/\n/g, '<br>')}
    </div>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
  `;
}

function generateConfirmationEmailTemplate(formData: ContactFormData): string {
  return `
    <h2>Thank you for contacting us!</h2>
    <p>Dear ${formData.name},</p>
    <p>We have received your message regarding "${formData.subject}" and will get back to you within 24-48 hours.</p>
    <p>If you have any urgent questions, please feel free to call us at (504) 988-5263.</p>
    <p>Best regards,<br>
    Tulane AI & Data Science Division</p>
  `;
}