import axios from 'axios';
import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { api } from '../services/apiClient';
import { csrfService } from '../services/csrfService';
import { logoutService } from '../services/logoutService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currencySymbol = '₹';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(false);
  const [userData, setUserData] = useState(false);
  const [csrfInitialized, setCsrfInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  // Get all doctors
  const getDoctosData = async () => {
    try {
      const { data } = await api.get('/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Get user profile (fixed route)
  const loadUserProfileData = async () => {
    try {
      const { data } = await api.get('/api/user/profile');

      if (data.success) {
        setUserData(data.userData);
        return true; // Successfully loaded profile
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      // Don't show error toast for profile loading failure during initialization
      return false;
    }
  };

  // Check if user is already authenticated (for page refresh)
  const checkAuthStatus = async () => {
    try {
      const { data } = await api.get('/api/user/profile');
      if (data.success) {
        setToken(true);
        setUserData(data.userData);
        console.log('User is already authenticated');
        return true;
      }
    } catch (error) {
      console.log('User is not authenticated');
      setToken(false);
      setUserData(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    return await logoutService.logout(navigate, setToken, setUserData);
  };

  // Initialize CSRF token and check auth status on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First initialize CSRF token
        await csrfService.fetchToken();
        setCsrfInitialized(true);
        console.log('CSRF token initialized successfully');
        
        // Then check if user is already authenticated
        await checkAuthStatus();
        
      } catch (error) {
        console.error('Failed to initialize CSRF token:', error);
        // Still allow app to load even if CSRF fails
        setCsrfInitialized(true);
        
        // Still try to check auth status
        await checkAuthStatus();
      } finally {
        // Mark initialization as complete
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (csrfInitialized) {
      getDoctosData();
    }
  }, [csrfInitialized]);

  // Load user profile data when token becomes true (but not during initial auth check)
  useEffect(() => {
    if (token && userData === false) {
      loadUserProfileData();
    }
  }, [token]);

  // Axios interceptor for 401 Unauthorized
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Use logout service for proper cleanup
          logoutService.emergencyLogout(navigate, setToken, setUserData);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  const value = {
    doctors,
    getDoctosData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    checkAuthStatus,
    logout,
    csrfInitialized,
    isInitializing,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
