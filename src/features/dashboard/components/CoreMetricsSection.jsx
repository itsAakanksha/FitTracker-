import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from '../../../app/hooks';
import { selectCoreMetrics } from '../dashboardSlice';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Footprints, Flame, Zap, Sparkles } from 'lucide-react';
import { useReducedMotion, useInView } from 'framer-motion';

// Constants for performance and styling - adjusted for smaller size
const SPRING_CONFIG = { stiffness: 100, damping: 15, mass: 0.4 };
const RING_SPRING_CONFIG = { stiffness: 60, damping: 11, mass: 0.3 };
const RING_THICKNESS = 10; // Reduced thickness
const PARTICLES_COUNT = 8; // Reduced particle count for performance

function CoreMetricsSection() {
  const coreMetricsData = useAppSelector(selectCoreMetrics);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  // Map of icon components by ID
  const iconMap = {
    steps: Footprints,
    calories: Flame,
    activeMinutes: Zap
  };

  // Progress Meter Component with Dynamic Gradients
  const CircularProgress = ({ value, goal, color, id, index }) => {
    // Calculate progress percentage with safety checks
    const progress = goal > 0 ? Math.min(Math.max((value / goal) * 100, 0), 100) : 0;
    const isGoalMet = progress >= 100;
    
    // Dynamic colors based on progress
    const getProgressColors = (p) => {
      if (p >= 100) return { start: 'rgb(52, 211, 153)', end: 'rgb(16, 185, 129)', shadow: 'rgba(16, 185, 129, 0.3)' }; // Goal Met: emerald
      if (p >= 80) return { start: 'rgb(74, 222, 128)', end: 'rgb(52, 211, 153)', shadow: 'rgba(52, 211, 153, 0.2)' }; // Near Goal: green
      if (p >= 60) return { start: 'rgb(250, 204, 21)', end: 'rgb(74, 222, 128)', shadow: 'rgba(74, 222, 128, 0.2)' }; // Good Progress: yellow-green
      if (p >= 40) return { start: 'rgb(251, 146, 60)', end: 'rgb(250, 204, 21)', shadow: 'rgba(250, 204, 21, 0.2)' }; // Moderate: orange-yellow
      if (p >= 20) return { start: 'rgb(239, 68, 68)', end: 'rgb(251, 146, 60)', shadow: 'rgba(251, 146, 60, 0.2)' }; // Getting Started: red-orange
      return { start: 'rgb(239, 68, 68)', end: 'rgb(239, 68, 68)', shadow: 'rgba(239, 68, 68, 0.2)' }; // Just Started: red
    };

    const colors = getProgressColors(progress);
    
    // Animation for ring progress
    const progressValue = useMotionValue(0);
    const animatedProgress = useSpring(progressValue, RING_SPRING_CONFIG);
    
    useEffect(() => {
      if (isInView) {
        progressValue.set(prefersReducedMotion ? progress : 0);
        if (!prefersReducedMotion) {
          const timer = setTimeout(() => {
            progressValue.set(progress);
          }, index * 100); // Faster staggering
          return () => clearTimeout(timer);
        }
      }
    }, [isInView, progress, index, prefersReducedMotion]);
    
    // Calculate SVG parameters
    const circumference = 2 * Math.PI * 40; // Reduced radius from 50 to 40
    const strokeDashoffset = useTransform(
      animatedProgress, 
      [0, 100], 
      [circumference, 0]
    );

    // Animation for the value counter
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (!isInView) return;
      
      if (prefersReducedMotion) {
        setDisplayValue(value);
        return;
      }
      
      const duration = 1200; // Reduced duration
      const startTime = Date.now();
      const endValue = value;
      const startValue = 0;
      
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuart(progress);
        setDisplayValue(Math.floor(startValue + (endValue - startValue) * easedProgress));
        
        if (progress >= 1) {
          clearInterval(timer);
        }
      }, 1000/30); // Reduced from 60fps to 30fps for performance
      
      return () => clearInterval(timer);
    }, [isInView, value]);
    
    // Easing function for counter animation
    const easeOutQuart = x => 1 - Math.pow(1 - x, 4);

    return (
      <div className="relative flex flex-col items-center justify-center py-1">
        {/* SVG for ring progress indicator - smaller size */}
        <div className="relative w-20 h-20 md:w-28 md:h-28">
          {/* Base ring (track) */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="var(--track, #e5e7eb)" 
              strokeWidth={RING_THICKNESS} 
              className="opacity-20 dark:opacity-30"
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.start} />
                <stop offset="100%" stopColor={colors.end} />
              </linearGradient>
            </defs>
            
            {/* Animated progress ring */}
            <motion.circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke={`url(#gradient-${id})`} 
              strokeWidth={RING_THICKNESS} 
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
              transform="rotate(-90, 50, 50)"
              className="filter drop-shadow-md"
            />
            
            {/* Icon in center - smaller */}
            <foreignObject x="28" y="28" width="44" height="44">
              <div className="w-full h-full flex items-center justify-center">
                {React.createElement(iconMap[id], { 
                  className: `w-5 h-5 md:w-6 md:h-6 ${color} opacity-80 drop-shadow-sm`,
                  strokeWidth: 2
                })}
              </div>
            </foreignObject>
          </svg>
          
          {/* Goal Celebration - simplified */}
          <AnimatePresence>
            {isGoalMet && !prefersReducedMotion && (
              <div className="absolute inset-0" aria-hidden="true">
                {[...Array(PARTICLES_COUNT)].map((_, i) => (
                  <motion.div
                    key={`particle-${id}-${i}`}
                    className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: i % 2 ? colors.start : colors.end,
                      x: "-50%",
                      y: "-50%"
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0.5],
                      opacity: [1, 0.8, 0],
                      x: ["-50%", `${(Math.random() * 150) - 75}%`],
                      y: ["-50%", `${(Math.random() * 150) - 75}%`]
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.03,
                      ease: "easeOut"
                    }}
                  />
                ))}
                
                {/* Smaller central sparkle */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Value display with kinetic typography - more compact */}
        <div className="mt-1.5 flex flex-col items-center" aria-live="polite">
          <motion.div
            className="relative text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ 
              scale: isGoalMet ? [1, 1.03, 1] : 1, 
              opacity: 1 
            }}
            transition={{ 
              scale: { type: "spring", ...SPRING_CONFIG },
              opacity: { duration: 0.2 }
            }}
          >
            <span>{displayValue.toLocaleString()}</span>
            {/* Smaller floating achievement badge */}
            {isGoalMet && (
              <motion.div
                className="absolute -right-5 -top-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full"
                initial={{ scale: 0, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 10, 
                  delay: 0.2 
                }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>
          
          {/* Goal text - more compact */}
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span>/ {goal.toLocaleString()}</span>
            <motion.span 
              className="inline-block"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="lowercase">{id === 'calories' ? 'kcal' : id}</span>
            </motion.span>
          </div>
          
          {/* Progress percentage - more compact */}
          <motion.div 
            className="text-xs md:text-sm font-medium mt-0.5"
            style={{ 
              color: isGoalMet ? colors.end : 'var(--text-secondary, #6b7280)' 
            }}
          >
            {isGoalMet ? 'Complete!' : `${Math.round(progress)}% of goal`}
          </motion.div>
        </div>
      </div>
    );
  };
  
  return (
    <motion.div 
      ref={sectionRef}
      className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-1"
      initial={{ y: 20, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {coreMetricsData.map((metric, index) => {
        return (
          <motion.div
            key={metric.id}
            whileHover={!prefersReducedMotion ? { y: -2, scale: 1.005 } : {}} 
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Card className="bg-white dark:bg-[#17171D]/90 border border-gray-100 dark:border-gray-700/50 shadow-md hover:shadow-lg overflow-hidden rounded-lg transition-all duration-200">
              <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col items-center">
                <CircularProgress 
                  value={metric.value} 
                  goal={metric.goal}
                  color={metric.color} 
                  id={metric.id}
                  index={index}
                />
                
                {/* Smaller title with simplified animation */}
                <motion.h3 
                  className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 mt-1 md:mt-2 text-center line-clamp-1"
                  initial={{ opacity: 0.8, y: 3 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.08 }}
                >
                  {metric.title}
                </motion.h3>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default CoreMetricsSection;