import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { csrfService } from '../services/csrfService';

/**
 * Hook for managing CSRF tokens
 */
export const useCSRF = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeCSRF = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await csrfService.fetchToken();
    } catch (err) {
      setError(err);
      console.error('Failed to initialize CSRF:', err);
      toast.error('Failed to initialize security tokens');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCSRF = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await csrfService.refreshToken();
    } catch (err) {
      setError(err);
      console.error('Failed to refresh CSRF:', err);
      toast.error('Failed to refresh security tokens');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCSRF = useCallback(() => {
    csrfService.clearToken();
    setError(null);
  }, []);

  return {
    initializeCSRF,
    refreshCSRF,
    clearCSRF,
    isLoading,
    error,
    hasToken: csrfService.hasToken(),
  };
};

/**
 * Hook for secure form handling with CSRF protection
 */
export const useSecureForm = (onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfError, setCsrfError] = useState(null);

  const handleSubmit = useCallback(async (formData, ...args) => {
    setIsSubmitting(true);
    setCsrfError(null);

    try {
      // Ensure we have a CSRF token
      await csrfService.getToken();
      
      // Call the actual submit handler
      await onSubmit(formData, ...args);
    } catch (error) {
      // Check if it's a CSRF-related error
      if (error.response?.status === 403 && 
          error.response?.data?.message?.includes('CSRF')) {
        setCsrfError('Security token expired. Please try again.');
        
        try {
          // Try to refresh the token
          await csrfService.refreshToken();
          toast.info('Security token refreshed. Please try again.');
        } catch (refreshError) {
          setCsrfError('Failed to refresh security token. Please reload the page.');
        }
      } else {
        throw error; // Re-throw non-CSRF errors
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  return {
    handleSubmit,
    isSubmitting,
    csrfError,
    clearError: () => setCsrfError(null),
  };
};

export default { useCSRF, useSecureForm };
