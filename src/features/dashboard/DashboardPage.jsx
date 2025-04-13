
//==================================================
// src/features/dashboard/DashboardPage.jsx (Container - Already JS)
//==================================================
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { fetchDashboardData, selectDashboardStatus, selectDashboardError } from './dashboardSlice';
import TopSummarySection from './components/TopSummarySection';
import CoreMetricsSection from './components/CoreMetricsSection';
import WeeklyActivitySection from './components/WeeklyActivitySection';
import FitnessInsightsSection from './components/FitnessInsightsSection';
import RecommendationsSection from './components/RecommendationsSection';
import PersonalTrainersSection from './components/PersonalTrainersSection';
import RecentActivitySection from './components/RecentActivitySection'; // Corrected import name
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorDisplay from '../../components/shared/ErrorDisplay';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useSelector } from 'react-redux';

function DashboardPage() {


  // Animation variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Stagger animation of child components
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };



  // Render content when data fetching succeeded
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Apply item animation variant to each section */}
      <motion.div variants={itemVariants}><TopSummarySection /></motion.div>
      <motion.div variants={itemVariants}><CoreMetricsSection /></motion.div>
      {/* Prioritize AI Insights - Moved higher */}
      <motion.div variants={itemVariants}><FitnessInsightsSection /></motion.div>
      <motion.div variants={itemVariants}><WeeklyActivitySection /></motion.div>
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecommendationsSection />
          </div>
          <div>
            <PersonalTrainersSection />
          </div>
        </div>
      </motion.div>
      <motion.div variants={itemVariants}><RecentActivitySection /></motion.div>
    </motion.div>
  );
}

export default DashboardPage;

