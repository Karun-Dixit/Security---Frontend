import axios from 'axios';
import { toast } from 'react-toastify';
import { csrfService } from './csrfService';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor to add CSRF token
apiClient.interceptors.request.use(
  async (config) => {
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      try {
        const csrfToken = await csrfService.getToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
      } catch (error) {
        console.error('Failed to get CSRF token:', error);
        // Continue with request even if CSRF token fails
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle CSRF token errors (403 Forbidden)
    if (error.response?.status === 403 && 
        error.response?.data?.message?.includes('CSRF') && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;

      try {
        // Refresh CSRF token
        await csrfService.refreshToken();
        
        // Update the original request with new token
        const newToken = await csrfService.getToken();
        if (newToken) {
          originalRequest.headers['X-CSRF-Token'] = newToken;
        }
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (csrfError) {
        console.error('Failed to refresh CSRF token:', csrfError);
        toast.error('Security token expired. Please refresh the page.');
        
        // Clear the invalid token
        csrfService.clearToken();
        
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions for common HTTP methods
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
