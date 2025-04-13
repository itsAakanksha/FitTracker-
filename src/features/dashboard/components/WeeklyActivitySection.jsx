import React, { useState, useEffect, useId, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle, Footprints, Flame, Clock, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { selectWeeklyActivity, selectWeeklySummary } from '../dashboardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  Label
} from 'recharts';

// Spring physics configuration for smooth animations
const springConfig = {
  type: "spring",
  mass: 0.6,
  damping: 15,
  stiffness: 140,
  restDelta: 0.001
};

// Chart animations
const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...springConfig,
      delayChildren: 0.15,
      staggerChildren: 0.04
    }
  }
};

// Define gradients and colors
const COLORS = {
  steps: {
    gradient: ['#8b5cf6', '#6d28d9'],
    fill: '#8b5cf6',
    sparklineFill: '#8b5cf620'
  },
  calories: {
    gradient: ['#fb923c', '#ea580c'],
    fill: '#fb923c',
    sparklineFill: '#fb923c20'
  },
  activeMinutes: {
    gradient: ['#4ade80', '#16a34a'],
    fill: '#4ade80',
    sparklineFill: '#4ade8020'
  }
};

// Custom tooltip component (placeholder)
const CustomTooltip = () => null;

// Error boundary logging
const logError = (err) => {
  console.error("Chart rendering error:", err);
};

function WeeklyActivitySection() {
  // Generate unique IDs for gradients to avoid conflicts
  const uniqueId = useId().replace(/:/g, "_");
  const weeklyChartData = useAppSelector(selectWeeklyActivity);
  const weeklySummary = useAppSelector(selectWeeklySummary);
  const [activeTab, setActiveTab] = useState('steps');
  const [activeBarIndex, setActiveBarIndex] = useState(null);
  
  // Force reset activeBarIndex when tab changes
  useEffect(() => {
    setActiveBarIndex(null);
  }, [activeTab]);
  
  // Create unique gradient IDs for each tab
  const barGradientId = `bar-gradient-${activeTab}-${uniqueId}`;
  const sparklineGradientId = `sparkline-gradient-${activeTab}-${uniqueId}`;
  
  // Dynamic properties based on active tab
  const tabProperties = {
    steps: {
      color: 'text-violet-700 dark:text-violet-300',
      icon: Footprints,
      dataKey: 'Steps',
      unit: 'steps',
      bgLight: 'bg-violet-50',
      bgDark: 'dark:bg-violet-900/20',
      stroke: '#8b5cf6',
      fill: '#8b5cf6',
      dailyGoal: weeklySummary.dailyStepGoal || 10000
    },
    calories: {
      color: 'text-orange-700 dark:text-orange-300',
      icon: Flame,
      dataKey: 'Calories',
      unit: 'kcal',
      bgLight: 'bg-orange-50',
      bgDark: 'dark:bg-orange-900/20',
      stroke: '#fb923c',
      fill: '#fb923c',
      dailyGoal: weeklySummary.dailyCalorieGoal || 2500
    },
    activeMinutes: {
      color: 'text-green-700 dark:text-green-300',
      icon: Clock,
      dataKey: 'ActiveMinutes',
      unit: 'mins',
      bgLight: 'bg-green-50',
      bgDark: 'dark:bg-green-900/20',
      stroke: '#4ade80',
      fill: '#4ade80',
      dailyGoal: weeklySummary.dailyActiveGoal || 30
    }
  };

  const activeProps = tabProperties[activeTab];
  
  // Weekly progress indicator
  const isPositiveProgress = weeklySummary.progressVsLastWeek >= 0;
  const progressColor = isPositiveProgress ? 
    'bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/30' : 
    'bg-gradient-to-br from-red-50 to-rose-50/50 dark:from-red-900/20 dark:to-rose-900/10 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/30';
  const ProgressIcon = isPositiveProgress ? ArrowUpCircle : ArrowDownCircle;

  // Clean data to ensure all properties exist
  const cleanedData = React.useMemo(() => {
    return weeklyChartData.map(day => ({
      name: day.name || '',
      Steps: day.Steps || 0,
      Calories: day.Calories || 0,
      ActiveMinutes: day.ActiveMinutes || 0
    }));
  }, [weeklyChartData]);

  // Enhanced tooltip component
  const EnhancedTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataKey = activeProps.dataKey;
      const value = payload[0]?.value || 0;
      const unit = activeProps.unit;
      
      // Find the max value for the current metric to calculate relative height
      const maxValue = Math.max(...cleanedData.map(day => day[dataKey] || 0));
      const relativeHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;

      return (
        <div className="p-4 bg-white/95 dark:bg-[#101014]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl text-xs min-w-[140px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProps.fill }} />
            <p className="font-semibold text-gray-700 dark:text-gray-300">{label}</p>
          </div>
          
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-gray-500 dark:text-gray-400">{dataKey}</span>
            <span className="text-base font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</span>
          </div>
          
          {/* Tab-specific additional data */}
          {activeTab === 'calories' && (
            <div className="text-xs opacity-70 mb-1 text-gray-500">
              ~{Math.round(value * 0.05 + 65)} avg bpm
            </div>
          )}
          
          {/* Mini-comparison bar */}
          <div className="h-1.5 w-full bg-gray-100 dark:bg-[#17171D] rounded-full overflow-hidden mt-2">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                width: `${relativeHeight}%`,
                backgroundColor: activeProps.fill
              }}
              initial={{ width: 0 }}
              animate={{ width: `${relativeHeight}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="mt-2 text-[10px] flex justify-between text-gray-500 dark:text-gray-400">
            <span>0</span>
            <span>{maxValue.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  }, [activeProps, activeTab, cleanedData]);

  // Create the bar chart component for each tab
  const renderBarChart = useCallback(() => {
    try {
      return (
        <BarChart 
          data={cleanedData} 
          margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          onMouseMove={(data) => {
            if (data.activeTooltipIndex !== undefined) {
              setActiveBarIndex(data.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveBarIndex(null)}
        >
          <defs>
            <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[activeTab].gradient[0]} stopOpacity={0.9}/>
              <stop offset="95%" stopColor={COLORS[activeTab].gradient[1]} stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="var(--border, #e5e7eb)" 
            opacity={0.4}
            strokeWidth={0.5} 
          />
          <XAxis 
            dataKey="name" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={12} 
            tick={{ fill: 'var(--foreground, #4b5563)' }}
          />
          <YAxis 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dx={-5} 
            width={35}
            tick={{ fill: 'var(--foreground, #4b5563)' }}
            domain={[0, 'dataMax']}
          />
          <Tooltip 
            cursor={{ fill: 'var(--muted, #f9fafb)', opacity: 0.4 }} 
            content={<EnhancedTooltip />} 
          />
          
          {/* Daily goal reference line */}
          <ReferenceLine 
            y={activeProps.dailyGoal} 
            stroke={COLORS[activeTab].gradient[1]} 
            strokeDasharray="3 3" 
            strokeWidth={1.5}
            opacity={0.7}
          >
            <Label 
              value="Goal" 
              position="right" 
              fill={COLORS[activeTab].fill} 
              fontSize={10}
            />
          </ReferenceLine>
          
          <Bar 
            dataKey={activeProps.dataKey} 
            fill={`url(#${barGradientId})`} 
            radius={[5, 5, 0, 0]} 
            barSize={28}
            animationDuration={400}
            animationEasing="ease-out"
          >
            {cleanedData.map((entry, index) => {
              // Special styling for calories tab
              const exceededGoal = entry[activeProps.dataKey] >= activeProps.dailyGoal;
              
              return (
                <Cell 
                  key={`cell-${index}`} 
                  filter={activeBarIndex === index ? 'drop-shadow(0 0 6px rgba(0,0,0,0.2))' : undefined}
                  cursor="pointer" 
                  opacity={activeBarIndex === null || activeBarIndex === index ? 1 : 0.6}
                  stroke={exceededGoal ? COLORS[activeTab].gradient[1] : undefined}
                  strokeWidth={exceededGoal ? 1 : 0}
                />
              );
            })}
          </Bar>
        </BarChart>
      );
    } catch (err) {
      logError(err);
      // Fallback render if something goes wrong
      return (
        <div className="h-full w-full flex items-center justify-center text-gray-500">
          Unable to load chart data
        </div>
      );
    }
  }, [activeTab, barGradientId, activeProps, cleanedData, activeBarIndex, EnhancedTooltip]);

  // Create the sparkline component
  const renderSparkline = useCallback(() => {
    try {
      // Generate sparkline data from the weekly data - correctly computed for each render
      const sparklineData = cleanedData.map(day => ({
        name: day.name,
        value: day[activeProps.dataKey] || 0 // Add fallback to prevent null/undefined
      }));

      return (
        <AreaChart data={sparklineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id={sparklineGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={activeProps.stroke} stopOpacity={0.7} />
              <stop offset="95%" stopColor={activeProps.stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={activeProps.stroke} 
            strokeWidth={1.5}
            fill={`url(#${sparklineGradientId})`}
            dot={false}
            activeDot={{ r: 3 }}
          />
          <Tooltip content={CustomTooltip} cursor={false} />
        </AreaChart>
      );
    } catch (err) {
      logError(err);
      // Fallback render
      return (
        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
          Sparkline unavailable
        </div>
      );
    }
  }, [activeProps, sparklineGradientId, cleanedData]);
  
  return (
    <Card className="bg-white dark:bg-[#17171D]/95 shadow-lg dark:shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              Weekly Activity
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your activity trends over the past week
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative">
            <TabsList className="grid w-full grid-cols-3 mb-5 bg-gray-100/70 dark:bg-gray-700/30 rounded-lg p-1.5 backdrop-blur-sm">
              {/* Animated selection indicator */}
              <motion.div
                className="absolute h-full top-0 bg-white dark:bg-[#17171D] rounded-md shadow-md z-0"
                animate={{ 
                  x: activeTab === 'steps' 
                    ? 0 
                    : activeTab === 'calories' 
                      ? '100%' 
                      : '200%'
                }}
                style={{ width: '33.333%' }}
                transition={springConfig}
              />
              
              <TabsTrigger 
                value="steps" 
                className="relative z-10 flex items-center gap-1.5 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300"
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Steps</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="calories" 
                className="relative z-10 flex items-center gap-1.5 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-300"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Calories</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="activeMinutes" 
                className="relative z-10 flex items-center gap-1.5 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Active</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Each tab gets its own animation key */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="h-64 w-full mb-6"
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key={`chart-${activeTab}`}
            >
              <TabsContent 
                value={activeTab} 
                forceMount
                className="mt-0 border-0 p-0 h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {renderBarChart()}
                </ResponsiveContainer>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
          
          {/* Sparkline visualization with improved animation */}
          <div className="h-10 w-full mb-4 opacity-70">
            <ResponsiveContainer width="100%" height="100%">
              {renderSparkline()}
            </ResponsiveContainer>
          </div>
        </Tabs>
        
        {/* Enhanced summary stats cards with dynamic visualizations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200/50 dark:border-gray-700/30 pt-6 mt-3">
          {/* Average Card */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            className={`relative p-5 rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white/90 to-white/40 dark:from-gray-800/90 dark:to-gray-800/40 border border-gray-200/60 dark:border-gray-700/40 shadow-lg transition-all ${activeProps.bgLight} ${activeProps.bgDark}`}
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-xl" 
                 style={{ background: `radial-gradient(circle, ${COLORS[activeTab].fill}, transparent)` }} />
            
            <div className="flex justify-between items-start mb-3">
              {/* Icon with background */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${activeProps.bgLight} ${activeProps.bgDark} bg-opacity-70 p-2`}>
                <activeProps.icon className={`w-full h-full ${activeProps.color}`} />
              </div>
              
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100/70 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                Daily Avg
              </span>
            </div>
            
            <h3 className={`text-sm ${activeProps.color} font-medium uppercase tracking-wider mt-2`}>
              {activeTab === 'steps' ? 'Steps' : activeTab === 'calories' ? 'Calories Burned' : 'Active Minutes'}
            </h3>
            
            <div className="flex items-baseline mt-1 mb-3">
              <p className={`text-2xl md:text-3xl font-bold ${activeProps.color} tracking-tight`}>
                {activeTab === 'steps' 
                  ? weeklySummary.avgSteps.toLocaleString() 
                  : activeTab === 'calories' 
                    ? weeklySummary.avgCalories.toLocaleString() 
                    : weeklySummary.avgActiveMinutes}
              </p>
              <span className="text-xs font-medium ml-1.5 text-gray-500 dark:text-gray-400">/ day</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-auto">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <span>Daily Goal Progress</span>
                <span className="font-medium">
                  {Math.round((
                    activeTab === 'steps' 
                      ? weeklySummary.avgSteps / (weeklySummary.dailyStepGoal || 10000)
                      : activeTab === 'calories'
                        ? weeklySummary.avgCalories / (weeklySummary.dailyCalorieGoal || 500)
                        : weeklySummary.avgActiveMinutes / (weeklySummary.dailyActiveGoal || 60)
                  ) * 100)}%
                </span>
              </div>
              
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(to right, ${COLORS[activeTab].gradient[0]}, ${COLORS[activeTab].gradient[1]})`,
                    width: `${Math.min(100, Math.round((
                      activeTab === 'steps' 
                        ? weeklySummary.avgSteps / (weeklySummary.dailyStepGoal || 10000)
                        : activeTab === 'calories'
                          ? weeklySummary.avgCalories / (weeklySummary.dailyCalorieGoal || 500)
                          : weeklySummary.avgActiveMinutes / (weeklySummary.dailyActiveGoal || 60)
                    ) * 100))}%`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.round((
                    activeTab === 'steps' 
                      ? weeklySummary.avgSteps / (weeklySummary.dailyStepGoal || 10000)
                      : activeTab === 'calories'
                        ? weeklySummary.avgCalories / (weeklySummary.dailyCalorieGoal || 500)
                        : weeklySummary.avgActiveMinutes / (weeklySummary.dailyActiveGoal || 60)
                  ) * 100))}%` }}
                  transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Highest Day Card */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            className="relative p-5 rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white/90 to-white/40 dark:from-gray-800/90 dark:to-gray-800/40 border border-gray-200/60 dark:border-gray-700/40 shadow-lg transition-all"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-xl" 
                 style={{ background: `radial-gradient(circle, ${COLORS[activeTab].fill}, transparent)` }} />
            
            <div className="flex justify-between items-start mb-3">
              {/* Icon with trophy */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${activeProps.bgLight} ${activeProps.bgDark} bg-opacity-70 p-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                     className={`w-full h-full ${activeProps.color}`}>
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
              
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100/70 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                Peak Performance
              </span>
            </div>
            
            <h3 className={`text-sm ${activeProps.color} font-medium uppercase tracking-wider mt-2`}>
              Highest Day
            </h3>
            
            {(() => {
              try {
                const dataKey = activeProps.dataKey;
                const values = cleanedData.map(day => day[dataKey] || 0);
                const maxVal = Math.max(...values);
                const maxDay = cleanedData.find(day => day[dataKey] === maxVal) || cleanedData[0];
                const percentOfGoal = Math.round((maxVal / activeProps.dailyGoal) * 100);
                
                return (
                  <>
                    <div className="flex items-baseline mt-1 mb-2">
                      <p className={`text-2xl md:text-3xl font-bold ${activeProps.color} tracking-tight`}>
                        {maxVal.toLocaleString()}
                      </p>
                      <span className="text-sm font-medium ml-2 text-gray-700 dark:text-gray-300">
                        on {maxDay.name}
                      </span>
                    </div>
                    
                    {/* Mini bar chart showing day comparison */}
                    <div className="mt-3 pt-2 border-t border-gray-200/50 dark:border-gray-700/30">
                      <div className="flex h-12 items-end justify-between gap-1">
                        {cleanedData.map((day, idx) => {
                          const value = day[dataKey] || 0;
                          const percent = Math.max(10, (value / maxVal) * 100);
                          const isMaxDay = value === maxVal;
                          
                          return (
                            <motion.div 
                              key={day.name}
                              className={`w-1/7 rounded-t flex flex-col items-center`}
                              initial={{ height: 0 }}
                              animate={{ height: `${percent}%` }}
                              transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                              <div 
                                className={`w-full rounded-t ${isMaxDay 
                                  ? `bg-gradient-to-t from-${COLORS[activeTab].gradient[0]} to-${COLORS[activeTab].gradient[1]}` 
                                  : 'bg-gray-200 dark:bg-gray-700'}`} 
                                style={{ height: '100%' }}
                              />
                              <span className="text-[9px] mt-1 text-gray-500">{day.name[0]}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              } catch (err) {
                return (
                  <p className="text-gray-500 dark:text-gray-400">Not available</p>
                );
              }
            })()}
          </motion.div>
          
          {/* Weekly Progress Card */}
          <motion.div 
            whileHover={{ 
              y: -4, 
              scale: 1.02,
              rotate: isPositiveProgress ? -0.5 : 0.5,
              transition: { type: "spring", stiffness: 300 } 
            }}
            className={`relative p-5 rounded-xl overflow-hidden backdrop-blur-sm border shadow-lg transition-all
              ${isPositiveProgress 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50/70 dark:from-green-900/30 dark:to-emerald-900/20 border-green-200/60 dark:border-green-800/40' 
                : 'bg-gradient-to-br from-red-50 to-rose-50/70 dark:from-red-900/30 dark:to-rose-900/20 border-red-200/60 dark:border-red-800/40'}`}
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl" 
                 style={{ background: `radial-gradient(circle, ${isPositiveProgress ? '#22c55e' : '#ef4444'}, transparent)` }} />
            
            <div className="flex justify-between items-start mb-3">
              {/* Icon with background */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg 
                ${isPositiveProgress 
                  ? 'bg-green-100/70 dark:bg-green-900/50' 
                  : 'bg-red-100/70 dark:bg-red-900/50'} p-2`}>
                <ProgressIcon className={`w-full h-full ${
                  isPositiveProgress ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`} />
              </div>
              
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/70 dark:bg-[#17171D]/50 text-gray-500 dark:text-gray-400">
                7 Day Trend
              </span>
            </div>
            
            <h3 className={`text-sm font-medium uppercase tracking-wider mt-2 ${
              isPositiveProgress ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              Weekly Trend
            </h3>
            
            <div className="flex items-center mt-1 mb-3 gap-2">
              <p className={`text-2xl md:text-3xl font-bold tracking-tight ${
                isPositiveProgress ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
              }`}>
                {isPositiveProgress ? '+' : ''}{weeklySummary.progressVsLastWeek}%
              </p>
              <span className={`text-xs font-medium ${
                isPositiveProgress ? 'text-green-700/60 dark:text-green-400/60' : 'text-red-700/60 dark:text-red-400/60'
              }`}>
                vs last week
              </span>
            </div>
            
            {/* Trend visualization */}
            <div className="mt-3 relative h-14">
              <div className="absolute top-1/2 w-full h-px bg-gray-300/50 dark:bg-gray-600/50"></div>
              
              <svg className="h-full w-full" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={isPositiveProgress ? '#22c55e80' : '#ef444480'} />
                    <stop offset="100%" stopColor={isPositiveProgress ? '#10b98180' : '#f4365480'} />
                  </linearGradient>
                </defs>
                
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d={isPositiveProgress 
                    ? "M0,25 Q20,23 30,18 T60,15 T100,5" 
                    : "M0,15 Q25,20 40,15 T70,25 T100,20"}
                  fill="none"
                  stroke="url(#trendGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                
                {/* Data points */}
                {[0, 25, 50, 75, 100].map((x, i) => (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={isPositiveProgress 
                      ? 25 - (i * 5) 
                      : 15 + ((i % 3) * 5) - ((i > 2) ? 10 : 0)}
                    r="2"
                    fill={isPositiveProgress ? '#10b981' : '#f43654'}
                    initial={{ r: 0 }}
                    animate={{ r: i === 4 ? 3 : 2 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
              </svg>
            </div>
            
            <p className={`text-xs text-center mt-1 ${
              isPositiveProgress ? 'text-green-700/70 dark:text-green-400/70' : 'text-red-700/70 dark:text-red-400/70'
            }`}>
              {isPositiveProgress 
                ? 'Keep up the great work!' 
                : 'Don\'t worry - small setbacks happen'}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WeeklyActivitySection;