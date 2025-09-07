'use client';

import { useState, useEffect } from 'react';
import { CSRFProtection, SessionManager } from '@/lib/security';

interface CSRFHook {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => void;
}

export function useCSRF(): CSRFHook {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateToken = () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get or create session ID
      let sessionId = localStorage.getItem('session-id');
      if (!sessionId || !SessionManager.isValidSessionId(sessionId)) {
        sessionId = SessionManager.generateSessionId();
        localStorage.setItem('session-id', sessionId);
      }

      // Generate CSRF token
      const csrfToken = CSRFProtection.generateToken(sessionId);
      setToken(csrfToken);
    } catch (err) {
      setError('Failed to generate CSRF token');
      console.error('CSRF token generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = () => {
    generateToken();
  };

  useEffect(() => {
    generateToken();
  }, []);

  return {
    token,
    isLoading,
    error,
    refreshToken,
  };
}

// Hook for validating CSRF tokens on the server side
export function validateCSRFToken(token: string, sessionId: string): boolean {
  return CSRFProtection.validateToken(token, sessionId);
}