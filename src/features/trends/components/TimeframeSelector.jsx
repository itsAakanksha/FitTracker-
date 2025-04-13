import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';

const timeframes = [
  { id: 'week', label: 'W' },
  { id: 'month', label: 'M' },
  { id: '3month', label: '3M' },
  { id: '6month', label: '6M' },
  { id: 'year', label: 'Y' }
];

const TimeframeSelector = ({ activeTimeframe, setActiveTimeframe }) => {
  return (
    <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 p-1 rounded-lg bg-white dark:bg-gray-900/50 backdrop-blur-lg">
      {timeframes.map((timeframe) => (
        <div key={timeframe.id} className="relative">
          {activeTimeframe === timeframe.id && (
            <motion.div
              layoutId="timeframeIndicator"
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 rounded-md"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            className={`relative z-10 w-14 ${activeTimeframe === timeframe.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setActiveTimeframe(timeframe.id)}
          >
            {timeframe.label}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TimeframeSelector;