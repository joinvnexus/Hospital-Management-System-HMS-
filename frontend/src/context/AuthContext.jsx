import React from 'react';
import { getStoredUser, normalizeAuthUser } from '../utils/auth';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(() =>
    normalizeAuthUser(getStoredUser(), localStorage.getItem('role'))
  );
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));
  const [role, setRole] = React.useState(localStorage.getItem('role') || null);
  const [loading, setLoading] = React.useState(false);

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = normalizeAuthUser(getStoredUser(), storedRole);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, authToken, userRole) => {
    const normalizedUser = normalizeAuthUser(userData, userRole);
    setUser(normalizedUser);
    setToken(authToken);
    setRole(userRole);
    setIsAuthenticated(true);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const clearError = () => {
    // Error clearing for any error state management
  };

  const value = {
    user,
    token,
    isAuthenticated,
    role,
    loading,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
