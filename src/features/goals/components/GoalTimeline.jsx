import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, Medal, Zap, Award, 
  Star, Flame, Sparkles 
} from 'lucide-react';

const timelineItems = [
  {
    id: 1,
    title: 'New Record!',
    description: '15K steps • 2 days streak',
    icon: <Trophy className="h-5 w-5" />,
    date: 'Today',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'from-emerald-500/10 to-green-500/5'
  },
  {
    id: 2,
    title: 'Goal Completed',
    description: 'Daily water intake completed',
    icon: <Medal className="h-5 w-5" />,
    date: 'Yesterday',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-500/10 to-cyan-500/5'
  },
  {
    id: 3,
    title: 'New Achievement',
    description: 'Workout streak • 5 days',
    icon: <Star className="h-5 w-5" />,
    date: '2 days ago',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-500/10 to-orange-500/5'
  },
  {
    id: 4,
    title: 'Weekly Challenge',
    description: 'Completed cardio challenge',
    icon: <Award className="h-5 w-5" />,
    date: '3 days ago',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'from-violet-500/10 to-purple-600/5'
  },
];

const GoalTimeline = () => {
  return (
    <div className="space-y-4">
      {timelineItems.map((item, index) => (
        <TimelineItem key={item.id} item={item} index={index} />
      ))}
    </div>
  );
};

const TimelineItem = ({ item, index }) => {
  // Animation variants for staggered entries
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  // Particle component for celebration effects
  const particles = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 30,
    y: (Math.random() - 0.5) * 30,
    scale: 0.5 + Math.random() * 0.5,
    delay: i * 0.1
  }));

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="relative"
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
    >
      {/* Timeline connector */}
      {index < timelineItems.length - 1 && (
        <div className="absolute left-3.5 top-10 bottom-0 w-px bg-gradient-to-b from-gray-300 dark:from-gray-700 to-transparent"></div>
      )}
      
      <div className="relative flex items-start gap-4">
        {/* Timeline dot with icon */}
        <div className={`relative flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${item.color} p-1.5 shadow-lg overflow-hidden`}>
          <div className="absolute inset-0 bg-white/20 blur-xs"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {item.icon}
          </div>
          
          {/* Celebration particles for first item */}
          {index === 0 && particles.map(particle => (
            <motion.div 
              key={particle.id}
              className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, particle.scale, 0],
                x: [0, particle.x],
                y: [0, particle.y],
              }}
              transition={{
                duration: 1.5,
                delay: particle.delay,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          ))}
        </div>
        
        {/* Timeline content */}
        <div className={`relative flex-1 bg-gradient-to-r ${item.bgColor} backdrop-blur-lg border border-white/10 dark:border-white/5 p-3 rounded-lg`}>
          {/* Subtle animated glow effect */}
          {index === 0 && (
            <motion.div 
              className="absolute inset-0 rounded-lg opacity-20 blur-md"
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(250,204,21,0.4) 0%, rgba(16,185,129,0.1) 100%)',
                  'linear-gradient(45deg, rgba(16,185,129,0.4) 0%, rgba(250,204,21,0.1) 100%)',
                  'linear-gradient(45deg, rgba(250,204,21,0.4) 0%, rgba(16,185,129,0.1) 100%)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          
          <div className="flex justify-between items-start">
            <div className="relative">
              <div className="flex items-center gap-1">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {item.title}
                </h4>
                {index === 0 && <Sparkles className="h-3 w-3 text-yellow-400" />}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalTimeline;