import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Save, Loader } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        toast.error('Could not load profile data.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Updating profile...');

    try {
      const { data } = await updateUserProfile({ name, email });
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Profile updated successfully!', { id: toastId });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update profile.',
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (pageLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-8 text-4xl font-bold">Your Profile</h1>
      <div className="mx-auto max-w-2xl rounded-2xl bg-light-card p-8 shadow-xl dark:bg-dark-card">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-light-primary p-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-light-primary/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-primary dark:hover:bg-dark-primary/80"
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;
