import React from 'react';
import { Card } from "@/components/ui/card"; 
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Droplet, Activity, Heart } from 'lucide-react';

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
    scale: 1.012, // Reduced scale effect for smaller cards
    transition: { type: "spring", stiffness: 400, damping: 20 }
  }
};

// Content animation for staggered child elements
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Slightly faster staggering for smaller cards
      delayChildren: 0.05
    }
  }
};

// Child element animations 
const itemVariants = {
  hidden: { opacity: 0, y: 6 }, // Reduced y-offset for smaller cards
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" } // Slightly faster animation
  }
};

function TopSummarySection() {
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

  // Refined and Enhanced Metric Card - now more compact
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
      className="w-full max-w-[260px] mx-auto" // Added max-width and margin auto
    >
      <Card 
        className={`relative overflow-hidden p-4 h-[140px] flex flex-col items-center justify-between 
          border border-gray-100 dark:border-gray-800/60 rounded-xl
          bg-white dark:bg-gray-900
          transition-all duration-300 ease-out
          ${customIndex === 0 ? 'shadow-[0px_3px_12px_rgba(229,62,62,0.06)]' : 
            customIndex === 1 ? 'shadow-[0px_3px_12px_rgba(49,130,206,0.06)]' :
            customIndex === 2 ? 'shadow-[0px_3px_12px_rgba(56,161,105,0.06)]' : 
            'shadow-[0px_3px_12px_rgba(213,63,140,0.06)]'
          }
          dark:shadow-[0px_3px_18px_rgba(0,0,0,0.2)]`} // Reduced shadow sizes
        aria-label={`${label} metric`}
        role="region"
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBzdHJva2Utd2lkdGg9IjAiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />

        {/* Background gradient glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-[0.07] dark:opacity-[0.15] blur-2xl`}></div>
        
        {/* Content with staggered animations */}
        <motion.div className="relative z-10 flex flex-col items-center w-full" variants={contentVariants}>
          {/* Top Icon with enhanced container - smaller size */}
          <motion.div 
            className={`flex justify-center items-center w-10 h-10 rounded-full 
              ${color} bg-opacity-10 dark:bg-opacity-20 
              backdrop-blur-md backdrop-saturate-150
              border border-white/10 dark:border-white/5
              shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2)]`} // Reduced from w-12 h-12
            variants={itemVariants}
            animate={iconAnimation || {}}
          >
            <Icon className={`w-5 h-5 ${color}`} /> {/* Reduced from w-6 h-6 */}
          </motion.div>
          
          {/* Value and Unit with refined typography - smaller size */}
          <motion.div className="flex flex-col items-center mt-2" variants={itemVariants}> {/* Reduced from mt-3 */}
            <span 
              className={`text-3xl font-extrabold tracking-tight 
                bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 
                bg-clip-text text-transparent`} // Reduced from text-4xl
            >
              {value}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 -mt-0.5"> {/* Reduced from text-sm */}
              {unit}
            </span>
          </motion.div>
          
          {/* Label and Status - compact spacing */}
          <div className="flex flex-col items-center mt-1.5"> {/* Reduced from mt-2 */}
            <motion.span 
              className="text-xs font-medium text-gray-700 dark:text-gray-300" // Reduced from text-sm
              variants={itemVariants}
            >
              {label}
            </motion.span>
            
            {/* Status indicator (new) - smaller text */}
            <motion.div 
              className={`text-[10px] font-medium mt-0.5 ${status.color}`} // Reduced from text-xs and mt-1
              variants={itemVariants}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + (customIndex * 0.1) }} // Slightly faster appearance
            >
              {status.text}
            </motion.div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );

  // Use a prefers-reduced-motion media query to respect user preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return (
    // 4-column grid with reduced gap and max-width constraint
    <section 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto" // Reduced gap-5 to gap-4, added max-width
      aria-label="Health Metrics Summary"
    >
      {/* Heart Rate Card with premium styling */}
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
      
      {/* Hydration Card with droplet animation */}
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
      
      {/* Distance Card with activity line animation */}
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
      
      {/* Resting Heart Rate Card */}
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
    </section>
  );
}

export default TopSummarySection;