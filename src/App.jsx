import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Outlet } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import ScrollToTop from './components/shared/ScrollToTop';
import DashboardPage from './features/dashboard/DashboardPage';
import GoalsPage from './features/goals/components/GoalsPage';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import TrendsPage from './features/trends/components/TrendsPage';
import ActivityPage from './features/activity/ActivityPage';

// Layout component that includes the sidebar and header
const AppLayout = () => {
  // State to control sidebar visibility, especially on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#101014] text-gray-900 dark:text-gray-100">
      {/* ScrollToTop component to handle scrolling on route changes */}
      <ScrollToTop />
      
      {/* Pass state and setter to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass toggle function and state to Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-[#101014] p-4 md:p-6">
          <Outlet /> {/* This is where the route content will be rendered */}
        </main>
      </div>
    </div>
  );
};

// Create router with routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/trends" element={<TrendsPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      {/* Add more routes here as needed */}
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;