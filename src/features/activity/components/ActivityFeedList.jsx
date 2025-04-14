import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Info } from 'lucide-react';
import ActivityListItem from './ActivityListItem';

// Mock data generator for activities
const generateMockActivities = () => {
  const activityTypes = [
    { type: 'Running', icon: 'running' },
    { type: 'Cycling', icon: 'cycling' },
    { type: 'Swimming', icon: 'swimming' },
    { type: 'Walking', icon: 'walking' },
    { type: 'Gym Workout', icon: 'gym' },
    { type: 'Yoga', icon: 'yoga' },
    { type: 'Hiking', icon: 'hiking' },
    { type: 'Badminton', icon: 'badminton' },
    { type: 'Cricket', icon: 'cricket' }
  ];

  const today = new Date();
  const activities = [];

  // Generate activities for the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Random number of activities per day (0 to 3)
    const activitiesPerDay = Math.floor(Math.random() * 3);
    
    for (let j = 0; j < activitiesPerDay; j++) {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      // Create random timestamps within the day
      const hours = Math.floor(Math.random() * 16) + 6; // Between 6AM and 10PM
      const minutes = Math.floor(Math.random() * 60);
      date.setHours(hours, minutes);

      // Generate random metrics based on activity type
      let distance, duration, calories, avgHr, pace;
      
      switch (activityType.type) {
        case 'Running':
          distance = parseFloat((Math.random() * 10 + 2).toFixed(2)); // 2-12 km
          duration = Math.floor(Math.random() * 60 + 20); // 20-80 minutes
          pace = parseFloat((duration / distance).toFixed(2)); // min/km
          calories = Math.floor(distance * 60 + Math.random() * 100); // calories
          avgHr = Math.floor(Math.random() * 40 + 140); // 140-180 bpm
          break;
        case 'Cycling':
          distance = parseFloat((Math.random() * 30 + 5).toFixed(2)); // 5-35 km
          duration = Math.floor(Math.random() * 90 + 30); // 30-120 minutes
          pace = parseFloat((60 / (distance / duration)).toFixed(2)); // km/h
          calories = Math.floor(distance * 30 + Math.random() * 100); // calories
          avgHr = Math.floor(Math.random() * 30 + 130); // 130-160 bpm
          break;
        case 'Swimming':
          distance = parseFloat((Math.random() * 2 + 0.5).toFixed(2)); // 0.5-2.5 km
          duration = Math.floor(Math.random() * 45 + 15); // 15-60 minutes
          calories = Math.floor(distance * 300 + Math.random() * 100); // calories
          avgHr = Math.floor(Math.random() * 30 + 120); // 120-150 bpm
          pace = null; // No pace for swimming
          break;
        default:
          distance = parseFloat((Math.random() * 5 + 1).toFixed(2)); // 1-6 km
          duration = Math.floor(Math.random() * 60 + 20); // 20-80 minutes
          pace = null; // No pace for other activities
          calories = Math.floor(Math.random() * 300 + 100); // 100-400 calories
          avgHr = Math.floor(Math.random() * 50 + 100); // 100-150 bpm
      }
      
      // Create the activity object
      activities.push({
        id: `activity-${i}-${j}`,
        type: activityType.type,
        icon: activityType.icon,
        title: `${activityType.type} ${j === 0 ? 'Workout' : j === 1 ? 'Session' : 'Training'}`,
        date: date.toISOString(),
        distance: distance,
        duration: duration,
        calories: calories,
        avgHeartRate: avgHr,
        pace: pace,
        hasRoute: ['Running', 'Cycling', 'Walking', 'Hiking'].includes(activityType.type),
        hasPersonalBest: Math.random() > 0.8, // 20% chance for personal best
      });
    }
  }
  
  // Sort by date (newest first)
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Group activities by date for better visual organization
const groupActivitiesByDate = (activities) => {
  return activities.reduce((groups, activity) => {
    const date = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(activity);
    return groups;
  }, {});
};

const ActivityFeedList = ({ filters, onActivitySelect }) => {
  // In a real app, this would fetch from an API or Redux store with proper filtering
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(15);
  
  useEffect(() => {
    // Simulate API call delay
    setLoading(true);
    const timer = setTimeout(() => {
      const allActivities = generateMockActivities();
      let filteredActivities = [...allActivities];
      
      // Apply filters
      if (filters) {
        // Filter by activity type
        if (filters.activityType && filters.activityType !== 'all') {
          filteredActivities = filteredActivities.filter(a => a.type === filters.activityType);
        }
        
        // Filter by date range
        if (filters.dateRange && filters.dateRange !== 'all') {
          const today = new Date();
          let startDate;
          
          switch (filters.dateRange) {
            case 'week':
              startDate = new Date();
              startDate.setDate(today.getDate() - 7);
              break;
            case 'month':
              startDate = new Date();
              startDate.setMonth(today.getMonth() - 1);
              break;
            case 'year':
              startDate = new Date();
              startDate.setFullYear(today.getFullYear() - 1);
              break;
            default:
              startDate = null;
          }
          
          if (startDate) {
            filteredActivities = filteredActivities.filter(a => new Date(a.date) >= startDate);
          }
        }
        
        // Filter by search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredActivities = filteredActivities.filter(a => 
            a.title.toLowerCase().includes(query) || 
            a.type.toLowerCase().includes(query)
          );
        }
      }
      
      setActivities(filteredActivities);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters]);

  // Handle infinite scroll (simplified version)
  const handleScroll = () => {
    // Check if user scrolled near the bottom of the list
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      setDisplayLimit(prev => prev + 10);
    }
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Group activities by date
  const groupedActivities = groupActivitiesByDate(activities.slice(0, displayLimit));
  
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
  
  const dateHeaderVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-t-violet-500 border-violet-200 rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your activities...</p>
        </div>
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/40 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full">
            <Info className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Activities Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            We couldn't find any activities matching your filters. Try adjusting your search parameters or log a new activity.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Object.entries(groupedActivities).map(([date, dayActivities]) => (
        <div key={date} className="space-y-4">
          <motion.div 
            className="flex items-center gap-2 pl-1" 
            variants={dateHeaderVariants}
          >
            <Calendar className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{date}</h3>
          </motion.div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {dayActivities.map((activity) => (
                <ActivityListItem 
                  key={activity.id} 
                  activity={activity} 
                  onActivitySelect={onActivitySelect}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
      
      {/* Display loader at the bottom when loading more */}
      {displayLimit < activities.length && (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 border-4 border-t-violet-500 border-violet-200 rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityFeedList;