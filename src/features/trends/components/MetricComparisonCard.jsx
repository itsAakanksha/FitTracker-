import React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Heart, Zap, Droplet, Dumbbell, Moon, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';

// Generate mock correlation data
const generateCorrelationData = (primaryMetric, secondaryMetric, correlation = 0.7) => {
  // We'll generate 30 points with some correlation
  const data = [];
  const primaryPattern = getPatternForMetric(primaryMetric);
  const secondaryPattern = getPatternForMetric(secondaryMetric);
  
  // Create base values
  for (let i = 0; i < 30; i++) {
    // Base value for primary
    const primaryBase = primaryPattern.base + (Math.random() * 2 - 1) * primaryPattern.variance;
    
    // For secondary, we add some correlation
    let secondaryBase = secondaryPattern.base + (Math.random() * 2 - 1) * secondaryPattern.variance;
    
    // Add correlation effect (positive or negative)
    if (shouldBeNegativelyCorrelated(primaryMetric, secondaryMetric)) {
      secondaryBase = secondaryPattern.base - (primaryBase - primaryPattern.base) * Math.abs(correlation);
    } else {
      secondaryBase = secondaryPattern.base + (primaryBase - primaryPattern.base) * Math.abs(correlation);
    }
    
    // Add some noise
    secondaryBase += (Math.random() * 2 - 1) * secondaryPattern.variance * (1 - Math.abs(correlation));
    
    // Scale values appropriately
    const primaryValue = Math.max(0, primaryBase);
    const secondaryValue = Math.max(0, secondaryBase);
    
    data.push({
      id: i,
      [primaryMetric]: Math.round(primaryValue * 10) / 10,
      [secondaryMetric]: Math.round(secondaryValue * 10) / 10,
    });
  }
  
  return data;
};

// Helper function to determine correlation direction
const shouldBeNegativelyCorrelated = (metric1, metric2) => {
  // Examples of negative correlations
  const negativeCorrelations = [
    ['heart', 'active'],
    ['heart', 'steps'],
    ['sleep', 'heart']
  ];
  
  return negativeCorrelations.some(pair => 
    (pair[0] === metric1 && pair[1] === metric2) || 
    (pair[0] === metric2 && pair[1] === metric1)
  );
};

// Get base pattern for metric
const getPatternForMetric = (metric) => {
  const patterns = {
    steps: { base: 9000, variance: 2500 },
    calories: { base: 2400, variance: 600 },
    active: { base: 55, variance: 20 },
    sleep: { base: 7.5, variance: 1 },
    heart: { base: 62, variance: 5 },
  };
  
  return patterns[metric] || patterns.steps;
};

// Calculate the correlation coefficient
const calculateCorrelation = (data, xKey, yKey) => {
  const n = data.length;
  
  // If we have less than 2 points, correlation is undefined
  if (n < 2) return 0;
  
  // Extract x and y values
  const xValues = data.map(item => item[xKey]);
  const yValues = data.map(item => item[yKey]);
  
  // Calculate means
  const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
  const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate the numerator and denominators
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  // Avoid division by zero
  if (xDenominator === 0 || yDenominator === 0) return 0;
  
  // Calculate correlation
  const correlation = numerator / Math.sqrt(xDenominator * yDenominator);
  
  // Ensure the value is between -1 and 1
  return Math.max(-1, Math.min(1, correlation));
};

// Get icon for metric
const getIconForMetric = (metric) => {
  const icons = {
    steps: <Activity className="h-4 w-4" />,
    calories: <Zap className="h-4 w-4" />,
    active: <Dumbbell className="h-4 w-4" />,
    sleep: <Moon className="h-4 w-4" />,
    heart: <Heart className="h-4 w-4" />,
    water: <Droplet className="h-4 w-4" />,
  };
  
  return icons[metric] || <Activity className="h-4 w-4" />;
};

// Get unit for metric
const getUnitForMetric = (metric) => {
  const units = {
    steps: 'steps',
    calories: 'kcal',
    active: 'min',
    sleep: 'hrs',
    heart: 'bpm',
  };
  
  return units[metric] || '';
};

// Component to show a nice formatted metric name
const MetricBadge = ({ metric, color }) => {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-${color}/10`}>
      <div className={`text-${color}`}>{getIconForMetric(metric)}</div>
      <span className="text-xs font-medium capitalize">{metric}</span>
    </div>
  );
};

const MetricComparisonCard = ({ primaryMetric, secondaryMetric, primaryColor, secondaryColor }) => {
  const data = generateCorrelationData(primaryMetric, secondaryMetric);
  const correlation = calculateCorrelation(data, primaryMetric, secondaryMetric);
  const correlationAbs = Math.abs(correlation);
  
  // Get insight based on correlation
  const getInsight = () => {
    if (correlationAbs < 0.3) {
      return `No significant relationship between your ${primaryMetric} and ${secondaryMetric}.`;
    } else if (correlationAbs < 0.5) {
      return `There's a weak ${correlation > 0 ? 'positive' : 'negative'} relationship between your ${primaryMetric} and ${secondaryMetric}.`;
    } else if (correlationAbs < 0.7) {
      return `There's a moderate ${correlation > 0 ? 'positive' : 'negative'} relationship between your ${primaryMetric} and ${secondaryMetric}.`;
    } else {
      return `There's a strong ${correlation > 0 ? 'positive' : 'negative'} relationship between your ${primaryMetric} and ${secondaryMetric}.`;
    }
  };
  
  // Get advice based on correlation
  const getAdvice = () => {
    // This is a simplistic model, in a real app this would be more sophisticated
    if (primaryMetric === 'steps' && secondaryMetric === 'calories' && correlation > 0.5) {
      return "Increasing your steps is helping you burn more calories. Keep up the walking!";
    } else if (primaryMetric === 'steps' && secondaryMetric === 'heart' && correlation < -0.3) {
      return "More consistent steps may be helping lower your resting heart rate, which is good for your cardiovascular health.";
    } else if (primaryMetric === 'sleep' && secondaryMetric === 'active' && correlation > 0.3) {
      return "Better sleep quality seems to correspond with more active minutes. Prioritize your rest!";
    } else if (primaryMetric === 'heart' && secondaryMetric === 'active' && correlation < -0.5) {
      return "Your activity is having a positive effect on lowering your resting heart rate.";
    } else if (correlationAbs > 0.5) {
      return correlation > 0 
        ? `Increasing your ${primaryMetric} tends to increase your ${secondaryMetric}.` 
        : `Increasing your ${primaryMetric} tends to decrease your ${secondaryMetric}.`;
    }
    
    return "Track more data to get personalized recommendations for improvement.";
  };

  return (
    <div className="px-4 py-3">
      {/* Metric badges */}
      <div className="flex justify-between mb-4">
        <MetricBadge metric={primaryMetric} color={primaryColor.replace('#', '')} />
        <span className="text-xs text-gray-500">vs</span>
        <MetricBadge metric={secondaryMetric} color={secondaryColor.replace('#', '')} />
      </div>
      
      {/* Scatter plot */}
      <div className="h-48 my-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 10, right: 10, bottom: 25, left: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              dataKey={primaryMetric} 
              name={primaryMetric} 
              unit={` ${getUnitForMetric(primaryMetric)}`}
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: '#e5e7eb' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              type="number" 
              dataKey={secondaryMetric} 
              name={secondaryMetric}
              unit={` ${getUnitForMetric(secondaryMetric)}`}
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: '#e5e7eb' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              cursor={{strokeDasharray: '3 3'}}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Scatter 
              name={`${primaryMetric} vs ${secondaryMetric}`} 
              data={data} 
              fill={primaryColor} 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Correlation indicator */}
      <div className="mt-4 bg-gray-50 dark:bg-gray-800/80 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Correlation</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {getInsight()}
            </p>
          </div>
          
          <div className={`text-lg font-bold ${
            correlation > 0.3 ? 'text-emerald-500' : 
            correlation < -0.3 ? 'text-amber-500' :
            'text-gray-500'
          }`}>
            {correlation.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Advice */}
      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        <p>{getAdvice()}</p>
      </div>
      
      <div className="mt-4">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View Detailed Analysis
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default MetricComparisonCard;