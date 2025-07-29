import { toast } from 'react-toastify';
import { api } from './apiClient';
import { csrfService } from './csrfService';

class LogoutService {
  /**
   * Perform complete logout
   */
  async logout(navigate, setToken, setUserData) {
    try {
      // Call backend logout endpoint with CSRF protection
      const { data } = await api.post('/api/user/logout');
      
      if (data.success) {
        // Clear all frontend state and storage
        this.clearAllData(setToken, setUserData);
        
        // Show success message
        toast.success(data.message || 'Logged out successfully');
        
        // Redirect to login page
        if (navigate) {
          navigate('/login');
        }
        
        return true;
      } else {
        toast.error(data.message || 'Logout failed');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if backend logout fails, clear frontend data for security
      this.clearAllData(setToken, setUserData);
      
      // Show error message
      toast.error('Logout completed locally due to connection error');
      
      // Still redirect to login for security
      if (navigate) {
        navigate('/login');
      }
      
      return false;
    }
  }

  /**
   * Clear all frontend data
   */
  clearAllData(setToken, setUserData) {
    // Clear application state
    if (setToken) setToken(false);
    if (setUserData) setUserData(false);
    
    // Clear CSRF tokens
    csrfService.clearToken();
    
    // Clear all browser storage
    this.clearBrowserStorage();
  }

  /**
   * Clear all browser storage
   */
  clearBrowserStorage() {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear any app-specific items (add more as needed)
      const itemsToClear = [
        'token',
        'user',
        'userData',
        'authToken',
        'userSession',
        'csrfToken'
      ];
      
      itemsToClear.forEach(item => {
        localStorage.removeItem(item);
        sessionStorage.removeItem(item);
      });
      
      console.log('Browser storage cleared successfully');
    } catch (error) {
      console.error('Error clearing browser storage:', error);
    }
  }

  /**
   * Emergency logout (clears everything without backend call)
   */
  emergencyLogout(navigate, setToken, setUserData) {
    console.warn('Emergency logout triggered');
    
    this.clearAllData(setToken, setUserData);
    
    toast.warning('Session cleared for security reasons');
    
    if (navigate) {
      navigate('/login');
    }
  }
}

// Export singleton instance
export const logoutService = new LogoutService();
export default logoutService;
