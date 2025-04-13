/**
 * User Types for FitDash App
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - Unique user identifier
 * @property {string} username - User's username
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} [profilePicture] - URL to user's profile picture
 * @property {Date} dateJoined - Date when user joined the platform
 * @property {UserPreferences} preferences - User's app preferences
 * @property {UserStats} stats - User's fitness statistics
 */

/**
 * @typedef {Object} UserPreferences
 * @property {'metric'|'imperial'} measurementUnit - User's preferred measurement unit
 * @property {'light'|'dark'|'system'} theme - User's preferred theme
 * @property {boolean} emailNotifications - Whether user wants email notifications
 * @property {boolean} pushNotifications - Whether user wants push notifications
 * @property {string[]} favoriteActivities - User's favorite activity types
 */

/**
 * @typedef {Object} UserStats
 * @property {number} totalWorkouts - Total number of workouts completed
 * @property {number} totalDistance - Total distance covered (in km or miles)
 * @property {number} totalDuration - Total workout time (in minutes)
 * @property {number} totalCaloriesBurned - Total calories burned
 * @property {number} currentStreak - Current streak of consecutive days with activity
 * @property {number} longestStreak - Longest streak of consecutive days with activity
 */

/**
 * @typedef {Object} ConnectedDevice
 * @property {string} id - Unique device identifier
 * @property {string} name - Device name
 * @property {string} type - Device type (e.g., 'smartwatch', 'heartRateMonitor')
 * @property {string} brand - Device brand name
 * @property {Date} lastSynced - When the device was last synced
 * @property {boolean} isActive - Whether the device is currently active
 */

export const userTypes = {};  // Empty export to satisfy module structure