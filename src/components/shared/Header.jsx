import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, Sun, Moon, Menu, X, ChevronDown, Star } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

function Header({ toggleSidebar, isSidebarOpen }) {
  const { theme, toggleTheme, getLogo } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [inspirationMessage, setInspirationMessage] = useState('');
  
  // Dynamic inspiration messages
  const inspirationMessages = [
    'Make today your personal best! ✨',
    'One step at a time! 👟',
    'Celebrate small wins! 🏆',
    'Progress over perfection! 📈',
    'Stay consistent! 🔄'
  ];
  
  useEffect(() => {
    // Set a random inspiration message
    const randomIndex = Math.floor(Math.random() * inspirationMessages.length);
    setInspirationMessage(inspirationMessages[randomIndex]);
    
    // Change message every 24 hours or on reload
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * inspirationMessages.length);
      setInspirationMessage(inspirationMessages[newIndex]);
    }, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, []);
  
  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('#profile-menu')) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#17171D]/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Left: Greeting & Date - No logo (moved to sidebar) */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button 
              onClick={toggleSidebar}
              type="button" 
              className="md:hidden p-1.5 rounded-full bg-gray-100/80 dark:bg-[#1E1E24] hover:bg-gray-200 dark:hover:bg-[#282833] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open menu</span>
              {isSidebarOpen ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            
            {/* Logo - Using the getLogo method */}
            <Link to="/" className="hidden sm:flex items-center mr-2">
              <img 
                src={getLogo()}
                alt="FitTracker Logo"
                className="h-8 w-8 transition-all duration-300"
              />
            </Link>

            {/* Greeting & Date with enhanced typography */}
            <div className="hidden sm:flex flex-col justify-center">
              <div className="flex items-center">
                <h1 className="text-base font-medium text-gray-900 dark:text-white truncate">
                  <span>{getGreeting()}, Aakanksha</span>
                  {/* Premium badge with glow effect */}
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="relative ml-2.5 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-500/20 dark:to-indigo-500/20 border border-violet-100 dark:border-violet-500/30 text-violet-600 dark:text-violet-300 group"
                  >
                    <span className="absolute -inset-1 bg-violet-100/50 dark:bg-violet-500/10 rounded-md blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></span>
                    <Star className="h-3 w-3 mr-1 text-violet-500 dark:text-violet-400" strokeWidth={2.5} />
                    Premium
                  </motion.span>
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{currentDate}</p>
            </div>
          </div>

          {/* Center: Dynamic Motivational Message - Enhanced with animation */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={inspirationMessage}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative group px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-500/10 dark:to-indigo-500/10 border border-violet-100 dark:border-violet-600/20 shadow-[0_2px_10px_rgba(139,92,246,0.1)] dark:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-100/50 to-indigo-100/50 dark:from-violet-500/10 dark:to-indigo-500/10 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <p className="relative text-sm text-violet-600 dark:text-violet-300 font-medium tracking-wide">
                  {inspirationMessage}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Right: Actions - Theme Toggle, Notifications, User Profile */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button - Premium style */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden p-1.5 rounded-full bg-gray-100/80 dark:bg-[#1E1E24] hover:bg-gray-200 dark:hover:bg-[#282833] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="sr-only">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              <div className="relative w-5 h-5">
                <Sun className={`absolute transition-transform duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <Moon className={`absolute transition-transform duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
              </div>
              
              {/* Subtle glow effect on hover */}
              <span className="absolute inset-0 rounded-full bg-violet-100 dark:bg-violet-600/10 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
            
            {/* Notification Bell with Counter - Enhanced with animations */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="relative p-1.5 rounded-full bg-gray-100/80 dark:bg-[#1E1E24] hover:bg-gray-200 dark:hover:bg-[#282833] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-all duration-300"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-red-500/30"
              />
              
              {/* Subtle pulse animation */}
              <motion.span 
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 1.2, 0.8], 
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2
                }}
                className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500/50 blur-sm"
              />
            </motion.button>

            {/* User Menu - Sophisticated dropdown */}
            <div id="profile-menu" className="relative">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                className="flex items-center gap-2 rounded-lg p-0.5 bg-gradient-to-r from-violet-100/70 to-indigo-100/70 dark:from-violet-500/30 dark:to-indigo-500/30 hover:from-violet-200/70 hover:to-indigo-200/70 dark:hover:from-violet-500/50 dark:hover:to-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-violet-200 dark:focus:ring-violet-500/50 focus:ring-offset-white dark:focus:ring-offset-[#13131A] transition-all duration-300"
                aria-expanded={showProfileMenu ? 'true' : 'false'}
              >
                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md bg-white dark:bg-[#1E1E24] border-t border-white/50 dark:border-white/5">
                  <div className="hidden sm:flex flex-col items-end mr-1">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">Aakanksha</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">Premium Plan</span>
                  </div>
                  
                  <div className="relative">
                    <div className="relative rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 p-0.5 shadow-md">
                      <div className="rounded-full h-7 w-7 bg-white dark:bg-[#1E1E24] flex items-center justify-center overflow-hidden border border-white/50 dark:border-white/10">
                        <UserCircle className="h-6 w-6 text-gray-700 dark:text-white/80" />
                      </div>
                    </div>
                  </div>
                  
                  <ChevronDown className={clsx(
                    "h-3.5 w-3.5 text-gray-400 transition-transform duration-200",
                    showProfileMenu ? "rotate-180" : "rotate-0"
                  )} />
                </div>
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute right-0 mt-2 w-56 origin-top-right"
                  >
                    <div className="relative">
                      {/* Subtle glow effect */}
                      <div className="absolute -inset-1.5 bg-violet-200/50 dark:bg-violet-500/20 rounded-xl blur-lg opacity-50"></div>
                      
                      <div className="relative rounded-xl border border-violet-100 dark:border-violet-500/10 bg-white/90 dark:bg-[#1A1A23]/90 backdrop-blur-md shadow-lg p-1 divide-y divide-gray-100 dark:divide-gray-800/50">
                        {/* User Info Section */}
                        <div className="px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="relative rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 p-0.5 shadow-md">
                              <div className="rounded-full h-9 w-9 bg-white dark:bg-[#1E1E24] flex items-center justify-center overflow-hidden border border-white/50 dark:border-white/10">
                                <UserCircle className="h-8 w-8 text-gray-700 dark:text-white/80" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Aakanksha</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">aakanksha@example.com</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-1.5">
                          {['Profile', 'Settings', 'Activity Log', 'Billing'].map((item) => (
                            <a 
                              key={item}
                              href="#" 
                              className="block px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors duration-200"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                        
                        {/* Sign Out */}
                        <div className="py-1.5">
                          <a 
                            href="#" 
                            className="block px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-colors duration-200"
                          >
                            Sign out
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;