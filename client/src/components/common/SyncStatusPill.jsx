import React, { useState } from 'react';
import { useSyncContext } from '../../context/SyncContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import SyncDetailModal from './SyncDetailModal';
import { RefreshCw, CloudOff, CheckCircle } from 'lucide-react';

const SyncStatusPill = () => {
  const { pendingCount, isSyncing } = useSyncContext();
  const { isOnline } = useOnlineStatus();
  const [modalOpen, setModalOpen] = useState(false);

  let statusConfig = {
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
    text: 'All synced'
  };

  if (!isOnline) {
    statusConfig = {
      color: 'bg-red-100 text-red-800',
      icon: <CloudOff className="w-4 h-4 mr-1" />,
      text: 'Offline'
    };
  } else if (pendingCount > 0) {
    statusConfig = {
      color: 'bg-amber-100 text-amber-800',
      icon: <RefreshCw className={`w-4 h-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />,
      text: `${pendingCount} pending`
    };
  }

  return (
    <>
      <button 
        onClick={() => setModalOpen(true)}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm font-semibold transition hover:opacity-80 ${statusConfig.color}`}
      >
        {statusConfig.icon}
        {statusConfig.text}
      </button>

      {modalOpen && <SyncDetailModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default SyncStatusPill;