import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Heart, BarChart2, ArrowUpRight, Flame, Clock, Ruler, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const ActivityDetailView = ({ activity, onClose, layoutId }) => {
  // Format time from ISO string
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  // Format date from ISO string
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  // Helper function to format duration from minutes to HH:MM format
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };
  
  // Helper function to format pace based on activity type
  const formatPace = (pace, activityType) => {
    if (pace === null) return 'N/A';
    
    switch (activityType) {
      case 'Running':
      case 'Walking':
      case 'Hiking':
        // Format as min/km
        const mins = Math.floor(pace);
        const secs = Math.round((pace - mins) * 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs} /km`;
      case 'Cycling':
        // Format as km/h
        return `${pace.toFixed(1)} km/h`;
      default:
        return 'N/A';
    }
  };

  // Fake map data - in a real app, this would come from an API
  const fakeMapData = {
    center: { lat: 51.505, lng: -0.09 },
    path: [
      { lat: 51.505, lng: -0.09 },
      { lat: 51.51, lng: -0.1 },
      { lat: 51.51, lng: -0.12 },
      { lat: 51.52, lng: -0.12 },
    ],
  };

  // Generate mock heart rate data points for visualization
  const generateHeartRateData = () => {
    const baseRate = activity.avgHeartRate;
    const points = [];
    
    for (let i = 0; i < 60; i++) {
      // Fluctuate around the average value
      const variation = Math.random() * 20 - 10;
      points.push({
        time: i,
        value: Math.max(80, Math.min(200, Math.round(baseRate + variation)))
      });
    }
    
    return points;
  };

  // Animation variants for the modal
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 500 
      } 
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800/90 rounded-xl overflow-hidden max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-xl border border-gray-100 dark:border-gray-700/80 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        variants={contentVariants}
        layoutId={layoutId}
      >
        {/* Header with Close Button */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activity.title}
            </h2>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(activity.date)} at {formatTime(activity.date)}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Activity Details */}
        <div className="p-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Distance */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <Ruler className="h-4 w-4 mr-1.5" />
                Distance
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {activity.distance} km
              </div>
            </div>
            
            {/* Duration */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                Duration
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatDuration(activity.duration)}
              </div>
            </div>
            
            {/* Calories */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <Flame className="h-4 w-4 mr-1.5" />
                Calories
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {activity.calories} kcal
              </div>
            </div>
            
            {/* Pace or Heart Rate */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                {activity.pace ? (
                  <ArrowUpRight className="h-4 w-4 mr-1.5" />
                ) : (
                  <Heart className="h-4 w-4 mr-1.5" />
                )}
                {activity.pace ? 'Pace' : 'Avg Heart Rate'}
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {activity.pace 
                  ? formatPace(activity.pace, activity.type)
                  : `${activity.avgHeartRate} bpm`
                }
              </div>
            </div>
          </div>

          {/* Heart Rate Graph (simplified mockup) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-violet-500" />
              Heart Rate
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 h-48 relative overflow-hidden">
              {/* Simplified heart rate visualization */}
              <div className="absolute inset-0 flex items-end">
                {generateHeartRateData().map((point, index) => {
                  const height = (point.value - 80) / 120 * 100; // Normalize between 80-200bpm
                  
                  return (
                    <div 
                      key={index} 
                      className="flex-1 mx-0.5"
                      style={{ height: `${height}%` }}
                    >
                      <div 
                        className="w-full h-full rounded-t"
                        style={{ 
                          background: `linear-gradient(to top, rgb(239, 68, 68, 0.7), rgb(239, 68, 68, 0.3))`,
                          maxHeight: '100%'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Y-axis labels */}
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between p-2 text-xs text-gray-500">
                <span>200 bpm</span>
                <span>150 bpm</span>
                <span>100 bpm</span>
              </div>
              {/* X-axis label */}
              <div className="absolute bottom-0 right-4 text-xs text-gray-500">
                Time
              </div>
            </div>
          </div>

          {/* Map Section (if route is available) */}
          {activity.hasRoute && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Route
              </h3>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 overflow-hidden relative">
                {/* Map placeholder - in a real app, this would be an actual map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Map visualization would be rendered here
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              Like
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              Share
            </Button>
            <Button variant="default" size="sm" className="ml-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              Save to Collection
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityDetailView;