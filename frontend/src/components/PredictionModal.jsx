import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import { X, Heart, MessageSquare, CheckCircle, Send, Star, Loader } from 'lucide-react'; // <-- FIX: Loader added here
import { submitFeedback } from '../api/api';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Maps the numerical prediction score to a rating label
const getRatingLabel = (score) => {
  if (score >= 8.5) return 'Excellent';
  if (score >= 7.0) return 'Good';
  if (score >= 5.0) return 'Fair';
  return 'Poor';
};

// Maps the rating to colors and descriptions
const ratingConfig = {
  Excellent: { color: '#00f2ff', emoji: '🌟', description: 'Your sleep quality is outstanding! Keep up the great habits.' },
  Good: { color: '#4CAF50', emoji: '✅', description: 'Your sleep quality is healthy. Minor adjustments might lead to perfection.' },
  Fair: { color: '#FFC107', emoji: '⚠️', description: 'Your sleep quality needs attention. Focus on consistency and environment.' },
  Poor: { color: '#F44336', emoji: '🛑', description: 'Your sleep quality is low. Seek professional advice for deeper underlying issues.' },
};

// Maps the numerical score to a 5-star rating (for feedback display)
const starRatingMap = ['★', '★', '★', '★', '★'];

const PredictionModal = ({ isOpen, onClose, prediction }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [userRating, setUserRating] = useState(0); // 1-5 star rating
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const score = parseFloat(prediction);
  const rating = getRatingLabel(score);
  const config = ratingConfig[rating];
  const color = config.color;

  const chartData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [score, 10 - score],
        backgroundColor: [color, '#374151'], // Color + Dark Grey
        borderColor: [color, '#374151'],
        borderWidth: 1,
      },
    ],
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (userRating === 0 || feedbackText.trim() === '') {
      toast.error('Please provide both a rating and a comment.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting feedback...');
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('You must be logged in to submit feedback.', { id: toastId });
        return;
      }

      const feedbackData = {
        user: user.id, // User ID
        predictionScore: score,
        rating: userRating, // 1-5 star score
        feedback: feedbackText,
      };

      await submitFeedback(feedbackData);
      toast.success('Thank you for your valuable feedback!', { id: toastId });
      onClose(); // Close modal on success
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to submit feedback.',
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl rounded-3xl bg-light-card shadow-2xl dark:bg-dark-card overflow-hidden"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-light-bg dark:bg-dark-bg">
            <h2 className="text-3xl font-extrabold text-light-text dark:text-dark-text flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-green-500" /> Sleep Analysis Complete
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <X className="w-6 h-6 text-light-text dark:text-dark-text" />
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-8">
            
            {/* LEFT SIDE: Prediction Score Gauge */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-light-bg dark:bg-dark-bg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text">Predicted Quality Score (1-10)</h3>
              <div className="relative w-48 h-48 mb-6">
                <Doughnut
                  data={chartData}
                  options={{
                    cutout: '80%',
                    rotation: -90,
                    circumference: 180,
                    maintainAspectRatio: false,
                    plugins: { tooltip: { enabled: false }, legend: { display: false } },
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center top-1/4">
                  <motion.span 
                    className={`text-5xl font-extrabold`}
                    style={{ color: color }}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                  >
                    {score.toFixed(1)}
                  </motion.span>
                  <span className="text-sm text-light-text/70 dark:text-dark-text/70 mt-1">out of 10</span>
                </div>
              </div>

              <div className={`mt-2 p-3 rounded-full text-lg font-bold shadow-md`}
                   style={{ backgroundColor: color, color: 'white' }}>
                {config.emoji} {rating} Sleep Quality
              </div>
              <p className="text-sm mt-4 text-center text-light-text/80 dark:text-dark-text/80">{config.description}</p>
            </div>

            {/* RIGHT SIDE: Feedback Section */}
            <div className="p-6 rounded-2xl bg-light-bg dark:bg-dark-bg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-light-secondary dark:text-dark-secondary" /> Tell Us How We Did
              </h3>
              
              <p className="text-sm text-light-text/70 dark:text-dark-text/70 mb-4">
                Your feedback helps us improve the prediction model's accuracy.
              </p>

              {/* Star Rating */}
              <div className="mb-6">
                <p className="font-medium text-light-text dark:text-dark-text mb-2">Rate the prediction accuracy (1-5 Stars)</p>
                <div className="flex gap-1">
                  {starRatingMap.map((_, index) => (
                    <motion.span
                      key={index}
                      className="cursor-pointer text-3xl transition-colors"
                      style={{ color: index < userRating ? '#FFC107' : '#9CA3AF' }} // Yellow or Gray
                      onClick={() => setUserRating(index + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star className={`w-8 h-8 ${index < userRating ? 'fill-yellow-500' : 'text-gray-400'}`} />
                    </motion.span>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">You rated: {userRating} / 5</p>
                )}
              </div>

              {/* Text Feedback */}
              <form onSubmit={handleFeedbackSubmit}>
                <label htmlFor="feedback" className="font-medium text-light-text dark:text-dark-text mb-1 block">Your Comments</label>
                <textarea
                  id="feedback"
                  rows="3"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g., 'The prediction matched my sleep tracking app perfectly,' or 'I felt it was too low.'"
                  className="w-full rounded-lg border border-gray-300 bg-light-card p-3 text-light-text outline-none transition-all duration-300 focus:border-light-primary focus:ring-2 focus:ring-light-primary/50 dark:border-gray-600 dark:bg-dark-card dark:text-dark-text"
                />

                {/* Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || userRating === 0 || feedbackText.trim() === ''}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-light-primary p-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-light-primary/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-primary dark:hover:bg-dark-primary/80"
                >
                  {isSubmitting ? <Loader className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PredictionModal;
