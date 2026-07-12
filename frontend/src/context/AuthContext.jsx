import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { apiUrl } from '../api';

const AuthContext = createContext(null);

const JWT_KEY  = 'traffixai_jwt';
const USER_KEY = 'traffixai_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [token, setToken]               = useState(() => localStorage.getItem(JWT_KEY));
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading]           = useState(false);

  // Attach JWT to all axios requests
  useEffect(() => {
    const id = axios.interceptors.request.use((config) => {
      const jwt = localStorage.getItem(JWT_KEY);
      if (jwt) config.headers['Authorization'] = `Bearer ${jwt}`;
      return config;
    });
    return () => axios.interceptors.request.eject(id);
  }, []);

  // Load recent searches once logged in
  useEffect(() => {
    if (user && token) fetchRecentSearches();
  }, [user, token]);

  const fetchRecentSearches = async () => {
    try {
      const res = await axios.get(apiUrl('/api/user/searches'));
      setRecentSearches(res.data);
    } catch (err) {
      console.error('Failed to fetch recent searches:', err);
    }
  };

  const loginWithGoogle = useCallback(async (googleIdToken) => {
    setLoading(true);
    try {
      const res = await axios.post(apiUrl('/api/auth/google'), { idToken: googleIdToken });
      const { token: jwt, user: userData } = res.data;

      localStorage.setItem(JWT_KEY,  jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);

      // Background fetch of recent searches
      axios.get(apiUrl('/api/user/searches'), {
        headers: { Authorization: `Bearer ${jwt}` }
      }).then(r => setRecentSearches(r.data))
        .catch(() => {});

      return { success: true, firstLogin: userData.firstLogin };
    } catch (err) {
      console.error('Login failed:', err);
      const status = err.response?.status;
      const msg = status === 429
        ? 'Too many sign-in attempts. Please wait a minute and try again.'
        : err.response?.data?.error || 'Login failed. Please try again.';
      return { success: false, error: msg };
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
    // Reload so the app restarts from the Loader → Login flow
    window.location.href = '/';
  }, []);

  /**
   * Saves the user's default city to the backend and updates local state.
   * Called from DefaultLocationModal and Settings page.
   */
  const updateDefaultLocation = useCallback(async (city, lat, lng) => {
    try {
      const res = await axios.put(apiUrl('/api/user/default-location'), { city, lat, lng });
      // Patch local user state — clear firstLogin flag, set default location
      setUser(prev => {
        const updated = {
          ...prev,
          defaultCity: res.data.defaultCity,
          defaultLat:  res.data.defaultLat,
          defaultLng:  res.data.defaultLng,
          firstLogin:  false,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        return updated;
      });
      return { success: true };
    } catch (err) {
      console.error('Failed to save default location:', err);
      return { success: false };
    }
  }, []);

  const saveSearch = useCallback(async (city, lat, lng) => {
    if (!user) return;
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
      updateDefaultLocation,
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
