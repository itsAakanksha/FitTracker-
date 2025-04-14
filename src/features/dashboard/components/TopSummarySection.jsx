import React, { useRef, useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"; 
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Droplet, Activity, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Advanced Animation Variants with Coordinated Timing ---
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.08, 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1],
    }
  }),
  hover: {
    scale: 1.02,
    y: -4,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// Content animation for staggered child elements
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

// Child element animations 
const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};

function TopSummarySection() {
  // State to track the active card index
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  // Ref for swipe container
  const swipeContainerRef = useRef(null);
  
  // Expanded dataset with added dynamic status indicators
  const metrics = {
    heartRate: { 
      value: 72, 
      unit: "bpm", 
      label: "Heart Rate",
      status: { text: "Normal", color: "text-emerald-500 dark:text-emerald-400" } 
    },
    hydration: { 
      value: 86, 
      unit: "%", 
      label: "Hydration Level",
      status: { text: "Good", color: "text-blue-500 dark:text-blue-400" } 
    },
    distance: { 
      value: 20.5, 
      unit: "km", 
      label: "Total Distance",
      status: { text: "+2.3 today", color: "text-green-500 dark:text-green-400" } 
    },
    restingHr: { 
      value: 65, 
      unit: "bpm", 
      label: "Resting Heart Rate",
      status: { text: "Optimal", color: "text-purple-500 dark:text-purple-400" } 
    }
  };

  // Enhanced Motion Animations (Performance-conscious using transform properties)
  const pulseAnimation = {
    scale: [1, 1.15, 1],
    opacity: [0.7, 1, 0.7],
    transition: { 
      duration: 1.5, 
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.5, 1]
    }
  };

  const dropletsAnimation = {
    y: [0, -3, 0],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const activityAnimation = {
    pathLength: [0.3, 1, 0.3],
    transition: { 
      duration: 2.5, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Refined and Enhanced Metric Card with responsive sizing
  const MetricCard = ({ 
    icon: Icon, 
    value, 
    unit, 
    label, 
    color, 
    bgColor,
    customIndex, 
    iconAnimation,
    status
  }) => (
    <motion.div 
      custom={customIndex} 
      initial="hidden" 
      animate="visible" 
      whileHover="hover" 
      variants={cardVariants}
      className="flex-shrink-0 w-[85vw] xs:w-[75vw] sm:w-full sm:max-w-none "
    >
      <Card 
        className={`relative overflow-hidden px-5 py-4 h-[130px] flex flex-col items-center justify-between 
          border border-gray-100 dark:border-gray-800/60 rounded-xl
          bg-white dark:bg-[#17171D]
          transition-all duration-300 ease-out
          ${customIndex === 0 ? 'shadow-[0px_3px_12px_rgba(229,62,62,0.06)]' : 
            customIndex === 1 ? 'shadow-[0px_3px_12px_rgba(49,130,206,0.06)]' :
            customIndex === 2 ? 'shadow-[0px_3px_12px_rgba(56,161,105,0.06)]' : 
            'shadow-[0px_3px_12px_rgba(213,63,140,0.06)]'
          }
          dark:shadow-[0px_4px_20px_rgba(0,0,0,0.25)]`}
        aria-label={`${label} metric`}
        role="region"
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBzdHJva2Utd2lkdGg9IjAiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />

        {/* Enhanced background gradient glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-[0.1] dark:opacity-[0.2] blur-2xl`}></div>
        
        {/* Content with staggered animations */}
        <motion.div className="relative z-10 flex flex-col items-center w-full h-full justify-between" variants={contentVariants}>
          {/* Top Row - Icon and Status */}
          <div className="flex items-center justify-between w-full">
            {/* Icon with enhanced container */}
            <motion.div 
              className={`flex justify-center items-center w-10 h-10 rounded-full 
                ${color} bg-opacity-15 dark:bg-opacity-25 
                backdrop-blur-md backdrop-saturate-150
                border border-white/20 dark:border-white/10
                shadow-[0px_2px_8px_rgba(0,0,0,0.06)]`}
              variants={itemVariants}
              animate={iconAnimation || {}}
            >
              <Icon className={`w-[18px] h-[18px] ${color}`} strokeWidth={2.5} />
            </motion.div>
            
            {/* Status indicator pill */}
            <motion.div 
              className={`text-[10px] font-semibold rounded-full px-2.5 py-1 ${status.color} bg-gray-50 dark:bg-gray-800/60`} 
              variants={itemVariants}
            >
              {status.text}
            </motion.div>
          </div>
          
          {/* Center - The main metric value with improved layout */}
          <motion.div 
            className="flex flex-col items-center justify-center text-center my-auto" 
            variants={itemVariants}
          >
            <div className="flex items-baseline justify-center">
              <span 
                className={`text-3xl font-extrabold tracking-tight 
                  bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 
                  bg-clip-text text-transparent`}
              >
                {value}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1.5">
                {unit}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2">
              {label}
            </span>
          </motion.div>
          
          {/* Bottom spacer to balance the layout */}
          <div className="h-1"></div>
        </motion.div>
      </Card>
    </motion.div>
  );

  // Use a prefers-reduced-motion media query to respect user preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Handle card click to update active index (for mobile view)
  const handleCardClick = (index) => {
    setActiveCardIndex(index);
  };

  // Optimized variant for card animation on swipe with faster transitions
  const swipeVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  // Track swipe direction
  const [[page, direction], setPage] = useState([0, 0]);

  // Handle swipe to next/prev card
  const paginate = (newDirection) => {
    // Calculate new index
    let newIndex = activeCardIndex + newDirection;
    
    // Handle boundary conditions
    if (newIndex < 0) newIndex = Object.values(metrics).length - 1;
    if (newIndex >= Object.values(metrics).length) newIndex = 0;
    
    setPage([newIndex, newDirection]);
    setActiveCardIndex(newIndex);
  };

  // Setup optimized swipe handlers with improved performance
  useEffect(() => {
    const container = swipeContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let startTime = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      startTime = Date.now();
    };
    
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      handleSwipe(timeDiff);
    };
    
    const handleSwipe = (swipeTime) => {
      const distance = touchEndX - touchStartX;
      const swipeThreshold = swipeTime < 250 ? 30 : 50; // Lower threshold for quick swipes
      
      // Detect swipe direction and paginate if threshold exceeded
      if (distance < -swipeThreshold) {
        // Swipe left (next)
        paginate(1);
      } else if (distance > swipeThreshold) {
        // Swipe right (previous)
        paginate(-1);
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [activeCardIndex]);
  
  return (
    <div className="relative">
      {/* Section Title */}
      <div className="flex justify-between items-center mb-3 px-1 sm:px-0">
        <h2 className="text-md font-medium text-gray-700 dark:text-gray-300">Today's Health Stats</h2>
      </div>
      
      {/* Display only the active card on mobile, grid on larger screens */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pb-2">
        {/* Heart Rate Card with premium styling */}
        <div>
          <MetricCard
            icon={HeartPulse}
            value={metrics.heartRate.value}
            unit={metrics.heartRate.unit}
            label={metrics.heartRate.label}
            color="text-red-500 dark:text-red-400"
            bgColor="from-red-500/30 to-rose-500/10"
            customIndex={0}
            iconAnimation={!prefersReducedMotion ? pulseAnimation : undefined}
            status={metrics.heartRate.status}
          />
        </div>
        
        {/* Hydration Card with droplet animation */}
        <div>
          <MetricCard
            icon={Droplet}
            value={metrics.hydration.value}
            unit={metrics.hydration.unit}
            label={metrics.hydration.label}
            color="text-blue-500 dark:text-blue-400"
            bgColor="from-blue-500/30 to-sky-500/10"
            customIndex={1}
            iconAnimation={!prefersReducedMotion ? dropletsAnimation : undefined}
            status={metrics.hydration.status}
          />
        </div>
        
        {/* Distance Card with activity line animation */}
        <div>
          <MetricCard
            icon={Activity}
            value={metrics.distance.value}
            unit={metrics.distance.unit}
            label={metrics.distance.label}
            color="text-green-500 dark:text-green-400"
            bgColor="from-green-500/30 to-emerald-500/10"
            customIndex={2}
            iconAnimation={!prefersReducedMotion ? activityAnimation : undefined}
            status={metrics.distance.status}
          />
        </div>
        
        {/* Resting Heart Rate Card */}
        <div>
          <MetricCard
            icon={Heart}
            value={metrics.restingHr.value}
            unit={metrics.restingHr.unit}
            label={metrics.restingHr.label}
            color="text-fuchsia-500 dark:text-fuchsia-400"
            bgColor="from-fuchsia-500/30 to-purple-500/10"
            customIndex={3}
            status={metrics.restingHr.status}
          />
        </div>
      </div>
      
      {/* Mobile swipeable view with improved performance and no arrows */}
      <div className="block sm:hidden pb-2">
        <div 
          ref={swipeContainerRef}
          className="w-full overflow-hidden touch-pan-y touch-pan-x"
        >
          <div className="flex justify-center items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeCardIndex}
                custom={direction}
                variants={swipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 400, damping: 25 }, // Faster spring
                  opacity: { duration: 0.15 } // Faster fade
                }}
                className="w-full flex justify-center"
              >
                <MetricCard
                  icon={Object.values(metrics)[activeCardIndex].label === "Heart Rate" ? HeartPulse : 
                        Object.values(metrics)[activeCardIndex].label === "Hydration Level" ? Droplet :
                        Object.values(metrics)[activeCardIndex].label === "Total Distance" ? Activity : Heart}
                  value={Object.values(metrics)[activeCardIndex].value}
                  unit={Object.values(metrics)[activeCardIndex].unit}
                  label={Object.values(metrics)[activeCardIndex].label}
                  color={activeCardIndex === 0 ? "text-red-500 dark:text-red-400" :
                        activeCardIndex === 1 ? "text-blue-500 dark:text-blue-400" :
                        activeCardIndex === 2 ? "text-green-500 dark:text-green-400" :
                        "text-fuchsia-500 dark:text-fuchsia-400"}
                  bgColor={activeCardIndex === 0 ? "from-red-500/30 to-rose-500/10" :
                           activeCardIndex === 1 ? "from-blue-500/30 to-sky-500/10" :
                           activeCardIndex === 2 ? "from-green-500/30 to-emerald-500/10" :
                           "from-fuchsia-500/30 to-purple-500/10"}
                  customIndex={activeCardIndex}
                  iconAnimation={!prefersReducedMotion ? 
                                (activeCardIndex === 0 ? pulseAnimation : 
                                 activeCardIndex === 1 ? dropletsAnimation : 
                                 activeCardIndex === 2 ? activityAnimation : undefined) : 
                                undefined}
                  status={Object.values(metrics)[activeCardIndex].status}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Improved indicator dots */}
      <div className="flex justify-center mt-3 gap-1.5 sm:hidden">
        {[0, 1, 2, 3].map(index => (
          <button 
            key={index}
            onClick={() => {
              setPage([index, index > activeCardIndex ? 1 : -1]);
              setActiveCardIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeCardIndex 
                ? 'w-4 bg-violet-500' 
                : 'w-1.5 bg-gray-300 dark:bg-gray-700'
            }`}
            aria-label={`View ${Object.values(metrics)[index].label} metric`}
          />
        ))}
      </div>
    </div>
  );
}

export default TopSummarySection;