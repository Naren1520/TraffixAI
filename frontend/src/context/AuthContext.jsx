import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { apiUrl } from '../api';

const AuthContext = createContext(null);

const JWT_KEY = 'traffixai_jwt';
const USER_KEY = 'traffixai_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(JWT_KEY));
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Attach JWT to all axios requests when available
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const jwt = localStorage.getItem(JWT_KEY);
      if (jwt) {
        config.headers['Authorization'] = `Bearer ${jwt}`;
      }
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // Load recent searches once logged in
  useEffect(() => {
    if (user && token) {
      fetchRecentSearches();
    }
  }, [user, token]);

  const fetchRecentSearches = async () => {
    try {
      const res = await axios.get(apiUrl('/api/user/searches'));
      setRecentSearches(res.data);
    } catch (err) {
      console.error('Failed to fetch recent searches:', err);
    }
  };

  /**
   * Called after Google sign-in succeeds on the frontend.
   * Sends the Google ID token to our backend for verification + JWT issuance.
   */
  const loginWithGoogle = useCallback(async (googleIdToken) => {
    setLoading(true);
    try {
      const res = await axios.post(apiUrl('/api/auth/google'), { idToken: googleIdToken });
      const { token: jwt, user: userData } = res.data;

      localStorage.setItem(JWT_KEY, jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);

      // Fetch searches in the background — don't block login success on this
      axios.get(apiUrl('/api/user/searches'), {
        headers: { Authorization: `Bearer ${jwt}` }
      }).then(searchRes => {
        setRecentSearches(searchRes.data);
      }).catch(err => {
        console.warn('Could not fetch recent searches after login:', err);
      });

      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setRecentSearches([]);
  }, []);

  /**
   * Saves a city search to the backend and updates local state.
   * Call this whenever the user searches for a city on the Dashboard.
   */
  const saveSearch = useCallback(async (city, lat, lng) => {
    if (!user) return; // not logged in, silently skip
    try {
      const res = await axios.post(apiUrl('/api/user/searches'), { city, lat, lng });
      setRecentSearches(res.data);
    } catch (err) {
      console.error('Failed to save search:', err);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      recentSearches,
      loginWithGoogle,
      logout,
      saveSearch,
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
