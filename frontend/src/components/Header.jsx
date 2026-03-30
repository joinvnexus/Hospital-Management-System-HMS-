import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardRoute, getPrimaryNav, getProfileRoute, ROUTES } from '../utils/routes';

const Header = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const navLinks = getPrimaryNav(role, isAuthenticated);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return role === 'doctor' ? 'DR' : 'PT';
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate(ROUTES.home);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
      <nav className="section-wrap px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => navigate(isAuthenticated ? getDashboardRoute(role) : ROUTES.home)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 font-black text-slate-950">
              HMS
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Care Ops</p>
              <p className="text-base font-semibold">Hospital Management System</p>
            </div>
          </div>

          <ul className="hidden flex-1 items-center justify-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-slate-950'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/20 text-sm font-bold text-sky-100">
                  {getInitials()}
                </div>
                <span className="hidden text-sm sm:inline">
                  {user.firstName || ''} {user.lastName || ''}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-3xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-medium">
                      {user.firstName || 'User'} {user.lastName || ''}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate(getProfileRoute(role));
                      setDropdownOpen(false);
                    }}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50"
                  >
                    View Profile
                  </button>

                  {role === 'doctor' && (
                    <button
                      onClick={() => {
                        navigate(ROUTES.doctorSchedule);
                        setDropdownOpen(false);
                      }}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50"
                    >
                      Manage Schedule
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-2xl border-t border-slate-100 px-4 py-3 text-left text-sm text-rose-700 transition-colors hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(ROUTES.login)}
                className="text-sm font-medium text-slate-200 transition-colors hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => navigate(ROUTES.registerPatient)}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-50"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </header>
  );
};

export default Header;
