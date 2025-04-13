import React from 'react';

/**
 * Loading spinner component used to indicate loading states throughout the app
 */
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;