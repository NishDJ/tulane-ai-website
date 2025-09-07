'use client';

import { useState } from 'react';
import { ContactFormData } from '@/types';

interface UseContactReturn {
  submitContactForm: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  error: string | null;
}

export function useContact(): UseContactReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (data: ContactFormData): Promise<void> => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContactForm,
    isSubmitting,
    submitStatus,
    error,
  };
}