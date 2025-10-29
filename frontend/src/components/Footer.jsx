import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-light-card py-6 dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 text-center text-sm text-light-text/60 dark:text-dark-text/60">
        <p>&copy; {new Date().getFullYear()} SleepMetrics. All rights reserved.</p>
        <p className="mt-1">
          Built with React, Node.js, and Python.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
