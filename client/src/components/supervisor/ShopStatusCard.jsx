import React from 'react';
import { Store, Wifi, WifiOff } from 'lucide-react';

const ShopStatusCard = ({ shop }) => {
  // Mock data structure expected from API
  const { name, shopId, officerName, todayCount, pendingSync, lastSyncTime, isOnline } = shop;

  return (
    <div className="card hover:border-primary transition-colors cursor-default">
      <div className="flex justify-between items-start mb-4 border-b pb-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-50 rounded-lg mr-3">
            <Store className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-xs font-mono text-gray-500">{shopId}</p>
          </div>
        </div>
        <div className={`p-1.5 rounded-full ${isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} title={isOnline ? 'Online' : 'Offline'}>
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs uppercase text-gray-500 font-bold">Officer</p>
          <p className="text-sm font-medium">{officerName || 'Unassigned'}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500 font-bold">Today's Txns</p>
          <p className="text-xl font-black text-gray-900">{todayCount || 0}</p>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm border-t pt-3">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${pendingSync > 0 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
          <span className="text-gray-600">{pendingSync || 0} pending sync</span>
        </div>
        <span className="text-gray-400 text-xs">{lastSyncTime || 'Never'}</span>
      </div>
    </div>
  );
};

export default ShopStatusCard;