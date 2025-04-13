import React from 'react';
import { Bell, UserCircle, Sun, Moon, Menu } from 'lucide-react'; 
import { useTheme } from '../../contexts/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();
  
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

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101014]/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Greeting */}
          <div className="flex items-center gap-6">
       
            {/* Greeting & Date - Subtly styled */}
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                <span>{getGreeting()}, Aakanksha</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/50">Premium</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</p>
          
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            {/* Inspirational Message - Shown only on larger screens */}
            <div className="hidden lg:block">
              <p className="text-sm text-violet-700 dark:text-violet-300 bg-violet-50/80 dark:bg-violet-900/30 px-3 py-1.5 rounded-full font-medium border border-violet-100 dark:border-violet-800/50">
                Make today your personal best! ✨
              </p>
            </div>

            {/* Theme Toggle Button - Enhanced with smooth transition */}
            <button
              onClick={toggleTheme}
              type="button"
              className="relative overflow-hidden p-2 rounded-full bg-gray-100/80 dark:bg-[#17171D]/80 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="sr-only">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              <div className="relative w-5 h-5">
                <Moon className={`absolute transition-all duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <Sun className={`absolute transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
              </div>
            </button>
            
            {/* Notification Bell with Counter */}
            <button
              type="button"
              className="relative p-2 rounded-full bg-gray-100/80 dark:bg-[#17171D]/80 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 transition-all duration-300"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full p-0.5 bg-gradient-to-br from-violet-400 to-indigo-500 hover:from-violet-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">Open user menu</span>
                <div className="rounded-full p-0.5 bg-white dark:bg-[#101014] flex items-center justify-center">
                  <UserCircle className="h-7 w-7 text-gray-700 dark:text-gray-300" />
                </div>
              </button>
            </div>

            {/* Mobile menu button */}
            <button type="button" className="sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-300">
              <span className="sr-only">Open menu</span>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;