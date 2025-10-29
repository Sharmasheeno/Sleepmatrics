import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  getAllHistory,
  getAllFeedback,
} from '../../api/api';
import { motion } from 'framer-motion';
import { Users, BookCheck, Star, MessageSquare } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`rounded-2xl bg-light-card p-6 shadow-lg dark:bg-dark-card ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium uppercase text-light-text/70 dark:text-dark-text/70">
          {title}
        </p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="rounded-full bg-white/20 p-3">{icon}</div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPredictions: 0,
    avgRating: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    genderData: null,
    scoreData: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [usersRes, historyRes, feedbackRes] = await Promise.all([
          getAllUsers(),
          getAllHistory(),
          getAllFeedback(),
        ]);

        const users = usersRes.data || [];
        const history = historyRes.data || [];
        const feedback = feedbackRes.data || [];

        // 1. Calculate Stats
        let avgRating = 0;
        if (feedback.length > 0) {
          const totalRating = feedback.reduce(
            (acc, fb) => acc + fb.rating,
            0
          );
          avgRating = (totalRating / feedback.length).toFixed(1);
        }
        setStats({
          totalUsers: users.length,
          totalPredictions: history.length,
          avgRating: avgRating,
        });

        // 2. Get Recent Feedback
        setRecentFeedback(feedback.slice(0, 5)); // Get latest 5

        // 3. Process Chart Data
        // Gender Chart 
        const malePredictions = history.filter(
          (h) => h.gender.toLowerCase() === 'male'
        ).length;
        const femalePredictions = history.filter(
          (h) => h.gender.toLowerCase() === 'female'
        ).length;
        setChartData((prev) => ({
          ...prev,
          genderData: {
            labels: ['Male', 'Female'],
            datasets: [
              {
                label: 'Predictions by Gender',
                data: [malePredictions, femalePredictions],
                backgroundColor: [
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 99, 132, 0.7)',
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
        }));

        // Score Distribution Chart 
        const scores = history.map((h) => parseFloat(h.prediction));
        const scoreBins = {
          Poor: scores.filter((s) => s < 6).length,
          Normal: scores.filter((s) => s >= 6 && s < 8).length,
          Good: scores.filter((s) => s >= 8).length,
        };
        setChartData((prev) => ({
          ...prev,
          scoreData: {
            labels: ['Poor (< 6)', 'Normal (6-8)', 'Good (> 8)'],
            datasets: [
              {
                label: 'Sleep Score Distribution',
                data: [scoreBins.Poor, scoreBins.Normal, scoreBins.Good],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
        }));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary">
        Admin Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-8 w-8" />}
          color="text-blue-500"
        />
        <StatCard
          title="Total Predictions"
          value={stats.totalPredictions}
          icon={<BookCheck className="h-8 w-8" />}
          color="text-green-500"
        />
        <StatCard
          title="Avg. Feedback"
          value={`${stats.avgRating} / 5`}
          icon={<Star className="h-8 w-8" />}
          color="text-yellow-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl bg-light-card p-6 shadow-lg dark:bg-dark-card"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Prediction Score Distribution
          </h2>
          {chartData.scoreData && <Bar data={chartData.scoreData} />}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl bg-light-card p-6 shadow-lg dark:bg-dark-card"
        >
          <h2 className="mb-4 text-xl font-semibold">Predictions by Gender</h2>
          <div className="mx-auto max-w-[300px]">
            {chartData.genderData && <Pie data={chartData.genderData} />}
          </div>
        </motion.div>
      </div>

      {/* Recent Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl bg-light-card p-6 shadow-lg dark:bg-dark-card"
      >
        <h2 className="mb-4 text-xl font-semibold">Recent Feedback</h2>
        <div className="space-y-4">
          {recentFeedback.length > 0 ? (
            recentFeedback.map((fb) => (
              <div
                key={fb._id}
                className="rounded-lg border border-gray-200 bg-light-bg p-4 dark:border-gray-700 dark:bg-dark-bg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{fb.userName}</span>
                  <span className="text-sm text-light-text/70 dark:text-dark-text/70">
                    {'⭐'.repeat(fb.rating)}
                  </span>
                </div>
                <p className="mt-2 text-light-text/90 dark:text-dark-text/90">
                  "{fb.feedback}"
                </p>
              </div>
            ))
          ) : (
            <p className="text-light-text/70 dark:text-dark-text/70">
              No feedback submitted yet.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

