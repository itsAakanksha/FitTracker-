import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Moon, Dumbbell, Apple, LayoutDashboard } from 'lucide-react';

const GoalCategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'all', label: 'All Goals', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="h-4 w-4" /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Apple className="h-4 w-4" /> },
    { id: 'workout', label: 'Workout', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'sleep', label: 'Sleep', icon: <Moon className="h-4 w-4" /> },
    { id: 'health', label: 'Health', icon: <Heart className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-lg p-1 overflow-x-auto">
      <div className="flex space-x-1 min-w-max">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`relative flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              <span className="relative flex items-center mr-2">{category.icon}</span>
              <span className="relative">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalCategoryTabs;