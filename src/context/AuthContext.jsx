import React, { createContext, useContext, useState, useEffect } from 'react';
import instance from '../API';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  loading: true
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem('token');
        console.log(token);
        
        if (token) {
          // Verify token with backend
          const response = await instance.get('/api/auth/login', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          // Set user and authentication status
          setUser(response.data.user);
          setIsAuthenticated(true);
          setIsAdmin(response.data.user.role === 'admin');
        }
      } catch (error) {
        // Clear authentication if token is invalid
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData, token) => {
    // Store token in local storage
    localStorage.setItem('token', token);
    userData.tokens = token;
    console.log(userData);
    // Update user state
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'admin');
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    
    // Reset states
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};