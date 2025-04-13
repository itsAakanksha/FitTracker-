import { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

/**
 * Custom hook for accessing and managing theme settings
 * This is a simple re-export of the theme context to make it more discoverable
 * @returns {Object} Theme state and related functions
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}