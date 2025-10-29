import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { resetPassword } from '../api/api.js';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // Gets the token from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      await resetPassword(token, password);
      toast.success('Password reset successfully! Please log in.', { id: toastId });
      navigate('/login');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.',
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
            Reset Password
          </h1>
          <p className="mt-2 text-lg text-light-text/70 dark:text-dark-text/70">
            Enter your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* New Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-10 pr-10 text-light-text outline-none transition-all duration-300 focus:border-light-primary focus:ring-2 focus:ring-light-primary/50 dark:border-gray-600 dark:text-dark-text dark:focus:border-dark-primary dark:focus:ring-dark-primary/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-light-primary dark:hover:text-dark-primary"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-10 pr-10 text-light-text outline-none transition-all duration-300 focus:border-light-primary focus:ring-2 focus:ring-light-primary/50 dark:border-gray-600 dark:text-dark-text dark:focus:border-dark-primary dark:focus:ring-dark-primary/50"
            />
          </div>

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
              'Reset Password'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;