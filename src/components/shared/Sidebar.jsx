import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Target, Activity, Settings, Zap, ChevronRight, Crown, Menu, X } from 'lucide-react';
import clsx from 'clsx';

// Sidebar navigation items
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Goals', icon: Target, href: '/goals' },
  { name: 'Trends', icon: TrendingUp, href: '/trends' },
  { name: 'Activity', icon: Activity, href: '/activity' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Update on resize
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Toggle mobile sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/90 dark:bg-[#17171D]/90 shadow-sm border border-gray-100 dark:border-gray-700/60 backdrop-blur-sm"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
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

      {/* Sidebar - separate desktop and mobile behavior */}
      <motion.aside 
        className={clsx(
          "flex-shrink-0 z-40",
          isMobile 
            ? isOpen ? "fixed inset-y-0 left-0 flex" : "hidden" 
            : "fixed md:relative inset-y-0 left-0 flex" // Always display on desktop
        )}
        initial={false}
        animate={{ 
          x: (isMobile && !isOpen) ? -320 : 0, // Only animate off-screen on mobile when closed
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        <div className="flex flex-col w-64 h-full">
          <div className="flex flex-col h-full flex-1 bg-gradient-to-b from-white to-gray-50/80 dark:from-[#17171D] dark:to-[#17171D]/95 border-r border-gray-100 dark:border-gray-800/50 shadow-lg">
            {/* Logo and mobile close button */}
            <div className="flex items-center justify-between py-6 px-6">
              <Link to="/" className="flex items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-sm opacity-70"></div>
                  <div className="relative bg-white dark:bg-black rounded-full p-1.5">
                    <Zap className="h-6 w-6 text-violet-600" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="ml-3 text-lg font-medium tracking-tight text-gray-900 dark:text-white">FitTracker</span>
              </Link>
              
              {/* Mobile close button - only on mobile */}
              {isMobile && isOpen && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-black/60"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              )}
            </div>
            
            {/* Navigation */}
            <nav className="mt-4 px-3 flex-1">
              <div className="space-y-1">
                {navItems.map((item) => {
                  // Check if current route matches the item's href
                  const isCurrent = location.pathname === item.href || 
                    (location.pathname === '/' && item.href === '/');
                  
                  return (
                    <motion.div key={item.name}>
                      <Link
                        to={item.href}
                        className={clsx(
                          'group flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 relative',
                          isCurrent
                            ? 'text-violet-700 dark:text-violet-300 font-medium bg-violet-50/70 dark:bg-violet-900/20'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100/80 dark:hover:bg-black/40 dark:hover:text-white'
                        )}
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={() => {
                          if (isMobile) setIsOpen(false);
                        }}
                      >
                        {/* Active indicator */}
                        {isCurrent && (
                          <motion.div 
                            layoutId="activeNavIndicator"
                            className="absolute left-0 w-1 h-6 bg-violet-500 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                        
                        <item.icon
                          className={clsx(
                            'mr-3 flex-shrink-0 h-[18px] w-[18px] transition-colors duration-200',
                            isCurrent
                              ? 'text-violet-600 dark:text-violet-400'
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-violet-500 dark:group-hover:text-violet-400'
                          )}
                          strokeWidth={isCurrent ? 2.5 : 2}
                        />
                        
                        <span className="flex-1">{item.name}</span>
                        
                        {/* Arrow indicator - always visible for active, shows on hover otherwise */}
                        <ChevronRight 
                          className={clsx(
                            'h-4 w-4 transition-all duration-200',
                            isCurrent 
                              ? 'text-violet-500 opacity-100'
                              : 'text-gray-400 opacity-0 group-hover:opacity-100'
                          )}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </nav>
            
            {/* Premium CTA */}
            <div className="px-3 pb-5 mt-auto">
              <div className="relative overflow-hidden rounded-xl backdrop-blur-sm">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-violet-600/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-600/20 rounded-full blur-2xl"></div>
                
                <div className="relative bg-white/80 dark:bg-black/70 border border-gray-100/80 dark:border-white/5 rounded-xl p-5 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <Crown className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    </div>
                    <h4 className="ml-2.5 text-sm font-medium text-gray-900 dark:text-white">Premium Plan</h4>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Get access to advanced insights, analytics, and exclusive features
                  </p>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative overflow-hidden group py-2 px-4 rounded-lg shadow-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:scale-105"></div>
                    
                    <span className="relative flex items-center justify-center text-xs font-medium text-white">
                      Upgrade to Premium
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;