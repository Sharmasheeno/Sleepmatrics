import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PredictionForm from '../components/PredictionForm'; // Import the form
import { HeartPulse } from 'lucide-react';

const Home = () => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // Get the user's name from local storage to personalize the welcome message
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // Get the first name
        setUserName(JSON.parse(storedUser).name.split(' ')[0]);
      }
    } catch (e) {
      console.error("Could not parse user from local storage", e);
    }
  }, []);

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Welcome, <span className="text-light-primary dark:text-dark-primary">{userName}</span>!
        </h1>
        <p className="mt-4 text-xl text-light-text/80 dark:text-dark-text/80">
          Let's analyze your sleep health.
        </p>
      </motion.div>

      {/* --- This is the main prediction form --- */}
      <PredictionForm />

      {/* Optional: Add an info section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-2xl rounded-2xl bg-light-card p-8 shadow-xl dark:bg-dark-card"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <HeartPulse className="h-10 w-10 text-light-secondary dark:text-dark-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">How does this work?</h3>
            <p className="mt-2 text-light-text/80 dark:text-dark-text/80">
              Our model analyzes your inputs using a Random Forest algorithm to predict a sleep quality score from 1 to 10. This score is based on patterns learned from thousands of anonymous sleep records.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

