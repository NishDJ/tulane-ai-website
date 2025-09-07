'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { NewsletterSignupData } from '@/types';
import { SecureNewsletterSignupSchema } from '@/lib/security';
import { useCSRF } from '@/hooks/useCSRF';

interface NewsletterSignupProps {
  className?: string;
  compact?: boolean;
}

export function NewsletterSignup({ className = '', compact = false }: NewsletterSignupProps) {
  const { token: csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [formData, setFormData] = useState<NewsletterSignupData>({
    email: '',
    firstName: '',
    lastName: '',
    interests: []
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const interestOptions = [
    'AI Research',
    'Medical Applications',
    'Data Science',
    'Machine Learning',
    'Healthcare Technology',
    'Academic Programs',
    'Industry Partnerships',
    'Events & Seminars'
  ];

  const handleInputChange = (field: keyof NewsletterSignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  const validateForm = () => {
    if (!csrfToken) {
      setErrors({ general: 'Security token missing. Please refresh the page.' });
      return false;
    }

    try {
      const formDataWithCSRF = { ...formData, csrfToken };
      SecureNewsletterSignupSchema.parse(formDataWithCSRF);
      setErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: { [key: string]: string } = {};
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: string[]; message: string }> };
        zodError.issues?.forEach((err) => {
          if (err.path[0] !== 'csrfToken') {
            newErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setStatus('loading');

    try {
      const formDataWithCSRF = { ...formData, csrfToken };
      
      // Send to API endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithCSRF),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to subscribe');
      }
      
      setStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ email: '', firstName: '', lastName: '', interests: [] });
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const formVariants = {
    idle: { opacity: 1 },
    loading: { opacity: 0.7 },
    success: { opacity: 1 },
    error: { opacity: 1 }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    loading: { scale: 0.98 },
    success: { scale: 1.02 },
    error: { scale: 1 }
  };

  // Show loading state while CSRF token is being generated
  if (csrfLoading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tulane-green"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error if CSRF token failed to generate
  if (csrfError || !csrfToken) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-800">
            Unable to load newsletter signup. Please refresh the page.
          </span>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-green-50 border border-green-200 rounded-xl p-6 text-center ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Welcome to our newsletter!
        </h3>
        <p className="text-green-700">
          Thank you for subscribing. You&apos;ll receive updates about our latest research, events, and news.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={formVariants}
      animate={status}
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <Mail className="w-8 h-8 text-tulane-green mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Stay Updated
        </h3>
        <p className="text-gray-600">
          Get the latest news, research updates, and event announcements delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
            disabled={status === 'loading'}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Name Fields */}
        {!compact && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent transition-colors"
                placeholder="John"
                disabled={status === 'loading'}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulane-green focus:border-transparent transition-colors"
                placeholder="Doe"
                disabled={status === 'loading'}
              />
            </div>
          </div>
        )}     
   {/* Interests */}
        {!compact && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <motion.button
                  key={interest}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInterestToggle(interest)}
                  disabled={status === 'loading'}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.interests?.includes(interest)
                      ? 'bg-tulane-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          variants={buttonVariants}
          animate={status}
          whileHover={status === 'idle' ? { scale: 1.02 } : {}}
          whileTap={status === 'idle' ? { scale: 0.98 } : {}}
          disabled={status === 'loading'}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            status === 'loading'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : status === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-tulane-green text-white hover:bg-tulane-green/90'
          }`}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Subscribing...</span>
              </motion.div>
            ) : status === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Try Again</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Something went wrong. Please try again.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}