/**
 * Activity Types for FitDash App
 */

/**
 * @typedef {Object} Activity
 * @property {string} id - Unique activity identifier
 * @property {string} userId - ID of user who performed the activity
 * @property {string} type - Activity type (running, cycling, etc.)
 * @property {Date} startTime - When the activity started
 * @property {Date} endTime - When the activity ended
 * @property {number} duration - Activity duration in minutes
 * @property {number} distance - Distance covered (in km or miles)
 * @property {number} caloriesBurned - Estimated calories burned
 * @property {number} [averageHeartRate] - Average heart rate during activity
 * @property {number} [maxHeartRate] - Maximum heart rate during activity
 * @property {Route} [route] - GPS route data if available
 * @property {string} [notes] - User notes about the activity
 * @property {string[]} [tags] - Tags associated with the activity
 * @property {boolean} [isManualEntry] - Whether activity was manually entered
 */

/**
 * @typedef {Object} Route
 * @property {Array<{lat: number, lng: number, elevation: number, timestamp: Date}>} points - GPS data points
 * @property {number} totalElevationGain - Total elevation gained in meters/feet
 * @property {number} totalElevationLoss - Total elevation lost in meters/feet
 * @property {number} highestPoint - Highest elevation point in meters/feet
 * @property {number} lowestPoint - Lowest elevation point in meters/feet
 */

/**
 * @typedef {Object} ActivitySummary
 * @property {string} period - Time period (day, week, month, year)
 * @property {Date} startDate - Start date of the summary period
 * @property {Date} endDate - End date of the summary period
 * @property {number} totalActivities - Total number of activities in period
 * @property {number} totalDuration - Total activity duration in minutes
 * @property {number} totalDistance - Total distance covered
 * @property {number} totalCaloriesBurned - Total calories burned
 * @property {Object<string, number>} activityBreakdown - Count of each activity type
 * @property {Activity} [bestActivity] - Activity with best performance metrics
 */

export const activityTypes = {};  // Empty export to satisfy module structure