import { createSlice } from '@reduxjs/toolkit';

// --- Placeholder Data ---
const initialCoreMetrics = [
  { id: 'steps', title: 'Steps', value: 8436, goal: 10000, color: 'text-blue-500', progressColor: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { id: 'calories', title: 'Calories Burned', value: 200, goal: 500, color: 'text-orange-500', progressColor: 'bg-gradient-to-r from-orange-400 to-orange-600' },
  { id: 'activeMinutes', title: 'Active Minutes', value: 10, goal: 60, color: 'text-green-500', progressColor: 'bg-gradient-to-r from-green-400 to-green-600' },
];

const initialWeeklyActivity = [
  { name: 'Mon', Steps: 7500, Calories: 320, ActiveMinutes: 35 },
  { name: 'Tue', Steps: 9200, Calories: 410, ActiveMinutes: 50 },
  { name: 'Wed', Steps: 8100, Calories: 380, ActiveMinutes: 40 },
  { name: 'Thu', Steps: 10500, Calories: 480, ActiveMinutes: 60 },
  { name: 'Fri', Steps: 7800, Calories: 350, ActiveMinutes: 38 },
  { name: 'Sat', Steps̥: 12100, Calories: 550, ActiveMinutes: 75 },
  { name: 'Sun', Steps: 6900, Calories: 300, ActiveMinutes: 30 },
];

const initialFitnessInsights = [
  { id: 'endurance', title: 'Improved Endurance', description: 'Your resting heart rate has decreased by 5% this month.', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/50' },
  { id: 'consistency', title: 'Consistency Increase', description: 'Your weekly active minutes have steadily increased by 15%.', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/50' },
  { id: 'mindful', title: 'Mindful Moment Needed?', description: 'Activity levels high, consider a mindfulness session.', color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/50' },
  { id: 'peak', title: 'Performance Peak', description: 'You hit a new personal best for your 5k run this week!', color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/50' },
];

const initialTopSummary = [
  { id: 'hr', title: 'Heart Rate', value: '72', unit: 'bpm', color: 'text-red-500' },
  { id: 'sleep', title: 'Sleep', value: '7h 22m', unit: '', color: 'text-indigo-500' },
  { id: 'hyd', title: 'Hydration', value: '86', unit: '%', color: 'text-blue-500' },
];

const initialWeeklySummary = {
  avgSteps: 8742,
  avgCalories: 412,
  avgActiveMinutes: 42,
  progressVsLastWeek: 12,
};

const initialRecommendations = [
  { id: 'rec1', title: 'Fitness for Beginner', level: 'Beginner', time: '8:00 AM - 9:00 AM', duration: '60 Min' },
  { id: 'rec2', title: 'Beginner to Advance Gym', level: 'Intermediate', time: '9:00 AM - 10:00 AM', duration: '60 Min' },
  { id: 'rec3', title: 'Ultimate Body Workout', level: 'Advanced', time: '7:00 AM - 8:00 AM', duration: '60 Min' },
];

const initialTrainers = [
  { id: 'tr1', name: 'John Arnold', specialization: 'Weight Loss', imgSrc: 'https://placehold.co/100x100/6366f1/ffffff?text=JA&font=sans' },
  { id: 'tr2', name: 'Kathryn Murphy', specialization: 'Muscle Gain', imgSrc: 'https://placehold.co/100x100/ec4899/ffffff?text=KM&font=sans' },
  { id: 'tr3', name: 'Henry Johnson', specialization: 'Cardio Expert', imgSrc: 'https://placehold.co/100x100/22c55e/ffffff?text=HJ&font=sans' },
];

const initialRecentActivity = [
  { id: 'act1', type: 'Morning Run', value: '3.2 miles', detail: '45 min', status: null },
  { id: 'act2', type: '10,000 Steps', value: 'Goal completed', detail: 'Daily Goal', status: 'Completed' },
  { id: 'act3', type: 'Calories Burned', value: '1,842 kcal', detail: 'Daily Total', status: null },
  { id: 'act4', type: 'Sleep tracking', value: '7h 22m', detail: 'Last night', status: null },
];
const initialStatus = 'idle'; // Initial status for loading state
// --- Initial State ---
const initialState = {
  topSummary: initialTopSummary,
  coreMetrics: initialCoreMetrics,
  weeklyActivity: initialWeeklyActivity,
  weeklySummary: initialWeeklySummary,
  fitnessInsights: initialFitnessInsights,
  recommendations: initialRecommendations,
  trainers: initialTrainers,
  recentActivity: initialRecentActivity,
  status: initialStatus,
};

// --- Slice Definition ---
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Synchronous reducers can go here if needed in the future
  },
});

// --- Selectors ---
export const selectTopSummary = (state) => state.dashboard.topSummary;
export const selectCoreMetrics = (state) => state.dashboard.coreMetrics;
export const selectWeeklyActivity = (state) => state.dashboard.weeklyActivity;
export const selectWeeklySummary = (state) => state.dashboard.weeklySummary;
export const selectFitnessInsights = (state) => state.dashboard.fitnessInsights;
export const selectRecommendations = (state) => state.dashboard.recommendations;
export const selectTrainers = (state) => state.dashboard.trainers;
export const selectRecentActivity = (state) => state.dashboard.recentActivity;
export const selectStatus = (state) => state.dashboard.status;

// --- Export Reducer ---
export default dashboardSlice.reducer;