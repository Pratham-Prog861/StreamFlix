import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchInput from './SearchInput';

const Header: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo and Nav */}
        <div className="flex items-center space-x-8 flex-shrink-0">
          <Link
            to="/"
            className="text-red-600 text-2xl md:text-3xl font-black tracking-tight hover:text-red-500 transition-colors"
          >
            STREAMFLIX
          </Link>
          <nav className="hidden lg:flex space-x-6">
            <Link
              to="/"
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Browse
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-red-500 hover:text-red-400 transition-colors text-sm font-bold"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <SearchInput />
        </div>

        {/* Right: User Profile/Auth */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="md:hidden">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-white hover:text-gray-300 transition-colors">
                <img
                  src={user.avatar || 'https://picsum.photos/seed/user/200'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-red-600 hover:scale-110 transition-transform"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Expand */}
      {showSearch && (
        <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top duration-300">
          <SearchInput isMobile onClose={() => setShowSearch(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
