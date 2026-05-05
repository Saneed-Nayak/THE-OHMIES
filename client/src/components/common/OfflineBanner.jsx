import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-red-600 text-white w-full py-2 px-4 flex items-center justify-center font-medium shadow-md z-50 fixed top-0 left-0">
      <WifiOff className="w-5 h-5 mr-2 animate-pulse" />
      <span>⚠ You are offline. Transactions are saved locally and will sync automatically when connected.</span>
    </div>
  );
};

export default OfflineBanner;