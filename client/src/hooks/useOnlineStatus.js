import { useState, useEffect } from 'react';
import api from '../services/api';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastChecked, setLastChecked] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const pingServer = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }
      try {
        await api.get('/health', { timeout: 5000 });
        setIsOnline(true);
      } catch (err) {
        setIsOnline(false);
      }
      setLastChecked(new Date());
    };

    const interval = setInterval(pingServer, 30000); // 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, lastChecked };
};