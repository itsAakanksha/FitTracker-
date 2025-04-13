import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Heart, Zap, Droplet, Dumbbell, Moon, 
  Plus, Check, X
} from 'lucide-react';
import { Button } from '../../../components/ui/button';

const metrics = [
  { 
    id: 'steps', 
    name: 'Steps', 
    icon: <Activity className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  { 
    id: 'calories', 
    name: 'Calories', 
    icon: <Zap className="h-4 w-4" />,
    color: 'bg-red-500'
  },
  { 
    id: 'active', 
    name: 'Activity', 
    icon: <Dumbbell className="h-4 w-4" />,
    color: 'bg-emerald-500'
  },
  { 
    id: 'sleep', 
    name: 'Sleep', 
    icon: <Moon className="h-4 w-4" />,
    color: 'bg-purple-500'
  },
  { 
    id: 'heart', 
    name: 'Heart Rate', 
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-orange-500'
  },
];

const MetricSelector = ({ 
  activeMetric, 
  setActiveMetric, 
  secondaryMetric,
  setSecondaryMetric,
  comparisonMode 
}) => {
  const handleMetricClick = (metricId) => {
    if (!comparisonMode) {
      setActiveMetric(metricId);
      return;
    }

    // For comparison mode
    if (activeMetric === metricId) {
      // Can't deselect primary metric
      return;
    } else if (secondaryMetric === metricId) {
      // Deselect secondary metric
      setSecondaryMetric(null);
    } else if (secondaryMetric === null) {
      // Select as secondary metric
      setSecondaryMetric(metricId);
    } else {
      // Replace secondary metric
      setSecondaryMetric(metricId);
    }
  };

  const isSelected = (metricId) => {
    return activeMetric === metricId || secondaryMetric === metricId;
  };

  const isPrimary = (metricId) => {
    return activeMetric === metricId;
  };

  const isSecondary = (metricId) => {
    return secondaryMetric === metricId;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {metrics.map((metric) => (
        <Button
          key={metric.id}
          variant={isSelected(metric.id) ? "default" : "outline"}
          size="sm"
          className={`relative flex items-center gap-2 ${
            isPrimary(metric.id) 
              ? "bg-gradient-to-r from-blue-600 to-violet-600"
              : isSecondary(metric.id)
              ? "bg-gradient-to-r from-amber-500 to-orange-600"
              : ""
          }`}
          onClick={() => handleMetricClick(metric.id)}
        >
          <div className={`flex items-center justify-center rounded-full ${isSelected(metric.id) ? 'text-white' : `text-${metric.color.split('-')[1]}-500`}`}>
            {metric.icon}
          </div>
          {metric.name}
          
          {comparisonMode && (
            <div className="ml-1">
              {isPrimary(metric.id) && (
                <div className="h-4 w-4 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-[10px]">
                  1
                </div>
              )}
              {isSecondary(metric.id) && (
                <div className="h-4 w-4 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-[10px]">
                  2
                </div>
              )}
            </div>
          )}
        </Button>
      ))}
    </div>
  );
};

export default MetricSelector;