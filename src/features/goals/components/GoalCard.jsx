import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';

// Custom circular progress component with gradient
const CircularProgress = ({ value, size = 80, trackWidth = 5, trackColor = "rgba(255,255,255,0.2)", indicatorWidth, indicatorColor, children }) => {
  const center = size / 2;
  const radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {/* Background track */}
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-100 dark:text-gray-800"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={trackWidth}
        />
      </svg>

      {/* Progress indicator */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`gradient-${value}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--start-color, #6366f1)" />
            <stop offset="100%" stopColor="var(--end-color, #4f46e5)" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={indicatorColor || `url(#gradient-${value})`}
          strokeWidth={indicatorWidth || trackWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const GoalCard = ({ goal }) => {
  // Calculate properties based on goal progress
  const isCompleted = goal.progress >= 100;
  const isNearCompletion = goal.progress >= 90 && goal.progress < 100;
  const dynamicColorStyle = {
    '--start-color': getStartColor(goal.progress),
    '--end-color': getEndColor(goal.progress)
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={dynamicColorStyle}
    >
      {/* Card container with glassmorphism */}
      <div className={`relative bg-gradient-to-br ${goal.gradientBg} backdrop-blur-3xl rounded-xl p-5 h-full border border-white/10 dark:border-white/5 shadow-lg overflow-hidden`}>
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay"></div>
        
        {/* Glow effect based on progress */}
        {isNearCompletion && (
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-yellow-500/30 dark:bg-yellow-500/20 rounded-full blur-3xl"></div>
        )}
        
        {isCompleted && (
          <div className="absolute -left-5 -top-5 w-40 h-40 bg-emerald-500/30 dark:bg-emerald-500/20 rounded-full blur-3xl"></div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${goal.color} text-white mr-3`}>
                {goal.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{goal.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Daily Goal</p>
              </div>
            </div>
            {goal.streakDays > 0 && (
              <div className="flex items-center px-2 py-1 bg-amber-500/10 rounded-full">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{goal.streakDays} day streak</span>
                <span className="ml-1">🔥</span>
              </div>
            )}
          </div>
          
          {/* Progress visualization */}
          <div className="flex justify-between items-center">
            <CircularProgress 
              value={goal.progress} 
              size={90}
              trackWidth={6}
              indicatorWidth={8}
              indicatorColor={`url(#gradient-${goal.progress})`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {goal.current}
                </span>
                <span className="text-xs text-gray-500">{goal.unit}</span>
              </div>
            </CircularProgress>
            
            <div className="flex-1 ml-5">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Progress</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{goal.progress}%</span>
              </div>
              
              {/* Custom Progress Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700/30 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${goal.color}`}
                  style={{ width: `${goal.progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              {isCompleted ? (
                <div className="mt-3 flex items-center text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Goal completed!</span>
                </div>
              ) : (
                <p className="text-xs mt-2 text-gray-500">
                  {goal.remainingToday} {goal.unit} to go today
                </p>
              )}
            </div>
          </div>
          
          {/* Action button */}
          <div className="mt-5">
            <Button 
              variant="ghost" 
              className="w-full justify-between border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10"
            >
              View Details
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions to create dynamic colors based on progress
const getStartColor = (progress) => {
  if (progress >= 100) return '#10b981'; // Emerald for completed
  if (progress >= 90) return '#f59e0b'; // Amber for nearly complete
  if (progress >= 50) return '#3b82f6'; // Blue for halfway
  return '#6366f1'; // Indigo for just started
};

const getEndColor = (progress) => {
  if (progress >= 100) return '#059669'; // Green for completed
  if (progress >= 90) return '#d97706'; // Darker amber for nearly complete
  if (progress >= 50) return '#2563eb'; // Darker blue for halfway
  return '#4f46e5'; // Darker indigo for just started
};

export default GoalCard;