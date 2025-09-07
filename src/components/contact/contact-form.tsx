'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import { ContactFormData } from '@/types';
import { SecureContactFormSchema } from '@/lib/security';
import { useCSRF } from '@/hooks/useCSRF';
import { 
  AnimatedInput, 
  InteractiveButton, 
  FormStateAlert, 
  SubmissionState,
  ValidationIcon,
  StaggeredContainer,
  StaggeredItem
} from '@/components/animations';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const { token: csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (name: keyof ContactFormData, value: string) => {
    try {
      const fieldSchema = SecureContactFormSchema.shape[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [name]: undefined }));
        return true;
      }
      return true;
    } catch (error: unknown) {
      const errorMessage = (error as { issues?: { message: string }[] })?.issues?.[0]?.message || 'Invalid input';
      setErrors(prev => ({ ...prev, [name]: errorMessage }));
      return false;
    }
  };

  const handleInputChange = (name: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (value.trim()) {
      validateField(name, value);
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if CSRF token is available
    if (!csrfToken) {
      setSubmitStatus('error');
      return;
    }
    
    // Validate all fields including CSRF token
    const formDataWithCSRF = { ...formData, csrfToken };
    const validation = SecureContactFormSchema.safeParse(formDataWithCSRF);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0] && issue.path[0] !== 'csrfToken') {
          fieldErrors[issue.path[0] as keyof ContactFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (onSubmit) {
        await onSubmit(validation.data);
      } else {
        // Default submission to API with CSRF token
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validation.data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to submit form');
        }
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        organization: '',
        phone: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while CSRF token is being generated
  if (csrfLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tulane-green"></div>
        <span className="ml-2 text-gray-600">Loading form...</span>
      </div>
    );
  }

  // Show error if CSRF token failed to generate
  if (csrfError || !csrfToken) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-800">
            Unable to load form. Please refresh the page and try again.
          </span>
        </div>
      </div>
    );
  }

  return (
    <StaggeredContainer className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          <StaggeredItem>
            <div className="relative">
              <AnimatedInput
                label="Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                error={errors.name}
                placeholder="Your full name"
                required
              />
              <ValidationIcon 
                isValid={formData.name.length > 0 && !errors.name}
                className="absolute right-3 top-8"
              />
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="relative">
              <AnimatedInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email}
                placeholder="your.email@example.com"
                required
              />
              <ValidationIcon 
                isValid={formData.email.length > 0 && !errors.email}
                className="absolute right-3 top-8"
              />
            </div>
          </StaggeredItem>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          <StaggeredItem>
            <AnimatedInput
              label="Organization"
              type="text"
              value={formData.organization}
              onChange={(value) => handleInputChange('organization', value)}
              placeholder="Your organization or institution"
            />
          </StaggeredItem>

          <StaggeredItem>
            <AnimatedInput
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              placeholder="(555) 123-4567"
            />
          </StaggeredItem>
        </div>

        <StaggeredItem>
          <div className="relative">
            <AnimatedInput
              label="Subject"
              type="text"
              value={formData.subject}
              onChange={(value) => handleInputChange('subject', value)}
              error={errors.subject}
              placeholder="Brief description of your inquiry"
              required
            />
            <ValidationIcon 
              isValid={formData.subject.length > 0 && !errors.subject}
              className="absolute right-3 top-8"
            />
          </div>
        </StaggeredItem>

        <StaggeredItem>
          <div className="relative">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <motion.textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`w-full px-3 py-3 sm:py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tulane-green/50 min-h-[120px] sm:min-h-[140px] touch-manipulation ${
                errors.message ? 'border-red-500' : 'border-gray-300 focus:border-tulane-green'
              }`}
              placeholder="Please provide details about your inquiry, collaboration interest, or question..."
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.message}
              </motion.p>
            )}
            <ValidationIcon 
              isValid={formData.message.length > 0 && !errors.message}
              className="absolute right-3 top-10"
            />
          </div>
        </StaggeredItem>

        <StaggeredItem>
          <FormStateAlert
            type="success"
            message="Message sent successfully! We'll get back to you within 24-48 hours."
            visible={submitStatus === 'success'}
          />
          
          <FormStateAlert
            type="error"
            message="Failed to send message. Please try again or contact us directly via email."
            visible={submitStatus === 'error'}
          />
        </StaggeredItem>

        <StaggeredItem>
          <SubmissionState
            state={isSubmitting ? 'submitting' : submitStatus}
            successMessage="Message sent successfully! We'll get back to you within 24-48 hours."
            errorMessage="Failed to send message. Please try again or contact us directly via email."
          />
        </StaggeredItem>

        <StaggeredItem>
          <div className="flex justify-end">
            <InteractiveButton
              onClick={(e) => {
                e?.preventDefault();
                handleSubmit(e as React.FormEvent);
              }}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
              size="lg"
              className="px-8 py-3"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </InteractiveButton>
          </div>
        </StaggeredItem>
      </form>
    </StaggeredContainer>
  );
}