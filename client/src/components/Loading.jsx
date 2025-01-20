import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="relative flex flex-col items-center bg-transparent p-8 ">
        {/* SVG Icon with "K" and Tech Theme */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-16 h-16 text-blue-600"
        >
          <circle cx="50" cy="50" r="45" fill="#E3F2FD" stroke="#2196F3" strokeWidth="4" />
          <path
            d="M35 25 L35 75 L45 75 L45 50 L60 75 L70 75 L55 50 L70 25 L60 25 L45 40 L45 25 Z"
            fill="#2196F3"
          />
        </svg>

        {/* Dots Animation */}
        <div className="flex space-x-2 mt-6">
          <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
