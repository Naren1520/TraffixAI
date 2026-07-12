import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('traffixai-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch (error) {
      console.error('Failed to restore auth state', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (idToken) => {
    const response = await axios.post(apiUrl('/api/auth/google'), { idToken });
    const userData = response.data;
    const authRecord = {
      user: userData,
      token: idToken,
    };
    localStorage.setItem('traffixai-auth', JSON.stringify(authRecord));
    setUser(userData);
    setToken(idToken);
    return userData;
  };

  const signOut = () => {
    localStorage.removeItem('traffixai-auth');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
