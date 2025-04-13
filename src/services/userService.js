import apiClient from './apiClient';

/**
 * Get user profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

/**
 * Update user profile data
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user profile');
  }
};

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Updated preferences
 * @returns {Promise<Object>} Updated preferences
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const response = await apiClient.put(`/users/${userId}/preferences`, preferences);
    return response.data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw new Error(error.response?.data?.message || 'Failed to update preferences');
  }
};

/**
 * Get user's connected devices
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of connected devices
 */
export const getUserDevices = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}/devices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user devices:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch connected devices');
  }
};

/**
 * Connect a new device
 * @param {string} userId - User ID
 * @param {Object} deviceData - Device information
 * @returns {Promise<Object>} Connected device data
 */
export const connectDevice = async (userId, deviceData) => {
  try {
    const response = await apiClient.post(`/users/${userId}/devices`, deviceData);
    return response.data;
  } catch (error) {
    console.error('Error connecting device:', error);
    throw new Error(error.response?.data?.message || 'Failed to connect device');
  }
};

/**
 * Disconnect a device
 * @param {string} userId - User ID
 * @param {string} deviceId - Device ID
 * @returns {Promise<void>}
 */
export const disconnectDevice = async (userId, deviceId) => {
  try {
    await apiClient.delete(`/users/${userId}/devices/${deviceId}`);
  } catch (error) {
    console.error('Error disconnecting device:', error);
    throw new Error(error.response?.data?.message || 'Failed to disconnect device');
  }
};