import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- Layouts ---
// These files should exist in src/layouts/
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';

// --- Page Loading ---
// We use lazy loading to make the app faster
// These files will exist in src/pages/
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));

// --- Admin Pages ---
// These files will exist in src/pages/admin/
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const AllHistory = lazy(() => import('./pages/admin/AllHistory'));
const AllFeedback = lazy(() => import('./pages/admin/AllFeedback'));

// --- Helper Components ---
// This file should exist in src/components/
import LoadingSpinner from './components/LoadingSpinner';

// --- Authentication ---
// A custom component to protect routes for logged-in users
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// A custom component to protect admin routes
const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return token && role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  // --- Theme State (Light/Dark Mode) ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Apply the theme class to the HTML element whenever the theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      {/* --- Toast Notifications Setup --- */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1e1e3f' : '#ffffff', // Dark/Light card background
            color: theme === 'dark' ? '#e0e0ff' : '#1a1a2e', // Dark/Light text
          },
        }}
      />
      {/* --- Main Routing Logic --- */}
      {/* Suspense shows a loading spinner while pages are loaded */}
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* --- Public Routes (Login/Register/Password Reset) --- */}
          {/* These routes are accessible without logging in */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* --- User Routes (Protected) --- */}
          {/* These routes require the user to be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={<AppLayout theme={theme} toggleTheme={toggleTheme} />}
            >
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* --- Admin Routes (Protected) --- */}
          {/* These routes require the user to be logged in AND have the 'admin' role */}
          <Route element={<AdminRoute />}>
            <Route
              element={<AdminLayout theme={theme} toggleTheme={toggleTheme} />}
            >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/history" element={<AllHistory />} />
              <Route path="/admin/feedback" element={<AllFeedback />} />
            </Route>
          </Route>

          {/* --- Fallback Route --- */}
          {/* If no other route matches, redirect to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
