import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Sparkles, Zap, Target, ArrowUpRight, 
  Plus, TrendingUp, Calendar, MoreHorizontal 
} from 'lucide-react';

import GoalCard from './GoalCard';
import GoalProgressOrb from './GoalProgressOrb';
import GoalTimeline from './GoalTimeline';
import GoalCategoryTabs from './GoalCategoryTabs';
import { Button } from '../../../components/ui/button';

const GoalsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Sample data - in a real app this would come from your Redux store
  const goals = [
    {
      id: 1,
      title: 'Daily Steps',
      category: 'activity',
      icon: <Zap className="h-5 w-5" />,
      current: 8436,
      target: 10000,
      unit: 'steps',
      streakDays: 7,
      remainingToday: 1564,
      progress: 84,
      color: 'from-indigo-500 to-blue-500',
      gradientBg: 'from-indigo-500/20 to-blue-500/10'
    },
    {
      id: 2,
      title: 'Calories Burned',
      category: 'nutrition',
      icon: <Trophy className="h-5 w-5" />,
      current: 520,
      target: 500,
      unit: 'kcal',
      streakDays: 4,
      remainingToday: 0,
      progress: 100,
      color: 'from-emerald-500 to-green-500',
      gradientBg: 'from-emerald-500/20 to-green-500/10'
    },
    {
      id: 3,
      title: 'Active Minutes',
      category: 'activity',
      icon: <Target className="h-5 w-5" />,
      current: 42,
      target: 60,
      unit: 'mins',
      streakDays: 2,
      remainingToday: 18,
      progress: 70,
      color: 'from-cyan-500 to-blue-500',
      gradientBg: 'from-cyan-500/20 to-blue-500/10'
    },
    {
      id: 4,
      title: 'Sleep Duration',
      category: 'sleep',
      icon: <Calendar className="h-5 w-5" />,
      current: 6.5,
      target: 8,
      unit: 'hours',
      streakDays: 0,
      remainingToday: 1.5,
      progress: 81,
      color: 'from-purple-500 to-violet-500',
      gradientBg: 'from-purple-500/20 to-violet-500/10'
    },
    {
      id: 5,
      title: 'Weekly Workouts',
      category: 'workout',
      icon: <TrendingUp className="h-5 w-5" />,
      current: 3,
      target: 4,
      unit: 'sessions',
      streakDays: 3,
      remainingToday: 1,
      progress: 75,
      color: 'from-blue-500 to-indigo-500',
      gradientBg: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      id: 6,
      title: 'Daily Water',
      category: 'nutrition',
      icon: <Sparkles className="h-5 w-5" />,
      current: 2400,
      target: 2500,
      unit: 'ml',
      streakDays: 5,
      remainingToday: 100,
      progress: 96,
      color: 'from-sky-500 to-cyan-500',
      gradientBg: 'from-sky-500/20 to-cyan-500/10'
    },
  ];
  
  // Filter goals by active category
  const filteredGoals = activeCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === activeCategory);
  
  // Calculate overall progress
  const overallProgress = goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length;
  
  // Calculate longest streak
  const longestStreak = Math.max(...goals.map(goal => goal.streakDays));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section with Overview and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
            Goal Tracking
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your fitness journey with dynamic goals
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Summary and Progress Orb */}
        <div className="lg:col-span-4 space-y-6">
          {/* Overall Progress Orb */}
          <motion.div 
            className="relative bg-gradient-to-br from-violet-600/10 to-fuchsia-500/5 backdrop-blur-3xl rounded-xl p-6 border border-white/10 dark:border-white/5 shadow-xl shadow-violet-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 rounded-xl mix-blend-overlay"></div>
            <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Goals Progress</h2>
            
            <div className="flex justify-center">
              <GoalProgressOrb progress={overallProgress} />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">Today</p>
                <div className="flex items-center gap-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">60%</h3>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <div className="bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">This Week</p>
                <div className="flex items-center gap-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">6/10</h3>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-lg p-3">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Longest Streak</p>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>
              </div>
              <div className="flex items-end gap-1 mt-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{longestStreak} days</h3>
                <span className="text-xs text-gray-500 mb-1">🔥</span>
              </div>
            </div>
          </motion.div>
          
          {/* Achievement Timeline */}
          <motion.div 
            className="bg-gradient-to-br from-violet-600/10 to-fuchsia-500/5 backdrop-blur-3xl rounded-xl p-6 border border-white/10 dark:border-white/5 shadow-xl shadow-violet-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 rounded-xl mix-blend-overlay"></div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Recent Achievements</h2>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <GoalTimeline />
          </motion.div>
        </div>
        
        {/* Right Column - Goals Grid */}
        <div className="lg:col-span-8">
          {/* Goal Category Tabs */}
          <GoalCategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          
          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <AnimatePresence mode="popLayout">
              {filteredGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GoalCard goal={goal} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;