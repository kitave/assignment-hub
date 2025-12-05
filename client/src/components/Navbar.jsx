import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  BookOpenIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  PowerIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/classes', label: 'Public Classes' },
  ];

  const authItems = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/create-class', label: 'Create Class' },
    { path: '/create-assignment', label: 'Create Assignment' },
  ] : [
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpenIcon className="h-8 w-8 text-purple-600 dark:text-purple-600" />
            <span className="text-xl font-bold gradient-bg bg-clip-text text-aqua dark:text-black">
              AssignmentHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {authItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {authItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                {isDark ? (
                  <>
                    <SunIcon className="h-5 w-5 mr-2 text-yellow-400" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-5 w-5 mr-2 text-gray-600" />
                    Dark Mode
                  </>
                )}
              </button>

              {/* User Menu Mobile */}
              {isAuthenticated && (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                    Signed in as {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-danger-600 dark:text-red-400 hover:bg-danger-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                  >
                    <PowerIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
