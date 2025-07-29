import axios from 'axios';

class CSRFService {
  constructor() {
    this.token = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  /**
   * Fetch CSRF token from backend
   */
  async fetchToken() {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/csrf-token`, {
        withCredentials: true
      });
      
      if (response.data.success && response.data.csrfToken) {
        this.token = response.data.csrfToken;
        return this.token;
      }
      throw new Error('Failed to fetch CSRF token');
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    }
  }

  /**
   * Get current CSRF token, fetch if not available
   */
  async getToken() {
    if (!this.token) {
      await this.fetchToken();
    }
    return this.token;
  }

  /**
   * Refresh CSRF token with deduplication
   */
  async refreshToken() {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.fetchToken()
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  /**
   * Clear stored token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Reset token (clear and refresh)
   */
  async resetToken() {
    this.clearToken();
    return await this.fetchToken();
  }

  /**
   * Check if we have a valid token
   */
  hasToken() {
    return !!this.token;
  }
}

// Export singleton instance
export const csrfService = new CSRFService();
export default csrfService;
