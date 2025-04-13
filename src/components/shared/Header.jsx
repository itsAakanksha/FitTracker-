
import React from 'react';
import { Bell, UserCircle } from 'lucide-react'; // Example icons

function Header() {
  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    // year: 'numeric', // Removed year for brevity
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16">
          {/* Left side: Greeting */}
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Good evening, Alex!</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</p>
            </div>
          </div>

          {/* Right side: Message & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
             <p className="hidden sm:block text-xs sm:text-sm text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/50 px-3 py-1.5 rounded-full font-medium">
                Welcome to your most active days. Make this your best day! ✨
             </p>
             <button
                type="button"
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-gray-800"
              >
                 <span className="sr-only">User menu</span>
                 {/* Replace with Avatar component if user image available */}
                 <UserCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
