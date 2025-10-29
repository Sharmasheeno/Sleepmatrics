import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Key, Loader } from 'lucide-react';
import { registerUser } from '../api/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- THIS IS FOR NAVIGATION AFTER REGISTERING

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Creating account...');

    try {
      // If adminKey is empty, send undefined so it's not included
      const keyToSend = adminKey.trim() === '' ? undefined : adminKey;

      await registerUser(name, email, password, keyToSend);
      toast.success('Account created! Please log in.', { id: toastId });
      
      // <-- NAVIGATION HAPPENS HERE
      navigate('/login'); // Automatically send user to login page
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed. Please try again.',
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
            Create Account
          </h1>
          <p className="mt-2 text-lg text-light-text/70 dark:text-dark-text/70">
            Start your journey with SleepMetrics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-10 text-light-text outline-none transition-all duration-300 focus:border-light-primary focus:ring-2 focus:ring-light-primary/50 dark:border-gray-600 dark:text-dark-text dark:focus:border-dark-primary dark:focus:ring-dark-primary/50"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-10 text-light-text outline-none transition-all duration-300 focus:border-light-primary focus:ring-2 focus:ring-light-primary/50 dark:border-gray-600 dark:text-dark-text dark:focus:border-dark-primary dark:focus:ring-dark-primary/50"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
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
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Admin Key Input */}
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Admin Key (Optional)"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-10 text-light-text outline-none transition-all duration-300 focus:border-light-primary focus:ring-2 focus:ring-light-primary/50 dark:border-gray-600 dark:text-dark-text dark:focus:border-dark-primary dark:focus:ring-dark-primary/50"
            />
          </div>

          {/* <-- HERE IS THE COMPLETE SUBMIT BUTTON */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-light-primary p-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-light-primary/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-primary dark:hover:bg-dark-primary/80"
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <User className="h-5 w-5" />
            )}
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-light-text/70 dark:text-dark-text/70">
          Already have an account?{' '}
          {/* <-- CLICKABLE NAVIGATION LINK */}
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

export default Register;