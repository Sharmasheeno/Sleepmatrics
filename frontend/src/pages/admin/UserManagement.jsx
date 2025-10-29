import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, Trash2, Shield, User, Loader } from 'lucide-react';
import { getAllUsers, deleteUser } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const toastId = toast.loading('Deleting user...');
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully', { id: toastId });
        fetchUsers(); // Refresh the user list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user.', { id: toastId });
      }
    }
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
        <h1 className="text-4xl font-bold">User Management</h1>
        <div className="flex items-center gap-2 rounded-full bg-light-primary/10 px-4 py-2 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary">
          <Users className="h-5 w-5" />
          <span className="font-semibold">{users.length} Total Users</span>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-2xl bg-light-card shadow-xl dark:bg-dark-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-text/70 dark:text-dark-text/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
                        alt="avatar"
                        className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"
                      />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {user.role === 'admin' ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        <User className="h-3 w-3" />
                        User
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === 'admin'}
                      className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                      title={user.role === 'admin' ? "Cannot delete admin" : "Delete user"}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default UserManagement;
