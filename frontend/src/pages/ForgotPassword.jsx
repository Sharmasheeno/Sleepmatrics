import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Loader } from 'lucide-react';
import { forgotPassword } from '../api/api.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const toastId = toast.loading('Sending reset link...');

    try {
      await forgotPassword(email);
      toast.success('Reset link sent! Check your email.', { id: toastId });
      setMessage('If an account with this email exists, a reset link has been sent.');
      setEmail('');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to send link.',
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-light-bg to-blue-100 p-4 dark:from-dark-bg dark:to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-light-card p-8 shadow-2xl dark:bg-dark-card"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary">
            Forgot Password
          </h1>
          <p className="mt-2 text-lg text-light-text/70 dark:text-dark-text/70">
            Enter your email to get a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-10 text-light-text outline-none transition-all duration-300 focus:border-light-primary focus:ring-2 focus:ring-light-primary/50 dark:border-gray-600 dark:text-dark-text dark:focus:border-dark-primary dark:focus:ring-dark-primary/50"
            />
          </div>

          {message && (
            <p className="text-center text-green-600 dark:text-green-400">{message}</p>
          )}

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-light-primary p-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-light-primary/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-primary dark:hover:bg-dark-primary/80"
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-light-text/70 dark:text-dark-text/70">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-light-primary hover:underline dark:text-dark-primary"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;