import { useState, useEffect } from 'react';
import api from '../services/api';
import { db } from '../db/localDB';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { token: newToken, user: userData } = res.data.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      // Save user context specifically for offline access
      if (userData.shopId && typeof userData.shopId === 'object') {
        const shopIdStr = userData.shopId.shopId;
        await db.appConfig.put({ key: 'shopId', value: shopIdStr });
      }
      await db.appConfig.put({ key: 'officerId', value: userData._id });
      
      return userData;
    }
    throw new Error('Login failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.log('Logged out locally');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  return { user, token, isAuthenticated: !!token, login, logout, isLoading };
};