/**
 * Goal Types for FitDash App
 */

/**
 * @typedef {Object} Goal
 * @property {string} id - Unique goal identifier
 * @property {string} userId - ID of user who set the goal
 * @property {string} title - Goal title or description
 * @property {string} type - Goal type (distance, duration, calories, etc.)
 * @property {number} target - Target value to achieve
 * @property {string} unit - Unit of measurement (km, miles, minutes, etc.)
 * @property {Date} startDate - When the goal tracking started
 * @property {Date} targetDate - Target date to achieve the goal
 * @property {number} currentProgress - Current progress toward the goal
 * @property {boolean} isCompleted - Whether the goal has been completed
 * @property {Date} [completedDate] - When the goal was completed
 * @property {string} [activityType] - Specific activity type for the goal if applicable
 * @property {boolean} isRecurring - Whether the goal recurs (e.g., weekly)
 * @property {string} [recurringPeriod] - Period for recurring goals (daily, weekly, monthly)
 */

/**
 * @typedef {Object} GoalProgress
 * @property {string} goalId - ID of the goal
 * @property {Date} date - Date of the progress entry
 * @property {number} value - Progress value achieved
 * @property {Activity[]} contributingActivities - Activities that contributed to this progress
 */

/**
 * @typedef {Object} GoalAchievement
 * @property {string} id - Unique achievement identifier
 * @property {string} goalId - ID of the completed goal
 * @property {Date} dateAchieved - Date when the goal was achieved
 * @property {boolean} isHighlighted - Whether this achievement is highlighted
 * @property {string} [motivationalMessage] - Motivational message for the achievement
 */

export const goalTypes = {};  // Empty export to satisfy module structure