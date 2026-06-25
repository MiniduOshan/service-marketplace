import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredSessionUser, getStoredSessionToken, storeSession, clearSession as clearApiSession, apiRequest } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getStoredSessionToken();
    const storedUser = getStoredSessionUser();
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      if (storedUser) {
        setUser(storedUser);
      } else {
        // Fallback if token exists but user doesn't
        // const userData = await apiRequest('/auth/me');
        // setUser(userData);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      clearApiSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token, userData) => {
    storeSession(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearApiSession();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
