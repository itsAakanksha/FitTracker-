import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Bike, Waves, Footprints, Dumbbell, Flower, Mountain, 
         FilterX, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const ActivityFilterControls = ({ activeFilters, onFilterChange }) => {
  // Activity types with their corresponding icons
  const activityTypes = [
    { id: 'all', label: 'All', icon: null },
    { id: 'Running', label: 'Running', icon: Activity },
    { id: 'Cycling', label: 'Cycling', icon: Bike },
    { id: 'Swimming', label: 'Swimming', icon: Waves },
    { id: 'Walking', label: 'Walking', icon: Footprints },
    { id: 'Gym Workout', label: 'Gym', icon: Dumbbell },
    { id: 'Yoga', label: 'Yoga', icon: Flower },
    { id: 'Hiking', label: 'Hiking', icon: Mountain },
    { id: 'Badminton', label: 'Badminton', icon: Calendar },
  ];

  // Date range options
  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'year', label: 'Last Year' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handleActivityTypeChange = (type) => {
    onFilterChange({ activityType: type });
  };

  const handleDateRangeChange = (range) => {
    onFilterChange({ dateRange: range });
  };

  const resetFilters = () => {
    onFilterChange({ 
      activityType: 'all',
      dateRange: 'all',
      searchQuery: ''
    });
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Activity Type Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <Dumbbell className="h-4 w-4 mr-2 text-violet-500" />
          Activity Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => {
            const isActive = activeFilters.activityType === type.id;
            const IconComponent = type.icon;

            return (
              <motion.button
                key={type.id}
                onClick={() => handleActivityTypeChange(type.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors
                  ${isActive 
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-700'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                variants={itemVariants}
              >
                {IconComponent && <IconComponent className={`h-4 w-4 ${isActive ? 'text-violet-500' : 'text-gray-500 dark:text-gray-500'}`} />}
                {type.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Date Range Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-violet-500" />
          Time Period
        </h3>
        <div className="flex flex-wrap gap-2">
          {dateRanges.map((range) => {
            const isActive = activeFilters.dateRange === range.id;

            return (
              <motion.button
                key={range.id}
                onClick={() => handleDateRangeChange(range.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-700'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                variants={itemVariants}
              >
                {range.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Reset Filters Button */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={resetFilters}
        >
          <FilterX className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </motion.div>
  );
};

export default ActivityFilterControls;