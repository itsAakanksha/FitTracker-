import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';

/**
 * Custom hook for accessing and managing user profile data
 * @returns {Object} User data and related functions
 */
export function useUserData() {
  const { currentUser, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data when authenticated
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;
    
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile(currentUser.id);
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser?.id, isAuthenticated]);

  // Function to update user profile
  const updateProfile = async (updatedData) => {
    if (!isAuthenticated || !currentUser?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const updated = await updateUserProfile(currentUser.id, updatedData);
      setUserData(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    loading,
    error,
    updateProfile,
    isLoaded: !!userData && !loading
  };
}