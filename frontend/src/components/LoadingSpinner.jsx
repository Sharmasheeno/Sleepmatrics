import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-light-bg/80 text-light-text backdrop-blur-sm dark:bg-dark-bg/80 dark:text-dark-text">
        <Loader className="h-12 w-12 animate-spin text-light-primary dark:text-dark-primary" />
        <p className="mt-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center p-10">
      <Loader className="h-8 w-8 animate-spin text-light-primary dark:text-dark-primary" />
    </div>
  );
};

export default LoadingSpinner;
