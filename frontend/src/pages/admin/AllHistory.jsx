import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BarChart3, Clock, Thermometer, HeartPulse, Moon } from 'lucide-react';
import { getAllHistory } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AllHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getAllHistory();
        setHistoryList(data);
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Could not load prediction history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Helper to get status label and color class based on score
  const getQualityConfig = (score) => {
    const s = parseFloat(score);
    if (s >= 8)
      return {
        label: 'Good',
        class:
          'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300',
      };
    if (s >= 6)
      return {
        label: 'Normal',
        class:
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300',
      };
    return {
      label: 'Poor',
      class: 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300',
    };
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">All Prediction History</h1>
        <div className="flex items-center gap-2 rounded-full bg-light-primary/10 px-4 py-2 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary">
          <BarChart3 className="h-5 w-5" />
          <span className="font-semibold">
            {historyList.length} Total Records
          </span>
        </div>
      </div>

      {historyList.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-light-card p-8 text-center shadow-xl dark:bg-dark-card">
          <h2 className="text-2xl font-semibold text-light-text/70 dark:text-dark-text/70">
            No prediction history records found.
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-light-card shadow-xl dark:bg-dark-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70"
                  >
                    User Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70"
                  >
                    Date / Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70"
                  >
                    Metrics
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70"
                  >
                    Score
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {historyList.map((item) => {
                  const quality = getQualityConfig(item.predicted_quality);

                  // Safely format values
                  const sleepDuration =
                    item.sleepDuration !== undefined &&
                    item.sleepDuration !== null
                      ? item.sleepDuration.toFixed(1)
                      : 'N/A';

                  const heartRate = item.heartRate || 'N/A';

                  const bodyTemperature =
                    item.bodyTemperature !== undefined &&
                    item.bodyTemperature !== null
                      ? item.bodyTemperature.toFixed(1)
                      : 'N/A';

                  const predictedQuality =
                    item.predicted_quality !== undefined &&
                    item.predicted_quality !== null
                      ? item.predicted_quality.toFixed(1)
                      : 'N/A';

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {/* User Details */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-light-primary dark:text-dark-primary">
                          {item.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-light-text/60 dark:text-dark-text/60">
                          {item.user?.email || 'N/A'}
                        </div>
                      </td>

                      {/* Date / Time */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-light-text/80 dark:text-dark-text/80">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* Metrics */}
                      <td className="px-6 py-4 text-sm text-light-text dark:text-dark-text">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-blue-500" /> Sleep:{' '}
                            {sleepDuration} hrs
                          </p>
                          <p className="flex items-center gap-2">
                            <HeartPulse className="h-4 w-4 text-red-500" /> HR:{' '}
                            {heartRate} bpm
                          </p>
                          <p className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-orange-500" />{' '}
                            Temp: {bodyTemperature} °C
                          </p>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-4 py-1.5 text-sm font-bold ${quality.class}`}
                        >
                          {quality.label} ({predictedQuality})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AllHistory;
