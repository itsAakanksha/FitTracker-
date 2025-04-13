import React from 'react';
import Sidebar from './components/shared/Sidebar'; // Assuming shared layout components
import Header from './components/shared/Header';
import DashboardPage from './features/dashboard/DashboardPage';
// import TopSummarySection from './features/dashboard/components/TopSummarySection';
import './index.css';

function App() {
  return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
             <DashboardPage />
             {/* <TopSummarySection/> */}
          </main>
        </div>
      </div>
  );
}

export default App;