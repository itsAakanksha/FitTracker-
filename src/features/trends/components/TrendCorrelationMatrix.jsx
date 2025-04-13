import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Heart, Zap, Droplet, Dumbbell, Moon,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';

// List of all metrics to analyze
const metrics = [
  { 
    id: 'steps', 
    name: 'Steps', 
    icon: <Activity className="h-4 w-4" />,
    color: 'text-blue-500'
  },
  { 
    id: 'calories', 
    name: 'Calories', 
    icon: <Zap className="h-4 w-4" />,
    color: 'text-red-500'
  },
  { 
    id: 'active', 
    name: 'Activity', 
    icon: <Dumbbell className="h-4 w-4" />,
    color: 'text-emerald-500'
  },
  { 
    id: 'sleep', 
    name: 'Sleep', 
    icon: <Moon className="h-4 w-4" />,
    color: 'text-purple-500'
  },
  { 
    id: 'heart', 
    name: 'Heart Rate', 
    icon: <Heart className="h-4 w-4" />,
    color: 'text-orange-500'
  },
];

// Fixed correlation matrix - in a real app, this would be calculated
// from actual user data
const correlationMatrix = {
  // Steps correlations
  'steps-calories': 0.82,
  'steps-active': 0.75,
  'steps-sleep': 0.28,
  'steps-heart': -0.41,
  
  // Calories correlations
  'calories-active': 0.79,
  'calories-sleep': 0.31,
  'calories-heart': -0.25,
  
  // Active minutes correlations
  'active-sleep': 0.38,
  'active-heart': -0.58,
  
  // Sleep correlations
  'sleep-heart': -0.33,
};

// Helper to get correlation between any two metrics
const getCorrelation = (metric1, metric2) => {
  // Make sure we check both possible orders
  const key1 = `${metric1}-${metric2}`;
  const key2 = `${metric2}-${metric1}`;
  
  if (metric1 === metric2) return 1; // Self correlation is always 1
  
  return correlationMatrix[key1] || correlationMatrix[key2] || 0;
};

// Get appropriate color/icon for correlation
const getCorrelationDisplay = (value) => {
  const absValue = Math.abs(value);
  
  // No correlation
  if (absValue < 0.2) {
    return {
      color: 'text-gray-400 bg-gray-100 dark:bg-gray-800',
      icon: <Minus className="h-3 w-3" />
    };
  }
  
  // Weak correlation
  if (absValue < 0.4) {
    return {
      color: value > 0 
        ? 'text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
        : 'text-amber-400 bg-amber-50 dark:bg-amber-900/20',
      icon: value > 0 
        ? <TrendingUp className="h-3 w-3" /> 
        : <TrendingDown className="h-3 w-3" />
    };
  }
  
  // Medium correlation
  if (absValue < 0.7) {
    return {
      color: value > 0 
        ? 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' 
        : 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
      icon: value > 0 
        ? <TrendingUp className="h-3 w-3" /> 
        : <TrendingDown className="h-3 w-3" />
    };
  }
  
  // Strong correlation
  return {
    color: value > 0 
      ? 'text-emerald-600 bg-emerald-200 dark:bg-emerald-900/40' 
      : 'text-amber-600 bg-amber-200 dark:bg-amber-900/40',
    icon: value > 0 
      ? <TrendingUp className="h-3 w-3" /> 
      : <TrendingDown className="h-3 w-3" />
  };
};

const TrendCorrelationMatrix = ({ activeMetric }) => {
  return (
    <div>
      <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-2">
        {/* Empty top-left cell */}
        <div className="bg-transparent"></div>
        
        {/* Column headers */}
        {metrics.map(metric => (
          <div 
            key={`header-${metric.id}`} 
            className={`flex flex-col items-center justify-center p-2 ${
              activeMetric === metric.id ? 'bg-gray-100 dark:bg-gray-800 rounded-md' : ''
            }`}
          >
            <div className={`${metric.color} mb-1`}>
              {metric.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {metric.name}
            </span>
          </div>
        ))}
        
        {/* Matrix rows */}
        {metrics.map(rowMetric => (
          <React.Fragment key={`row-${rowMetric.id}`}>
            {/* Row header */}
            <div 
              className={`flex items-center gap-2 p-2 ${
                activeMetric === rowMetric.id ? 'bg-gray-100 dark:bg-gray-800 rounded-md' : ''
              }`}
            >
              <div className={rowMetric.color}>
                {rowMetric.icon}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {rowMetric.name}
              </span>
            </div>
            
            {/* Correlation cells */}
            {metrics.map(colMetric => {
              const correlation = getCorrelation(rowMetric.id, colMetric.id);
              const display = getCorrelationDisplay(correlation);
              
              return (
                <motion.div
                  key={`${rowMetric.id}-${colMetric.id}`}
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ 
                    scale: (rowMetric.id === activeMetric || colMetric.id === activeMetric) ? 1.05 : 1,
                    opacity: (rowMetric.id === activeMetric || colMetric.id === activeMetric) ? 1 : 0.9
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`flex flex-col items-center justify-center p-2 rounded-md ${display.color} ${
                    (rowMetric.id === activeMetric && colMetric.id === activeMetric) ? 'ring-2 ring-blue-400' : 
                    (rowMetric.id === activeMetric || colMetric.id === activeMetric) ? 'ring-1 ring-blue-300' : ''
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {display.icon}
                  </div>
                  
                  <span className={`text-xs font-semibold ${
                    Math.abs(correlation) > 0.6 ? 'text-gray-800 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                  }`}>
                    {correlation === 1 ? '1.0' : correlation.toFixed(2)}
                  </span>
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <div className="flex items-center justify-center p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          </div>
          <span>Positive correlation</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <div className="flex items-center justify-center p-1 rounded-md bg-amber-100 dark:bg-amber-900/30">
            <TrendingDown className="h-3 w-3 text-amber-500" />
          </div>
          <span>Negative correlation</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <div className="flex items-center justify-center p-1 rounded-md bg-gray-100 dark:bg-gray-800">
            <Minus className="h-3 w-3 text-gray-400" />
          </div>
          <span>No correlation</span>
        </div>
      </div>
    </div>
  );
};

export default TrendCorrelationMatrix;