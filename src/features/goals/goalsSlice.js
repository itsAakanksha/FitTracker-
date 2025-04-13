// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   activeGoals: [],
//   status: 'idle',
//   error: null,
// };

// export const goalsSlice = createSlice({
//   name: 'goals',
//   initialState,
//   reducers: {
//     setGoals: (state, action) => {
//       state.activeGoals = action.payload;
//     },
//     addGoal: (state, action) => {
//       state.activeGoals.push(action.payload);
//     },
//     updateGoal: (state, action) => {
//       const index = state.activeGoals.findIndex(goal => goal.id === action.payload.id);
//       if (index !== -1) {
//         state.activeGoals[index] = action.payload;
//       }
//     },
//     removeGoal: (state, action) => {
//       state.activeGoals = state.activeGoals.filter(goal => goal.id !== action.payload);
//     },
//     setStatus: (state, action) => {
//       state.status = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     }
//   }
// });

// export const { setGoals, addGoal, updateGoal, removeGoal, setStatus, setError } = goalsSlice.actions;

// export default goalsSlice.reducer;