import { configureStore } from '@reduxjs/toolkit';
// Import slice reducers here as they are created
import dashboardReducer from '../features/dashboard/dashboardSlice';


export const store = configureStore({
  reducer: {
    // Add reducers here
    dashboard: dashboardReducer,
  
  },
});
