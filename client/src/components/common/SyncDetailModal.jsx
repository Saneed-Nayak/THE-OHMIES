import React from 'react';
import { useSyncContext } from '../../context/SyncContext';
import { formatDateIST } from '../../utils/formatters';
import { X, RefreshCw } from 'lucide-react';

const SyncDetailModal = ({ onClose }) => {
  const { pendingCount, conflictCount, lastSyncedAt, triggerSync, isSyncing } = useSyncContext();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Sync Status</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Last synced:</span>
              <span className="font-medium">{lastSyncedAt ? formatDateIST(lastSyncedAt) : 'Never'}</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Pending records:</span>
              <span className={`font-bold ${pendingCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {pendingCount}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Conflicts detected:</span>
              <span className={`font-bold ${conflictCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {conflictCount}
              </span>
            </div>
          </div>
          
          <div className="mt-8 pt-4">
            <button 
              onClick={triggerSync} 
              disabled={isSyncing}
              className="w-full btn-primary flex items-center justify-center"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing Now...' : 'Force Manual Sync'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncDetailModal;