import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserHistory } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookMarked, CalendarDays, HeartPulse, Moon, Zap } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await getUserHistory();
        setHistory(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch prediction history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to get color based on sleep score
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">{error}</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-8 text-4xl font-bold text-light-primary dark:text-dark-primary">
        Your Prediction History
      </h1>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-light-card p-12 text-center dark:border-gray-700 dark:bg-dark-card">
          <BookMarked className="h-16 w-16 text-light-text/30 dark:text-dark-text/30" />
          <h2 className="mt-4 text-2xl font-semibold">No History Found</h2>
          <p className="mt-2 text-light-text/70 dark:text-dark-text/70">
            You haven't made any predictions yet. Go to the Home page to get
            started!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden rounded-2xl bg-light-card shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-dark-card"
            >
              <div
                className={`flex w-full items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700`}
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                  <span className="font-semibold">{formatDate(item.date)}</span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-lg font-bold ${getScoreColor(
                    item.prediction
                  )}`}
                >
                  <Zap className="h-5 w-5" />
                  <span>{parseFloat(item.prediction).toFixed(1)} / 10</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
                <InfoItem
                  label="Gender"
                  value={item.gender}
                />
                <InfoItem
                  label="Age"
                  value={item.age}
                />
                <InfoItem
                  label="Sleep Duration (hrs)"
                  value={item.sleepDuration}
                  icon={<Moon className="h-5 w-5 text-blue-500" />}
                />
                <InfoItem
                  label="Heart Rate (bpm)"
                  value={item.heartRate}
                  icon={<HeartPulse className="h-5 w-5 text-red-500" />}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// A small helper component for displaying info items
const InfoItem = ({ label, value, icon = null }) => (
  <div className="flex items-center gap-3 rounded-lg bg-light-bg p-3 dark:bg-dark-bg">
    {icon && <div className="flex-shrink-0">{icon}</div>}
    <div>
      <p className="text-sm font-medium text-light-text/70 dark:text-dark-text/70">
        {label}
      </p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default History;

