import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  Bike, 
  Waves,
  Footprints,
  Dumbbell, 
  Flower,
  Mountain, 
  Clock, 
  Flame, 
  Heart, 
  Award,
  MapPin,
  ArrowUpRight,
  Zap
} from 'lucide-react';

// Maps activity types to their corresponding icons and theme colors
const activityThemes = {
  'Running': { 
    icon: Activity, 
    color: 'emerald',
    gradient: 'from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  'Cycling': { 
    icon: Bike, 
    color: 'blue',
    gradient: 'from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  'Swimming': { 
    icon: Waves, 
    color: 'cyan',
    gradient: 'from-cyan-100 to-sky-100 dark:from-cyan-900/30 dark:to-sky-900/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400'
  },
  'Walking': { 
    icon: Footprints, 
    color: 'amber',
    gradient: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  'Gym Workout': { 
    icon: Dumbbell, 
    color: 'rose',
    gradient: 'from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400'
  },
  'Yoga': { 
    icon: Flower, 
    color: 'purple',
    gradient: 'from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  'Hiking': { 
    icon: Mountain, 
    color: 'lime',
    gradient: 'from-lime-100 to-green-100 dark:from-lime-900/30 dark:to-green-900/20',
    iconColor: 'text-lime-600 dark:text-lime-400'
  },
  'Badminton': { 
    icon: Award, 
    color: 'orange',
    gradient: 'from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400'
  },
  'Cricket': { 
    icon: Dumbbell, 
    color: 'indigo',
    gradient: 'from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400' 
  }
};

// Default theme for fallback
const defaultTheme = { 
  icon: Dumbbell, 
  color: 'violet',
  gradient: 'from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/20',
  iconColor: 'text-violet-600 dark:text-violet-400'
};

const ActivityListItem = ({ activity, onActivitySelect }) => {
  // Format time from ISO string
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  // Format date for displaying day and month
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };
  
  // Helper function to format duration from minutes to HH:MM format
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };

  // Format distance to always have 1 decimal place
  const formatDistance = (distance) => {
    return parseFloat(distance).toFixed(1);
  };

  // Get the appropriate theme for the activity type
  const theme = activityThemes[activity.type] || defaultTheme;
  const IconComponent = theme.icon;
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20,
        duration: 0.3 
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  // Calculate intensity level based on calories burned (simplified example)
  const getIntensityLevel = () => {
    const caloriesPerMinute = activity.calories / activity.duration;
    if (caloriesPerMinute > 10) return { level: 'High', color: 'text-rose-500' };
    if (caloriesPerMinute > 5) return { level: 'Medium', color: 'text-amber-500' };
    return { level: 'Low', color: 'text-emerald-500' };
  };
  
  const intensityInfo = getIntensityLevel();
  
  return (
    <motion.div
      layoutId={`activity-${activity.id}`}
      onClick={() => onActivitySelect && onActivitySelect(activity)}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        scale: 1.02, 
        translateX: 4,
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)"
      }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-gray-800/40 rounded-xl p-5 shadow-sm hover:shadow-lg border border-${theme.color}-100/50 dark:border-${theme.color}-800/30 cursor-pointer transition-all duration-300 backdrop-blur-sm overflow-hidden relative`}
    >
      {/* Background accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full bg-gradient-to-br ${theme.gradient} opacity-30 blur-xl`} />
      
      <div className="flex items-start gap-4 z-10 relative">
        {/* Activity icon */}
        <motion.div 
          whileHover={{ 
            rotate: [0, -10, 10, -5, 0],
            transition: { duration: 0.5 }
          }}
          className={`p-3.5 rounded-xl bg-gradient-to-br ${theme.gradient} ${theme.iconColor} border border-${theme.color}-200/50 dark:border-${theme.color}-800/30 shadow-sm`}
        >
          <IconComponent className="h-6 w-6" />
        </motion.div>
        
        {/* Activity details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                  {activity.title}
                </h3>
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  className="ml-2"
                >
                  <ArrowUpRight className={`h-3.5 w-3.5 ${theme.iconColor}`} />
                </motion.div>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5 gap-2">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(activity.date)}
                </span>
                <span className="flex items-center">
                  {formatDate(activity.date)}
                </span>
                {activity.hasRoute && (
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    Route
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {activity.hasPersonalBest && (
                <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  PB
                </div>
              )}
              <div className={`bg-${theme.color}-50/50 dark:bg-${theme.color}-900/20 ${theme.iconColor} px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center`}>
                <Zap className="h-3 w-3 mr-1" />
                <span className={intensityInfo.color}>{intensityInfo.level}</span>
              </div>
            </div>
          </div>
          
          {/* Activity metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            {activity.distance && (
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Distance</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{formatDistance(activity.distance)} <span className="text-xs">km</span></p>
              </div>
            )}
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Duration</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{formatDuration(activity.duration)}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 mb-1">
                <Flame className="h-3 w-3" />
                <span>Calories</span>
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{activity.calories}</p>
            </div>
            {activity.avgHeartRate && (
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 mb-1">
                  <Heart className="h-3 w-3 text-rose-500" />
                  <span>Avg HR</span>
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{activity.avgHeartRate} <span className="text-xs">bpm</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityListItem;