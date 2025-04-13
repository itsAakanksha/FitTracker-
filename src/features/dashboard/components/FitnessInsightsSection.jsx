import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from '../../../app/hooks';
import { selectFitnessInsights } from '../dashboardSlice';
import { motion } from 'framer-motion';
import { TrendingUp, CalendarCheck, Brain, Award } from 'lucide-react'; // Import icons directly

function FitnessInsightsSection() {
  const insightsData = useAppSelector(selectFitnessInsights);

  // Map of icon components by ID
  const iconMap = {
    endurance: TrendingUp,
    consistency: CalendarCheck,
    mindful: Brain,
    peak: Award
  };

  return (
    // Enhanced card styling
    <Card className="bg-white dark:bg-[#17171D] shadow-lg border border-gray-100 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Fitness Insights ✨</CardTitle>
         <p className="text-sm text-gray-500 dark:text-gray-400">Personalized observations based on your activity.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insightsData.map((insight, index) => {
             const IconComponent = iconMap[insight.id];
             return (
                // Added hover effect and slightly refined styling
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }} // Subtle lift and shadow on hover
                  className={`p-4 rounded-lg flex items-start space-x-4 border dark:border-gray-700 ${insight.bgColor} transition-shadow duration-150`}
                >
                     {/* Enhanced icon background */}
                     <div className={`flex-shrink-0 p-3 rounded-full ${insight.color} ${insight.bgColor.replace('bg-', 'dark:bg-').replace('/50', '/30')} border border-current opacity-80`}>
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                     </div>
                     <div className="flex-1">
                       <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{insight.title}</h4>
                       <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{insight.description}</p>
                     </div>
                </motion.div>
             );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default FitnessInsightsSection;

