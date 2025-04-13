// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   data: [],
//   status: 'idle',
//   error: null,
// };

// export const trendsSlice = createSlice({
//   name: 'trends',
//   initialState,
//   reducers: {
//     setTrendsData: (state, action) => {
//       state.data = action.payload;
//     },
//     addTrendData: (state, action) => {
//       state.data.push(action.payload);
//     },
//     clearTrendsData: (state) => {
//       state.data = [];
//     },
//     setTrendsStatus: (state, action) => {
//       state.status = action.payload;
//     },
//     setTrendsError: (state, action) => {
//       state.error = action.payload;
//     }
//   }
//   // Add extraReducers for async thunks if needed
// });

// export const { 
//   setTrendsData, 
//   addTrendData, 
//   clearTrendsData,
//   setTrendsStatus,
//   setTrendsError
// } = trendsSlice.actions;

// export default trendsSlice.reducer;