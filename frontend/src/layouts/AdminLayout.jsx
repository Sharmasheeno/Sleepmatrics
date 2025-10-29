import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, MessageSquare, LogOut } from 'lucide-react';
import Header from './Header'; // Corrected import path

const AdminLayout = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'All History', icon: BarChart3, path: '/admin/history' },
    { name: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
  ];

  return (
    <div className="flex h-screen w-full bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
      {/* --- Mobile Sidebar Backdrop --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- Sidebar --- */}
      <nav
        className={`fixed z-30 flex h-full w-64 flex-col bg-light-card shadow-lg transition-transform duration-300 ease-in-out dark:bg-dark-card lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-center border-b border-b-gray-200 dark:border-b-gray-700">
          <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
            Admin Panel
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-6 py-4 text-lg font-medium text-gray-600 hover:bg-light-primary/10 hover:text-light-primary dark:text-gray-300 dark:hover:bg-dark-primary/10 dark:hover:text-dark-primary"
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="border-t border-t-gray-200 p-4 dark:border-t-gray-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-3 text-lg font-medium text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="mr-3 h-6 w-6" />
            Logout
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* --- Top Header Bar --- */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuClick={() => setSidebarOpen(true)}
          user={{ ...user, name: `${user?.name || 'Admin'} (Admin)` }}
        />

        {/* --- Page Content --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-light-bg dark:bg-dark-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
