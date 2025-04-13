import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb, ArrowRight } from 'lucide-react';

const TrendInsightsCard = ({ insight }) => {
  const getBgClass = () => {
    switch (insight.type) {
      case 'positive':
        return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40';
      case 'negative':
        return 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/40';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40';
    }
  };

  const getIconBgClass = () => {
    switch (insight.type) {
      case 'positive':
        return 'bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400';
      case 'negative':
        return 'bg-rose-100 dark:bg-rose-800/30 text-rose-600 dark:text-rose-400';
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400';
      case 'info':
      default:
        return 'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`px-4 py-3 m-2 rounded-lg border ${getBgClass()} backdrop-blur-lg`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${getIconBgClass()}`}>
          {insight.icon || <Lightbulb className="h-4 w-4" />}
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {insight.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {insight.description}
          </p>
          
          {insight.action && (
            <button className="flex items-center text-xs font-medium mt-2 text-blue-600 dark:text-blue-400">
              {insight.action}
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TrendInsightsCard;