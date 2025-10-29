import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Sun,
  LogOut,
  User,
  History,
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  HeartPulse, // Added Icon for project name
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ theme, toggleTheme, isAdmin }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Attempt to load user info from local storage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user'); // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }
    } else {
        // If no user in local storage but trying to access protected area, redirect
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/forgot-password' && !window.location.pathname.startsWith('/reset-password') ) {
             // Redirect only if not already on a public page
            // navigate('/login'); // Avoid redirect loop if already going there
        }
    }
  }, [navigate]);


  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUser(null); // Clear user state
    toast.success('Logged out successfully!');
    navigate('/login'); // Redirect to login page
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
      closed: { opacity: 0, height: 0 },
      open: { opacity: 1, height: "auto" }
  };

  // Define links based on admin status
  const userLinks = [
    { to: '/', icon: <HeartPulse className="h-5 w-5" />, label: 'Predict' },
    { to: '/history', icon: <History className="h-5 w-5" />, label: 'History' },
    { to: '/profile', icon: <User className="h-5 w-5" />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/admin/users', icon: <Users className="h-5 w-5" />, label: 'Users' },
    { to: '/admin/history', icon: <BarChart3 className="h-5 w-5" />, label: 'History' },
    { to: '/admin/feedback', icon: <MessageSquare className="h-5 w-5" />, label: 'Feedback' },
    { to: '/', icon: <HeartPulse className="h-5 w-5" />, label: 'Predict' }, // Keep predict link for admin too
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="sticky top-0 z-40 bg-light-card shadow-md dark:bg-dark-card dark:border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Project Name */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-light-primary dark:text-dark-primary">
            <HeartPulse className="h-7 w-7" />
            <span>SleepMetrics</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary'
                      : 'text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side controls: Theme Toggle, User Menu/Logout, Mobile Menu Button */}
          <div className="flex items-center gap-3">
             {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="rounded-full p-2 text-light-text/70 transition-colors hover:bg-gray-200 hover:text-light-text dark:text-dark-text/70 dark:hover:bg-gray-700 dark:hover:text-dark-text"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>

             {/* Logout Button (if logged in) */}
             {user && (
                 <motion.button
                    onClick={handleLogout}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden sm:inline">Logout</span> {/* Hide text on small screens */}
                </motion.button>
             )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-md p-2 text-light-text/70 hover:text-light-text focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-primary dark:text-dark-text/70 dark:hover:text-dark-text dark:focus:ring-dark-primary"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

       {/* Mobile Menu Dropdown */}
       <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700"
            >
            <div className="space-y-1 px-2 pb-3 pt-2">
                {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 ${
                        isActive
                        ? 'bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary'
                        : 'text-light-text/80 hover:bg-gray-100 hover:text-light-text dark:text-dark-text/80 dark:hover:bg-gray-700 dark:hover:text-dark-text'
                    }`
                    }
                >
                    {link.icon}
                    {link.label}
                </NavLink>
                ))}
            </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
