import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Target, Activity, Settings, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../contexts/ThemeContext';

// Sidebar navigation items with enhanced metadata
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Goals', icon: Target, href: '/goals' },
  { name: 'Trends', icon: TrendingUp, href: '/trends' },
  { name: 'Activity', icon: Activity, href: '/activity' },
  // { name: 'Settings', icon: Settings, href: '/settings' },
];

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, getLogo } = useTheme();
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Reset collapse state when switching between mobile and desktop
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };
    
    // Initial check
    checkIsMobile();
    
    // Update on resize
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Handle sidebar toggle for desktop (collapse/expand)
  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Mobile backdrop with increased blur for premium feel */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sophisticated Sidebar with collapsible state */}
      <AnimatePresence mode="wait">
        {(isOpen || !isMobile) && (
          <motion.aside 
            className={clsx(
              "fixed inset-y-0 z-100 flex",
              isMobile 
                ? "right-0 w-full max-w-[280px]" // Mobile: slide from right
                : "left-0 md:static", // Desktop: always visible
              isCollapsed && !isMobile ? "w-[72px]" : "w-[280px]" // Dynamic width based on collapsed state
            )}
            initial={{ 
              x: isMobile ? '100%' : isCollapsed ? -72 : -280,
              opacity: 0 
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              width: isCollapsed && !isMobile ? "72px" : "280px"
            }}
            exit={{ 
              x: isMobile ? '100%' : isCollapsed ? -72 : -280,
              opacity: 0
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30 
            }}
          >
            <div className="flex flex-col w-full h-screen sticky top-0">
              <div className="flex flex-col h-full flex-1 bg-white dark:bg-[#17171D] border-r border-gray-100 dark:border-gray-800/50 shadow-lg">
                {/* Logo and brand section with collapse toggle */}
                <div className={clsx(
                  "flex items-center py-6 transition-all duration-200",
                  isCollapsed && !isMobile ? "justify-center px-3" : "px-6"
                )}>
                  {!isCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full blur-md opacity-70"></div>
                        <div className="relative bg-white dark:bg-[#17171D] rounded-full p-1.5">
                          <img 
                            src={getLogo()}
                            alt="FitTracker Logo"
                            className="h-5 w-5"
                          />
                        </div>
                      </div>
                      <span className="text-lg font-medium tracking-tight text-gray-900 dark:text-white">FitTracker</span>
                    </motion.div>
                  )}
                  
                  {isCollapsed && !isMobile && (
                    <motion.div
                      className="relative"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full blur-md opacity-70"></div>
                      <div className="relative bg-white dark:bg-[#17171D] rounded-full p-1.5">
                        <img 
                          src={getLogo()}
                          alt="FitTracker Logo"
                          className="h-5 w-5"
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Collapse toggle button - only on desktop */}
                  {!isMobile && (
                    <motion.button
                      onClick={toggleCollapse}
                      className={clsx(
                        "ml-auto p-1.5 rounded-full bg-gray-100/80 dark:bg-[#1E1E24] hover:bg-gray-200 dark:hover:bg-[#282833] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200",
                        isCollapsed && !isMobile ? "mx-auto mt-4" : ""
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                      {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </motion.button>
                  )}
                </div>
                
                {/* Navigation - Premium styling with enhanced interactions */}
                <nav className={clsx(
                  "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent",
                  isCollapsed && !isMobile ? "px-2 mt-4" : "px-3 mt-6"
                )}>
                  <div className="space-y-1.5 pb-3">
                    {navItems.map((item) => {
                      const isCurrent = location.pathname === item.href || 
                        (item.href === '/' && location.pathname === '/');
                      
                      return (
                        <motion.div 
                          key={item.name}
                          whileHover={{ scale: isCurrent ? 1 : 1.01 }}
                          className="relative"
                        >
                          {/* Beautiful tooltip for collapsed state */}
                          {isCollapsed && !isMobile && (
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileHover={{ opacity: 1, x: -8, transition: { delay: 0.3 } }}
                                exit={{ opacity: 0, x: -20 }}
                                className="absolute left-0 top-0 -ml-2 transform -translate-x-full z-50 pointer-events-none"
                              >
                                <div className="bg-white dark:bg-[#17171D] px-3 py-2 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800/50">
                                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                                    <div className="w-2 h-2 bg-white dark:bg-[#17171D] border-t border-r border-gray-100 dark:border-gray-800/50 rotate-45"></div>
                                  </div>
                                  <span className="text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">{item.name}</span>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          )}
                          
                          <Link
                            to={item.href}
                            className={clsx(
                              'group flex items-center rounded-xl transition-all duration-200 relative',
                              isCollapsed && !isMobile ? 'px-2 py-3' : 'px-4 py-3',
                              isCurrent
                                ? 'text-violet-700 dark:text-violet-300 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                            aria-current={isCurrent ? 'page' : undefined}
                            onClick={() => {
                              if (isMobile) setIsOpen(false);
                            }}
                          >
                            {/* Premium active indicator with glow effect */}
                            {isCurrent && (
                              <motion.div 
                                layoutId="activeNavIndicator"
                                className={clsx(
                                  "absolute",
                                  isCollapsed && !isMobile 
                                    ? "inset-0 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/40 dark:to-indigo-900/40 rounded-xl border border-violet-100 dark:border-violet-600/30"
                                    : "left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-violet-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                                )}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              />
                            )}
                            
                            {/* Icon with enhanced hover effect */}
                            <div className={clsx(
                              "relative z-10 flex items-center justify-center",
                              isCollapsed && !isMobile && isCurrent ? "mx-auto" : "",
                              isCurrent ? "text-violet-600 dark:text-violet-400" : "text-gray-500 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                            )}>
                              <item.icon
                                className={clsx(
                                  'transition-all duration-200',
                                  isCollapsed && !isMobile ? 'h-[22px] w-[22px]' : 'h-[20px] w-[20px] mr-3',
                                )}
                                strokeWidth={isCurrent ? 2.5 : 2}
                              />
                              
                              {/* Subtle glow effect on hover for icons */}
                              {isCurrent && (
                                <div className="absolute inset-0 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-md -z-10"></div>
                              )}
                            </div>
                            
                            {/* Name - only show if not collapsed */}
                            {(!isCollapsed || isMobile) && (
                              <span className="flex-1 text-sm">{item.name}</span>
                            )}
                            
                            {/* Subtle indicator arrow on hover */}
                            {(!isCollapsed || isMobile) && (
                              <ChevronRight 
                                className={clsx(
                                  'h-4 w-4 transition-all duration-200 ease-in-out',
                                  isCurrent 
                                    ? 'text-violet-500 opacity-100 transform translate-x-0'
                                    : 'text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0'
                                )}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>
                
                {/* Premium badge - Redesigned with elegant visuals */}
                {(!isCollapsed || isMobile) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="px-3 pb-5 mt-auto"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      {/* Premium Background with elegant gradients */}
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 dark:from-violet-900/30 dark:to-indigo-900/30"></div>
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-300/30 dark:bg-violet-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-3xl"></div>
                      </div>
                      
                      <div className="relative bg-white/90 dark:bg-[#1A1A23]/70 backdrop-blur-sm border border-violet-100 dark:border-violet-500/10 rounded-xl p-5 shadow-[0_4px_20px_rgba(79,70,229,0.1)] dark:shadow-[0_4px_20px_rgba(79,70,229,0.15)]">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.4)] dark:shadow-[0_0_10px_rgba(124,58,237,0.6)]">
                            <Crown className="h-4 w-4 text-white" strokeWidth={2.5} />
                          </div>
                          <h4 className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Premium Plan</h4>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          Get access to advanced insights, analytics, and exclusive features
                        </p>
                        
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full relative overflow-hidden group py-2.5 px-4 rounded-lg shadow-md"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:scale-105"></div>
                          
                          <span className="relative flex items-center justify-center text-xs font-medium text-white">
                            Upgrade to Premium
                            <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Compact Premium indicator for collapsed mode */}
                {isCollapsed && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-2 pb-5 mt-auto"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="relative bg-gradient-to-br from-violet-200/50 to-indigo-200/50 dark:from-violet-600/20 dark:to-indigo-600/20 border border-violet-100 dark:border-violet-500/10 rounded-xl p-3 flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.1)] dark:shadow-[0_4px_20px_rgba(79,70,229,0.15)]">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.4)] dark:shadow-[0_0_10px_rgba(124,58,237,0.6)]">
                          <Crown className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;