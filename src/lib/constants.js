// Application-wide constants

// API Endpoints
export const API_BASE_URL = 'https://api.fitdash.com/v1'; // Change to your actual API URL

// Authentication Constants
export const AUTH_TOKEN_KEY = 'fitdash_auth_token';
export const USER_DATA_KEY = 'fitdash_user_data';

// Dashboard View Options
export const TIME_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// Activity Types
export const ACTIVITY_TYPES = {
  RUNNING: 'running',
  WALKING: 'walking',
  CYCLING: 'cycling',
  SWIMMING: 'swimming',
  STRENGTH: 'strength',
  YOGA: 'yoga',
  OTHER: 'other',
};

// Goal Types
export const GOAL_TYPES = {
  DISTANCE: 'distance',
  DURATION: 'duration',
  CALORIES: 'calories',
  FREQUENCY: 'frequency',
  WEIGHT: 'weight',
};

// Theme Constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Chart Colors
export const CHART_COLORS = [
  '#4C51BF', // Indigo
  '#38B2AC', // Teal
  '#ED8936', // Orange
  '#667EEA', // Indigo/Purple
  '#F56565', // Red
  '#48BB78', // Green
];

// Max items to display in lists
export const MAX_RECENT_ACTIVITIES = 5;
export const MAX_GOALS_DISPLAY = 3;