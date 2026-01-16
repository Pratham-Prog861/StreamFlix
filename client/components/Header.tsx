import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchInput from "./SearchInput";

const Header: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMenuOpen
          ? "bg-black"
          : "bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo and Nav */}
        <div className="flex items-center space-x-4 md:space-x-8 flex-shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            {isMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-red-600 text-xl md:text-3xl font-black tracking-tighter hover:text-red-500 transition-colors"
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
        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          <div className="md:hidden">
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                setIsMenuOpen(false);
              }}
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
            <div className="flex items-center space-x-2 md:space-x-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="lg:hidden text-red-500 hover:text-red-400 transition-colors text-[10px] md:text-xs font-black uppercase border border-red-500/30 px-2 py-1 rounded"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-300 transition-colors flex-shrink-0"
              >
                <img
                  src={user.avatar || "https://picsum.photos/seed/user/200"}
                  alt="Profile"
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-red-600 hover:scale-110 transition-transform"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:block text-white hover:text-gray-300 transition-colors text-sm font-medium"
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
                className="bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-red-700 transition-colors text-xs md:text-sm font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-red-500 transition-colors text-lg font-bold border-b border-white/5 pb-2"
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-red-500 transition-colors text-lg font-bold border-b border-white/5 pb-2"
            >
              Browse
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-red-500 hover:text-red-400 transition-colors text-lg font-black border-b border-white/5 pb-2"
              >
                Admin Panel
              </Link>
            )}
            {user && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-red-500 transition-colors text-lg font-bold border-b border-white/5 pb-2"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-400 hover:text-white transition-colors text-lg font-medium pt-2"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Mobile Search Expand */}
      {showSearch && (
        <div className="md:hidden px-4 pb-4 bg-black animate-in slide-in-from-top duration-300">
          <SearchInput isMobile onClose={() => setShowSearch(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
