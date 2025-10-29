import React, { useState } from 'react'; // Corrected import
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Loader, LogIn } from 'lucide-react';
import { loginUser } from '../api/api.js'; // Import correct function

const Login = () => {
  // Corrected useState calls
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Logging in...');

    try {
      const { data } = await loginUser(email, password);

      // Store token, user role, and basic user info in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify({ // Store user object
        id: data.user._id, // Make sure backend sends _id
        name: data.user.name,
        email: data.user.email,
      }));

      toast.success('Login successful!', { id: toastId });

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); // Redirect normal users to home
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Check credentials.',
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
            Welcome Back!
          </h1>
          <p className="mt-2 text-lg text-light-text/70 dark:text-dark-text/70">
            Sign in to access SleepMetrics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password" // <-- Clickable Navigation Link
              className="text-sm font-semibold text-light-primary hover:underline dark:text-dark-primary"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit" // <-- This makes it the form submit button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-light-primary p-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-light-primary/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-primary dark:hover:bg-dark-primary/80"
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-light-text/70 dark:text-dark-text/70">
          Don't have an account?{' '}
          <Link
            to="/register" // <-- Clickable Navigation Link
            className="font-semibold text-light-primary hover:underline dark:text-dark-primary"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

