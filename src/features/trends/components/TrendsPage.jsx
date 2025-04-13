import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine
} from 'recharts';
import { 
  TrendingUp, Calendar, Filter, Clock, ArrowRight, Trophy, 
  ArrowUp, ArrowDown, Activity, Heart, Zap, 
  Droplet, Dumbbell, Moon, Square, User, MoreHorizontal
} from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import MetricSelector from './MetricSelector';
import TimeframeSelector from './TimeframeSelector';
import CalendarActivityHeatmap from './CalendarActivityHeatmap';
import TrendInsightsCard from './TrendInsightsCard';
import MetricComparisonCard from './MetricComparisonCard';
import TrendCorrelationMatrix from './TrendCorrelationMatrix';

// Mock data - in a real app this would come from Redux
const generateMockData = (days, metric) => {
  const today = new Date();
  const data = [];

  // Base patterns
  const patterns = {
    steps: { base: 9000, variance: 3500, weekendDrop: 0.7, trend: 30 },
    calories: { base: 2400, variance: 800, weekendDrop: 0.9, trend: 10 },
    active: { base: 55, variance: 25, weekendDrop: 0.75, trend: 0.2 },
    sleep: { base: 7.5, variance: 1.2, weekendDrop: 1.1, trend: -0.01 },
    heart: { base: 62, variance: 5, weekendDrop: 0.95, trend: -0.05 },
  };

  const pattern = patterns[metric] || patterns.steps;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (days - 1) + i);
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Create realistic patterns with upward/downward trends
    let value = pattern.base + (Math.random() * 2 - 1) * pattern.variance;
    
    // Add weekend variation
    if (isWeekend) value *= pattern.weekendDrop;
    
    // Add subtle upward/downward trend over time
    value += i * pattern.trend;
    
    // Add some spikes and valleys
    if (Math.random() > 0.9) value *= 1.4;
    if (Math.random() > 0.95) value *= 0.6;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10,
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Calculate stats for the data
const calculateStats = (data, metric) => {
  if (!data.length) return {};
  
  const values = data.map(item => item.value);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = Math.round((total / values.length) * 10) / 10;
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  const maxDay = data.find(item => item.value === max);
  const minDay = data.find(item => item.value === min);
  
  const weekAgo = data.length >= 7 ? data[data.length - 7].value : 0;
  const monthAgo = data.length >= 30 ? data[data.length - 30].value : 0;
  const changeWeek = weekAgo ? Math.round(((average - weekAgo) / weekAgo) * 1000) / 10 : 0;
  const changeMonth = monthAgo ? Math.round(((average - monthAgo) / monthAgo) * 1000) / 10 : 0;
  
  // Calculate streak: consecutive days above goal threshold based on metric
  let streak = 0;
  let goalThresholds = {
    steps: 8000,
    calories: 2200,
    active: 45,
    sleep: 7,
    heart: 65 // In this case, below this threshold is good
  };
  let threshold = goalThresholds[metric] || 0;
  
  for (let i = data.length - 1; i >= 0; i--) {
    if ((metric === 'heart' && data[i].value <= threshold) || 
        (metric !== 'heart' && data[i].value >= threshold)) {
      streak++;
    } else {
      break;
    }
  }
  
  return {
    total: Math.round(total),
    average,
    max,
    min,
    maxDay,
    minDay,
    changeWeek,
    changeMonth,
    streak
  };
};

// Determine which chart type is best for the current metric
const getChartTypeForMetric = (metric) => {
  const chartTypes = {
    steps: 'bar',
    calories: 'bar',
    active: 'bar',
    sleep: 'line',
    heart: 'area',
    default: 'line'
  };
  
  return chartTypes[metric] || chartTypes.default;
};

// Get color scheme for the current metric
const getColorForMetric = (metric) => {
  const colors = {
    steps: { main: '#3b82f6', gradient: ['#93c5fd', '#3b82f6'] },
    calories: { main: '#ef4444', gradient: ['#fca5a5', '#ef4444'] },
    active: { main: '#10b981', gradient: ['#6ee7b7', '#10b981'] },
    sleep: { main: '#8b5cf6', gradient: ['#c4b5fd', '#8b5cf6'] },
    heart: { main: '#f97316', gradient: ['#fdba74', '#f97316'] },
    default: { main: '#6366f1', gradient: ['#a5b4fc', '#6366f1'] }
  };
  
  return colors[metric] || colors.default;
};

// Get the appropriate icon for a metric
const getIconForMetric = (metric) => {
  const icons = {
    steps: <Activity className="h-5 w-5" />,
    calories: <Zap className="h-5 w-5" />,
    active: <Dumbbell className="h-5 w-5" />,
    sleep: <Moon className="h-5 w-5" />,
    heart: <Heart className="h-5 w-5" />,
    water: <Droplet className="h-5 w-5" />,
    default: <TrendingUp className="h-5 w-5" />
  };
  
  return icons[metric] || icons.default;
};

// Get unit for the metric
const getUnitForMetric = (metric) => {
  const units = {
    steps: 'steps',
    calories: 'kcal',
    active: 'min',
    sleep: 'hrs',
    heart: 'bpm',
    default: ''
  };
  
  return units[metric] || units.default;
};

const TrendsPage = () => {
  // State for filters and selections
  const [activeTimeframe, setActiveTimeframe] = useState('month');
  const [activeMetric, setActiveMetric] = useState('steps');
  const [activePeriod, setActivePeriod] = useState('all');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [secondaryMetric, setSecondaryMetric] = useState(null);
  const [showCorrelations, setShowCorrelations] = useState(false);
  
  // Generate data based on timeframe
  const getDaysForTimeframe = () => {
    switch (activeTimeframe) {
      case 'week': return 7;
      case 'month': return 30;
      case '3month': return 90;
      case '6month': return 180;
      case 'year': return 365;
      default: return 30;
    }
  };
  
  const days = getDaysForTimeframe();
  const data = generateMockData(days, activeMetric);
  const secondaryData = secondaryMetric ? generateMockData(days, secondaryMetric) : [];
  const stats = calculateStats(data, activeMetric);
  
  // Preferred chart type for this metric
  const chartType = getChartTypeForMetric(activeMetric);
  const colorScheme = getColorForMetric(activeMetric);
  const secondaryColorScheme = secondaryMetric ? getColorForMetric(secondaryMetric) : null;
  
  // Generate automatic insights based on the data
  const generateInsights = () => {
    const insights = [];
    
    if (stats.changeWeek > 5) {
      insights.push({
        title: `Impressive Improvement`,
        description: `Your ${activeMetric} are up ${stats.changeWeek}% from last week. Keep up the momentum!`,
        icon: <TrendingUp className="text-emerald-500" />,
        type: 'positive'
      });
    } else if (stats.changeWeek < -5) {
      insights.push({
        title: `Declining Trend`,
        description: `Your ${activeMetric} are down ${Math.abs(stats.changeWeek)}% from last week. Let's get back on track!`,
        icon: <ArrowDown className="text-rose-500" />,
        type: 'negative'
      });
    }
    
    if (stats.streak >= 3) {
      insights.push({
        title: `${stats.streak}-Day Streak!`,
        description: `You've reached your ${activeMetric} goal ${stats.streak} days in a row. Impressive consistency!`,
        icon: <Zap className="text-amber-500" />,
        type: 'positive'
      });
    }
    
    // Pattern detection
    let weekdayAvg = 0;
    let weekendAvg = 0;
    let weekdayCount = 0;
    let weekendCount = 0;
    
    data.forEach(day => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendAvg += day.value;
        weekendCount++;
      } else {
        weekdayAvg += day.value;
        weekdayCount++;
      }
    });
    
    weekdayAvg = weekdayAvg / (weekdayCount || 1);
    weekendAvg = weekendAvg / (weekendCount || 1);
    
    if (weekdayAvg > weekendAvg * 1.25) {
      insights.push({
        title: `Weekend Drop`,
        description: `Your ${activeMetric} drop by ${Math.round((weekdayAvg-weekendAvg)/weekdayAvg*100)}% on weekends. Consider scheduling weekend activities.`,
        icon: <Calendar className="text-blue-500" />,
        type: 'info'
      });
    }
    
    return insights.slice(0, 3); // Return top 3 insights
  };
  
  const insights = generateInsights();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section with Overview and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
            Fitness Trends
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visual analytics to optimize your performance
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            variant={comparisonMode ? "default" : "outline"} 
            size="sm"
            onClick={() => setComparisonMode(!comparisonMode)}
            className="flex items-center"
          >
            <Square className="h-4 w-4 mr-2" />
            Compare Metrics
          </Button>
          
          <Button 
            variant={showCorrelations ? "default" : "outline"} 
            size="sm"
            onClick={() => setShowCorrelations(!showCorrelations)}
            className="flex items-center"
          >
            <Activity className="h-4 w-4 mr-2" />
            Correlations
          </Button>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="p-2 bg-white dark:bg-gray-800/40 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <MetricSelector
              activeMetric={activeMetric}
              setActiveMetric={setActiveMetric}
              secondaryMetric={secondaryMetric}
              setSecondaryMetric={setSecondaryMetric}
              comparisonMode={comparisonMode}
            />
          </div>
          
          <TimeframeSelector
            activeTimeframe={activeTimeframe}
            setActiveTimeframe={setActiveTimeframe}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Chart Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800/40 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${colorScheme.main}/10`}>
                  {getIconForMetric(activeMetric)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Trend
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeTimeframe === 'week' ? 'Last 7 days' : 
                     activeTimeframe === 'month' ? 'Last 30 days' :
                     activeTimeframe === '3month' ? 'Last 3 months' :
                     activeTimeframe === '6month' ? 'Last 6 months' : 'Last 12 months'}
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' && (
                  <BarChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                      interval={Math.floor(data.length / 10)}
                    />
                    <YAxis 
                      tick={{fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                      unit={` ${getUnitForMetric(activeMetric)}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(229, 231, 235, 0.5)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={`url(#${activeMetric}Gradient)`} 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={70}
                    />
                    
                    {comparisonMode && secondaryMetric && (
                      <Bar
                        dataKey="secondaryValue"
                        fill={`url(#${secondaryMetric}Gradient)`}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={70}
                      />
                    )}
                    
                    {/* Dynamic gradient definitions */}
                    <defs>
                      <linearGradient id={`${activeMetric}Gradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colorScheme.gradient[0]} stopOpacity={1} />
                        <stop offset="100%" stopColor={colorScheme.gradient[1]} stopOpacity={1} />
                      </linearGradient>
                      {secondaryMetric && (
                        <linearGradient id={`${secondaryMetric}Gradient`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={secondaryColorScheme.gradient[0]} stopOpacity={1} />
                          <stop offset="100%" stopColor={secondaryColorScheme.gradient[1]} stopOpacity={1} />
                        </linearGradient>
                      )}
                    </defs>
                    
                    {/* Goal reference line if applicable */}
                    <ReferenceLine 
                      y={
                        activeMetric === 'steps' ? 10000 :
                        activeMetric === 'calories' ? 2500 :
                        activeMetric === 'active' ? 60 :
                        activeMetric === 'sleep' ? 8 : null
                      } 
                      stroke="#8884d8" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: 'Goal', 
                        position: 'insideTopRight',
                        fill: '#8884d8',
                        fontSize: 12
                      }}
                    />
                  </BarChart>
                )}
                
                {chartType === 'line' && (
                  <LineChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                      interval={Math.floor(data.length / 10)}
                    />
                    <YAxis 
                      tick={{fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                      unit={` ${getUnitForMetric(activeMetric)}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(229, 231, 235, 0.5)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={colorScheme.main}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{r: 6, fill: colorScheme.main}}
                    />
                    
                    {comparisonMode && secondaryMetric && (
                      <Line
                        type="monotone"
                        dataKey="secondaryValue"
                        stroke={secondaryColorScheme.main}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{r: 6, fill: secondaryColorScheme.main}}
                      />
                    )}
                    
                    {/* Goal reference line if applicable */}
                    <ReferenceLine 
                      y={
                        activeMetric === 'sleep' ? 8 : null
                      } 
                      stroke="#8884d8" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: 'Goal', 
                        position: 'insideTopRight',
                        fill: '#8884d8',
                        fontSize: 12
                      }}
                    />
                  </LineChart>
                )}
                
                {chartType === 'area' && (
                  <AreaChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                      interval={Math.floor(data.length / 10)}
                    />
                    <YAxis 
                      tick={{fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                      unit={` ${getUnitForMetric(activeMetric)}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(229, 231, 235, 0.5)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={colorScheme.main}
                      fill={`url(#${activeMetric}AreaGradient)`}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{r: 6, fill: colorScheme.main}}
                    />
                    
                    {comparisonMode && secondaryMetric && (
                      <Area
                        type="monotone"
                        dataKey="secondaryValue"
                        stroke={secondaryColorScheme.main}
                        fill={`url(#${secondaryMetric}AreaGradient)`}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{r: 6, fill: secondaryColorScheme.main}}
                      />
                    )}
                    
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id={`${activeMetric}AreaGradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colorScheme.gradient[0]} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={colorScheme.gradient[1]} stopOpacity={0.1} />
                      </linearGradient>
                      {secondaryMetric && (
                        <linearGradient id={`${secondaryMetric}AreaGradient`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={secondaryColorScheme.gradient[0]} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={secondaryColorScheme.gradient[1]} stopOpacity={0.1} />
                        </linearGradient>
                      )}
                    </defs>
                    
                    {/* Goal reference line if applicable */}
                    <ReferenceLine 
                      y={activeMetric === 'heart' ? 70 : null} 
                      stroke="#8884d8" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: 'Target', 
                        position: 'insideTopRight',
                        fill: '#8884d8',
                        fontSize: 12
                      }}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
            
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Average</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.average} <span className="text-xs text-gray-500">{getUnitForMetric(activeMetric)}</span>
                </p>
                <div className={`flex items-center mt-1 text-sm ${stats.changeWeek >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {stats.changeWeek >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {Math.abs(stats.changeWeek)}% vs last week
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total} <span className="text-xs text-gray-500">{getUnitForMetric(activeMetric)}</span>
                </p>
                <div className="text-sm text-gray-500 mt-1">Over last {data.length} days</div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Peak</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.max} <span className="text-xs text-gray-500">{getUnitForMetric(activeMetric)}</span>
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  on {stats.maxDay?.formattedDate}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Streak</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.streak} <span className="text-xs text-gray-500">days</span>
                </p>
                <div className="text-sm text-gray-500 mt-1">Current goal streak</div>
              </div>
            </div>
          </motion.div>
          
          {/* Calendar Heatmap */}
          <motion.div
            className="bg-white dark:bg-gray-800/40 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Activity Calendar
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <CalendarActivityHeatmap 
              data={data} 
              metric={activeMetric} 
              colorScheme={colorScheme}
            />
          </motion.div>
          
          {/* Correlation Matrix (conditional) */}
          {showCorrelations && (
            <motion.div
              className="bg-white dark:bg-gray-800/40 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Metric Correlations
                  </h2>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <TrendCorrelationMatrix activeMetric={activeMetric} />
            </motion.div>
          )}
        </div>
        
        {/* Right Column - Insights and Analysis */}
        <div className="lg:col-span-4 space-y-6">
          {/* Insights Card */}
          <motion.div
            className="bg-white dark:bg-gray-800/40 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 pb-2">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Smart Insights
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                AI-generated insights from your data
              </p>
            </div>
            
            <div className="px-2">
              {insights.map((insight, index) => (
                <TrendInsightsCard key={index} insight={insight} />
              ))}
              
              {insights.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No significant insights found in this timeframe
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Metric Comparison Cards (if in comparison mode) */}
          {comparisonMode && secondaryMetric && (
            <motion.div
              className="bg-white dark:bg-gray-800/40 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-6 pb-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Metric Comparison
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Analyzing relationships between metrics
                </p>
              </div>
              
              <MetricComparisonCard 
                primaryMetric={activeMetric} 
                secondaryMetric={secondaryMetric}
                primaryColor={colorScheme.main}
                secondaryColor={secondaryColorScheme.main}
              />
            </motion.div>
          )}
          
          {/* Recent Records */}
          <motion.div
            className="bg-white dark:bg-gray-800/40 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Recent Records
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-medium">Highest Steps</p>
                  </div>
                  <p className="text-sm font-bold">
                    {stats.max} steps
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.maxDay?.formattedDate}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-medium">Best Week</p>
                  </div>
                  <p className="text-sm font-bold">
                    14,237 pts
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Apr 1 - Apr 7, 2025
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-emerald-500" />
                    <p className="text-sm font-medium">Longest Workout</p>
                  </div>
                  <p className="text-sm font-bold">
                    78 mins
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Apr 8, 2025
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All Records
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;