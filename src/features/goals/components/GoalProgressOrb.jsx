import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';

const Particle = ({ delay, duration, size, color }) => {
  // Convert react-spring particle animation to framer-motion
  const randomPath = () => {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    return { x, y };
  };

  const path = randomPath();
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        top: '50%',
        left: '50%',
        marginTop: -size/2,
        marginLeft: -size/2,
      }}
      initial={{ opacity: 0.7, scale: 1, x: 0, y: 0 }}
      animate={{ opacity: 0, scale: 0, x: path.x, y: path.y }}
      transition={{ 
        duration: duration / 1000, // Convert ms to seconds
        delay: delay / 1000, // Convert ms to seconds
        repeat: Infinity,
        repeatDelay: 0.1
      }}
    />
  );
};

const GoalProgressOrb = ({ progress = 0 }) => {
  const controls = useAnimationControls();
  const progressRef = useRef(progress);
  const animationRef = useRef(null);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  
  // Generate particles based on progress
  const particles = Array.from({ length: Math.min(30, Math.ceil(progress / 3)) }, (_, i) => ({
    id: i,
    delay: i * 100 + Math.random() * 500,
    duration: 2000 + Math.random() * 2000,
    size: 2 + Math.random() * 4,
    color: progressToColor(progress, 0.4)
  }));

  // Pulse effect when progress changes
  useEffect(() => {
    if (progress !== progressRef.current) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
      progressRef.current = progress;
    }
  }, [progress, controls]);

  // Improved progress animation with proper cleanup
  useEffect(() => {
    // Clear any existing animation on re-render
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    const animateProgress = () => {
      const duration = 1.5; // Animation duration in seconds
      const steps = 60; // Total steps to take during animation
      const stepTime = (duration * 1000) / steps; // Time per step in ms
      
      // Reset to 0 when component first mounts to ensure proper animation
      if (displayedProgress > progress) {
        setDisplayedProgress(0);
      }
      
      const increment = (progress - displayedProgress) / steps;
      let currentStep = 0;
      
      animationRef.current = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayedProgress(progress);
          clearInterval(animationRef.current);
          animationRef.current = null;
        } else {
          setDisplayedProgress(prev => {
            const next = prev + increment;
            // Prevent overshooting the target value
            return next > progress ? progress : next;
          });
        }
      }, stepTime);
    };
    
    animateProgress();
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [progress, displayedProgress]);

  return (
    <div className="relative flex justify-center items-center py-8">
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <Particle key={particle.id} {...particle} />
        ))}
      </div>
      
      {/* Main Orb */}
      <motion.div 
        animate={controls}
        className="relative w-48 h-48"
      >
        {/* Background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-30"
          style={{ background: progressToGradient(progress) }}
        />

        {/* Outer ring */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={progressToStartColor(progress)} />
              <stop offset="100%" stopColor={progressToEndColor(progress)} />
            </linearGradient>
          </defs>
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="2" 
          />
          <motion.circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="none" 
            stroke="url(#orbGradient)" 
            strokeWidth="4"
            strokeLinecap="round"
            transform="rotate(-90, 50, 50)"
            initial={{ strokeDasharray: "0, 1000" }}
            animate={{ strokeDasharray: `${progress * 2.9}, 1000` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Inner orb with glass effect */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-white/5 dark:from-white/10 dark:to-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-inner flex items-center justify-center">
          {/* Glass reflection effect */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
          
          {/* Progress display */}
          <div className="text-center">
            <motion.h3 
              className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
            >
              {Math.floor(displayedProgress)}
            </motion.h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">percent</p>
          </div>
        </div>
        
        {/* Highlight dots around the circle */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <circle cx="50" cy="4" r="2" fill="white" />
          <circle cx="96" cy="50" r="2" fill="white" />
          <circle cx="50" cy="96" r="2" fill="white" />
          <circle cx="4" cy="50" r="2" fill="white" />
        </svg>
      </motion.div>
    </div>
  );
};

// Helper functions to create dynamic colors based on progress
const progressToStartColor = (progress) => {
  if (progress < 30) return '#6366f1'; // Indigo
  if (progress < 70) return '#3b82f6'; // Blue
  return '#10b981'; // Emerald
};

const progressToEndColor = (progress) => {
  if (progress < 30) return '#8b5cf6'; // Violet
  if (progress < 70) return '#6366f1'; // Indigo
  return '#059669'; // Green
};

const progressToGradient = (progress) => {
  return `linear-gradient(135deg, ${progressToStartColor(progress)}, ${progressToEndColor(progress)})`;
};

const progressToColor = (progress, opacity = 1) => {
  if (progress < 30) return `rgba(99, 102, 241, ${opacity})`;
  if (progress < 70) return `rgba(59, 130, 246, ${opacity})`;
  return `rgba(16, 185, 129, ${opacity})`;
};

export default GoalProgressOrb;