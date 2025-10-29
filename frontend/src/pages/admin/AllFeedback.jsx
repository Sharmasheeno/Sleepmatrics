import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Star, MessageSquare } from 'lucide-react';
import { getAllFeedback } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AllFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await getAllFeedback();
        setFeedbackList(data);
      } catch (error) {
        toast.error('Could not load feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill={i < rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">User Feedback</h1>
        <div className="flex items-center gap-2 rounded-full bg-light-primary/10 px-4 py-2 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary">
          <MessageSquare className="h-5 w-5" />
          <span className="font-semibold">{feedbackList.length} Total</span>
        </div>
      </div>

      {feedbackList.length === 0 ? (
         <div className="flex h-64 items-center justify-center rounded-2xl bg-light-card p-8 text-center shadow-xl dark:bg-dark-card">
           <h2 className="text-2xl font-semibold text-light-text/70 dark:text-dark-text/70">
             No feedback has been submitted yet.
           </h2>
         </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {feedbackList.map((feedback) => (
            <motion.div
              key={feedback._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-light-card p-6 shadow-lg dark:bg-dark-card"
            >
              <div className="flex items-center justify-between">
                {renderStars(feedback.rating)}
                <span className="text-sm text-light-text/60 dark:text-dark-text/60">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-4 text-lg italic">"{feedback.feedback}"</p>
              <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="font-semibold">{feedback.userName}</p>
                <p className="text-sm text-light-text/80 dark:text-dark-text/80">
                  {feedback.userEmail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AllFeedback;
