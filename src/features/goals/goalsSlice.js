import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeGoals: [],
  recentAchievements: [],
  currentStreak: 0,
  longestStreak: 14,
  weeklyCompletion: { completed: 6, total: 10 },
  dailyCompletion: { percent: 60 },
  status: 'idle',
  error: null,
};

export const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state.activeGoals = action.payload;
    },
    addGoal: (state, action) => {
      state.activeGoals.push(action.payload);
    },
    updateGoal: (state, action) => {
      const index = state.activeGoals.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        state.activeGoals[index] = action.payload;
      }
    },
    removeGoal: (state, action) => {
      state.activeGoals = state.activeGoals.filter(goal => goal.id !== action.payload);
    },
    setAchievements: (state, action) => {
      state.recentAchievements = action.payload;
    },
    addAchievement: (state, action) => {
      state.recentAchievements.unshift(action.payload);
    },
    updateStreak: (state, action) => {
      state.currentStreak = action.payload;
      if (action.payload > state.longestStreak) {
        state.longestStreak = action.payload;
      }
    },
    updateWeeklyCompletion: (state, action) => {
      state.weeklyCompletion = action.payload;
    },
    updateDailyCompletion: (state, action) => {
      state.dailyCompletion = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setGoals, 
  addGoal, 
  updateGoal, 
  removeGoal, 
  setAchievements,
  addAchievement,
  updateStreak,
  updateWeeklyCompletion,
  updateDailyCompletion,
  setStatus, 
  setError 
} = goalsSlice.actions;

// Selectors
export const selectAllGoals = (state) => state.goals.activeGoals;
export const selectGoalsByCategory = (state, category) => 
  category === 'all' 
    ? state.goals.activeGoals 
    : state.goals.activeGoals.filter(goal => goal.category === category);
export const selectRecentAchievements = (state) => state.goals.recentAchievements;
export const selectCurrentStreak = (state) => state.goals.currentStreak;
export const selectLongestStreak = (state) => state.goals.longestStreak;
export const selectWeeklyCompletion = (state) => state.goals.weeklyCompletion;
export const selectDailyCompletion = (state) => state.goals.dailyCompletion;
export const selectGoalsStatus = (state) => state.goals.status;
export const selectGoalsError = (state) => state.goals.error;

export default goalsSlice.reducer;