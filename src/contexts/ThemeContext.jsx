import { createContext, useContext, useState, useEffect } from 'react';
import { THEME } from '../lib/constants';

// Create the theme context
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or use system default
    const savedTheme = localStorage.getItem('fitdash-theme');
    if (savedTheme && Object.values(THEME).includes(savedTheme)) {
      return savedTheme;
    }
    return THEME.SYSTEM; // Default to system
  });

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply appropriate theme
    if (theme === THEME.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEME.DARK
        : THEME.LIGHT;
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Save to localStorage
    localStorage.setItem('fitdash-theme', theme);
  }, [theme]);

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (theme !== THEME.SYSTEM) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? THEME.DARK : THEME.LIGHT);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => {
      if (current === THEME.LIGHT) return THEME.DARK;
      if (current === THEME.DARK) return THEME.SYSTEM;
      return THEME.LIGHT;
    });
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: 
      theme === THEME.DARK || 
      (theme === THEME.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches)
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;