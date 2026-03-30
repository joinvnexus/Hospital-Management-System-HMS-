import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return '?';
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (role === 'patient') {
      navigate('/patient/profile');
    } else if (role === 'doctor') {
      navigate('/doctor/profile');
    }
    setDropdownOpen(false);
  };

  const publicNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/doctors', label: 'Doctors' },
  ];

  const authenticatedNavLinks = role === 'patient'
    ? [
        { href: '/', label: 'Home' },
        { href: '/doctors', label: 'Doctors' },
        { href: '/patient/dashboard', label: 'Dashboard' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/doctor/dashboard', label: 'Dashboard' },
      ];

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;

  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold">HMS</h1>
            <span className="ml-2 text-sm hidden sm:inline">Hospital Management System</span>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-4 items-center flex-1 justify-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`
                    hover:text-blue-200 transition-colors px-3 py-2 rounded-md text-sm
                    ${location.pathname === link.href ? 'bg-blue-700' : ''}
                  `}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* User Profile Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {getInitials()}
                </div>
                {/* User Name */}
                <span className="text-sm hidden sm:inline">
                  {user.firstName} {user.lastName}
                </span>
                {/* Dropdown Arrow */}
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{role === 'patient' ? 'Patient' : 'Doctor'}</p>
                  </div>

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    View Profile
                  </button>

                  {role === 'doctor' && (
                    <button
                      onClick={() => {
                        navigate('/doctor/schedule');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      Manage Schedule
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-700 transition-colors border-t border-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/login')}
                className="text-white hover:text-blue-200 px-3 py-2 text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register/patient')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
