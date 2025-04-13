import React from 'react';
import { motion } from 'framer-motion';

const CalendarActivityHeatmap = ({ data, metric, colorScheme }) => {
  // Process data for calendar view
  const processCalendarData = () => {
    // Get the most recent month of data
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Create a date for the first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Calculate the starting day of the week (0 = Sunday, 1 = Monday, etc.)
    const startOffset = firstDayOfMonth.getDay();
    
    // Total days in grid (max 6 rows of 7 days)
    const totalDaysInGrid = 7 * 6;
    
    // Create the grid
    const grid = Array(totalDaysInGrid).fill(null);
    
    // Fill in actual days
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Create a map of data by date
    const dataByDate = {};
    data.forEach(item => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      dataByDate[key] = item.value;
    });
    
    // Fill the grid with day data
    for (let i = 0; i < daysInMonth; i++) {
      const day = i + 1;
      const date = new Date(currentYear, currentMonth, day);
      const gridIndex = startOffset + i;
      
      if (gridIndex < totalDaysInGrid) {
        // Look up this date in our data
        const key = `${currentYear}-${currentMonth}-${day}`;
        const value = dataByDate[key] || 0;
        
        grid[gridIndex] = {
          date,
          day,
          value
        };
      }
    }
    
    return {
      grid,
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };
  };
  
  const { grid, weekdays } = processCalendarData();
  
  // Find the min and max values to determine intensity
  const values = grid.filter(cell => cell !== null).map(cell => cell.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;
  
  // Calculate the intensity for a value (0 to 1)
  const getIntensity = (value) => {
    if (!value && value !== 0) return 0;
    const normalizedValue = (value - minValue) / (range || 1);
    return Math.max(0.1, Math.min(1, normalizedValue)); // Ensure value is between 0.1 and 1
  };
  
  // Get appropriate cell color based on value intensity
  const getCellColor = (cell) => {
    if (!cell) return 'bg-gray-100 dark:bg-gray-800';
    
    const intensity = getIntensity(cell.value);
    const baseColor = colorScheme.main.replace('#', '');
    
    if (intensity <= 0.1) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity <= 0.3) return `bg-${colorScheme.main.split('#')[1]}-50 dark:bg-${colorScheme.main.split('#')[1]}-900/30`;
    if (intensity <= 0.5) return `bg-${colorScheme.main.split('#')[1]}-100 dark:bg-${colorScheme.main.split('#')[1]}-900/50`;
    if (intensity <= 0.7) return `bg-${colorScheme.main.split('#')[1]}-200 dark:bg-${colorScheme.main.split('#')[1]}-800/70`;
    if (intensity <= 0.9) return `bg-${colorScheme.main.split('#')[1]}-300 dark:bg-${colorScheme.main.split('#')[1]}-700`;
    return `bg-${colorScheme.main.split('#')[1]}-400 dark:bg-${colorScheme.main.split('#')[1]}-600`;
  };

  // Handle color for pre-defined schemas
  const getComputedColor = (cell) => {
    if (!cell) return 'bg-gray-100 dark:bg-gray-800';
    
    const intensity = getIntensity(cell.value);
    
    if (metric === 'steps') {
      if (intensity <= 0.1) return 'bg-gray-100 dark:bg-gray-800';
      if (intensity <= 0.3) return 'bg-blue-50 dark:bg-blue-900/30';
      if (intensity <= 0.5) return 'bg-blue-100 dark:bg-blue-900/50';
      if (intensity <= 0.7) return 'bg-blue-200 dark:bg-blue-800/70';
      if (intensity <= 0.9) return 'bg-blue-300 dark:bg-blue-700';
      return 'bg-blue-400 dark:bg-blue-600';
    }
    
    if (metric === 'calories') {
      if (intensity <= 0.1) return 'bg-gray-100 dark:bg-gray-800';
      if (intensity <= 0.3) return 'bg-red-50 dark:bg-red-900/30';
      if (intensity <= 0.5) return 'bg-red-100 dark:bg-red-900/50';
      if (intensity <= 0.7) return 'bg-red-200 dark:bg-red-800/70';
      if (intensity <= 0.9) return 'bg-red-300 dark:bg-red-700';
      return 'bg-red-400 dark:bg-red-600';
    }
    
    if (metric === 'active') {
      if (intensity <= 0.1) return 'bg-gray-100 dark:bg-gray-800';
      if (intensity <= 0.3) return 'bg-emerald-50 dark:bg-emerald-900/30';
      if (intensity <= 0.5) return 'bg-emerald-100 dark:bg-emerald-900/50';
      if (intensity <= 0.7) return 'bg-emerald-200 dark:bg-emerald-800/70';
      if (intensity <= 0.9) return 'bg-emerald-300 dark:bg-emerald-700';
      return 'bg-emerald-400 dark:bg-emerald-600';
    }
    
    if (metric === 'sleep') {
      if (intensity <= 0.1) return 'bg-gray-100 dark:bg-gray-800';
      if (intensity <= 0.3) return 'bg-purple-50 dark:bg-purple-900/30';
      if (intensity <= 0.5) return 'bg-purple-100 dark:bg-purple-900/50';
      if (intensity <= 0.7) return 'bg-purple-200 dark:bg-purple-800/70';
      if (intensity <= 0.9) return 'bg-purple-300 dark:bg-purple-700';
      return 'bg-purple-400 dark:bg-purple-600';
    }
    
    if (metric === 'heart') {
      if (intensity <= 0.1) return 'bg-gray-100 dark:bg-gray-800';
      if (intensity <= 0.3) return 'bg-orange-50 dark:bg-orange-900/30';
      if (intensity <= 0.5) return 'bg-orange-100 dark:bg-orange-900/50';
      if (intensity <= 0.7) return 'bg-orange-200 dark:bg-orange-800/70';
      if (intensity <= 0.9) return 'bg-orange-300 dark:bg-orange-700';
      return 'bg-orange-400 dark:bg-orange-600';
    }
    
    // Default color (indigo)
    if (intensity <= 0.1) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity <= 0.3) return 'bg-indigo-50 dark:bg-indigo-900/30';
    if (intensity <= 0.5) return 'bg-indigo-100 dark:bg-indigo-900/50';
    if (intensity <= 0.7) return 'bg-indigo-200 dark:bg-indigo-800/70';
    if (intensity <= 0.9) return 'bg-indigo-300 dark:bg-indigo-700';
    return 'bg-indigo-400 dark:bg-indigo-600';
  };
  
  // Format values for display
  const formatValue = (value, metric) => {
    if (!value && value !== 0) return '';
    
    switch (metric) {
      case 'steps': return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
      case 'calories': return value;
      case 'active': return `${value}m`;
      case 'sleep': return `${value}h`;
      case 'heart': return `${value}`;
      default: return value;
    }
  };

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((day, i) => (
          <div key={day} className="text-center text-xs text-gray-500">
            {day[0]}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.01, duration: 0.2 }}
            className={`relative aspect-square rounded-md flex items-center justify-center ${getComputedColor(cell)} overflow-hidden`}
          >
            {cell && (
              <>
                <span className="absolute top-1 left-1 text-[10px] text-gray-500 dark:text-gray-400">{cell.day}</span>
                <span className={`text-xs font-medium ${
                  getIntensity(cell.value) > 0.6 ? 'text-white/90' : 'text-gray-800 dark:text-gray-300'
                }`}>
                  {formatValue(cell.value, metric)}
                </span>
              </>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">Less</div>
        <div className="flex space-x-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9, 1].map((intensity) => (
            <div 
              key={intensity}
              className={`h-3 w-6 rounded ${
                metric === 'steps' ? 
                  intensity === 0.1 ? 'bg-gray-100 dark:bg-gray-800' :
                  intensity === 0.3 ? 'bg-blue-50 dark:bg-blue-900/30' :
                  intensity === 0.5 ? 'bg-blue-100 dark:bg-blue-900/50' :
                  intensity === 0.7 ? 'bg-blue-200 dark:bg-blue-800/70' :
                  intensity === 0.9 ? 'bg-blue-300 dark:bg-blue-700' :
                  'bg-blue-400 dark:bg-blue-600'
                : metric === 'calories' ?
                  intensity === 0.1 ? 'bg-gray-100 dark:bg-gray-800' :
                  intensity === 0.3 ? 'bg-red-50 dark:bg-red-900/30' :
                  intensity === 0.5 ? 'bg-red-100 dark:bg-red-900/50' :
                  intensity === 0.7 ? 'bg-red-200 dark:bg-red-800/70' :
                  intensity === 0.9 ? 'bg-red-300 dark:bg-red-700' :
                  'bg-red-400 dark:bg-red-600'
                : metric === 'active' ?
                  intensity === 0.1 ? 'bg-gray-100 dark:bg-gray-800' :
                  intensity === 0.3 ? 'bg-emerald-50 dark:bg-emerald-900/30' :
                  intensity === 0.5 ? 'bg-emerald-100 dark:bg-emerald-900/50' :
                  intensity === 0.7 ? 'bg-emerald-200 dark:bg-emerald-800/70' :
                  intensity === 0.9 ? 'bg-emerald-300 dark:bg-emerald-700' :
                  'bg-emerald-400 dark:bg-emerald-600'
                : metric === 'sleep' ?
                  intensity === 0.1 ? 'bg-gray-100 dark:bg-gray-800' :
                  intensity === 0.3 ? 'bg-purple-50 dark:bg-purple-900/30' :
                  intensity === 0.5 ? 'bg-purple-100 dark:bg-purple-900/50' :
                  intensity === 0.7 ? 'bg-purple-200 dark:bg-purple-800/70' :
                  intensity === 0.9 ? 'bg-purple-300 dark:bg-purple-700' :
                  'bg-purple-400 dark:bg-purple-600'
                : metric === 'heart' ?
                  intensity === 0.1 ? 'bg-gray-100 dark:bg-gray-800' :
                  intensity === 0.3 ? 'bg-orange-50 dark:bg-orange-900/30' :
                  intensity === 0.5 ? 'bg-orange-100 dark:bg-orange-900/50' :
                  intensity === 0.7 ? 'bg-orange-200 dark:bg-orange-800/70' :
                  intensity === 0.9 ? 'bg-orange-300 dark:bg-orange-700' :
                  'bg-orange-400 dark:bg-orange-600'
                : intensity === 0.1 ? 'bg-gray-100 dark:bg-gray-800' :
                  intensity === 0.3 ? 'bg-indigo-50 dark:bg-indigo-900/30' :
                  intensity === 0.5 ? 'bg-indigo-100 dark:bg-indigo-900/50' :
                  intensity === 0.7 ? 'bg-indigo-200 dark:bg-indigo-800/70' :
                  intensity === 0.9 ? 'bg-indigo-300 dark:bg-indigo-700' :
                  'bg-indigo-400 dark:bg-indigo-600'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500">More</div>
      </div>
    </div>
  );
};

export default CalendarActivityHeatmap;