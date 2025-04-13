import apiClient from './apiClient';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../lib/constants';

/**
 * Log in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Store auth token and user data
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} New user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    const { token, user } = response.data;
    
    // Store auth token and user data
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || 'Failed to register');
  }
};

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    // Optional: Call logout endpoint if your API requires it
    // await apiClient.post('/auth/logout');
    
    // Clear local storage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error(error.response?.data?.message || 'Failed to logout');
  }
};

/**
 * Get the current logged-in user
 * @returns {Promise<Object|null>} Current user data or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    // First check if we have user data in localStorage
    const userData = localStorage.getItem(USER_DATA_KEY);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!userData || !token) {
      return null;
    }
    
    // Verify token is valid by fetching fresh user data
    const response = await apiClient.get('/auth/me');
    const freshUserData = response.data;
    
    // Update stored user data with fresh data
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(freshUserData));
    
    return freshUserData;
  } catch (error) {
    // If token is invalid, clear storage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    return null;
  }
};