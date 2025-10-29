import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

const Header = ({ theme, toggleTheme, onMenuClick, user }) => {
  return (
    <header className="sticky top-0 z-10 flex h-20 w-full items-center justify-between bg-light-card px-6 shadow-md dark:bg-dark-card lg:justify-end">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="text-light-text dark:text-dark-text lg:hidden"
      >
        <Menu className="h-7 w-7" />
      </button>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-light-text hover:bg-gray-200 dark:text-dark-text dark:hover:bg-gray-700"
        >
          {theme === 'light' ? (
            <Moon className="h-6 w-6" />
          ) : (
            <Sun className="h-6 w-6" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${
              user?.name || 'User'
            }`}
            alt="avatar"
            className="h-10 w-10 rounded-full bg-gray-300"
          />
          <span className="hidden font-semibold md:block">{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;