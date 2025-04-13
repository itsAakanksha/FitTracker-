import React from 'react';

/**
 * Error display component for showing error messages throughout the app
 * @param {Object} props - Component props
 * @param {string} props.message - The error message to display
 */
const ErrorDisplay = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-destructive/10 text-destructive rounded-lg">
      <svg 
        className="w-12 h-12 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      </svg>
      <h3 className="text-lg font-medium mb-2">An error occurred</h3>
      <p className="text-center">{message}</p>
    </div>
  );
};

export default ErrorDisplay;