import React, { useState, useEffect } from 'react';
import { db } from '../../db/localDB';
import { Search, RefreshCw } from 'lucide-react';
import { useSyncContext } from '../../context/SyncContext';
import toast from 'react-hot-toast';

const BeneficiaryList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { triggerSync, isSyncing } = useSyncContext();

  const fetchBens = async () => {
    let req = db.beneficiaries;
    if (searchQuery) {
      const list = await req.filter(b => b.cardId.toLowerCase().includes(searchQuery.toLowerCase()) || b.name.toLowerCase().includes(searchQuery.toLowerCase())).toArray();
      setBeneficiaries(list);
    } else {
      const list = await req.limit(100).toArray();
      setBeneficiaries(list);
    }
  };

  useEffect(() => {
    fetchBens();
  }, [searchQuery]);

  const handleSync = async () => {
    toast.loading('Syncing beneficiaries...', { id: 'sync' });
    await triggerSync();
    await fetchBens();
    toast.success('Sync complete!', { id: 'sync' });
  };

  return (
    <div className="container-responsive max-w-6xl pb-8 sm:pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Beneficiaries Roster</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">List of village families mapped to this shop securely synced to local storage.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="btn-primary flex items-center gap-2 whitespace-nowrap tap-target"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search records by Card ID or Name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium shadow-sm transition text-sm sm:text-base"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {beneficiaries.map(b => (
          <div key={b.cardId} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-500 transition">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">{b.name}</h3>
              <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full ${
                b.category === 'AAY' ? 'bg-purple-100 text-purple-800' :
                b.category === 'BPL' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
              }`}>{b.category}</span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded inline-block mb-3 sm:mb-4 border">{b.cardId}</p>
            <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs uppercase font-bold text-gray-400 mb-1">Monthly Quota Limits</p>
              <div className="flex space-x-3 sm:space-x-4">
                <div><span className="font-black text-gray-800">{b.monthlyQuota?.rice || 0}kg</span> Rice</div>
                <div><span className="font-black text-gray-800">{b.monthlyQuota?.wheat || 0}kg</span> Wheat</div>
              </div>
            </div>
          </div>
        ))}
        {beneficiaries.length === 0 && (
          <div className="col-span-full p-8 sm:p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 font-medium">
            <p className="mb-4">No beneficiaries found matching your search or database is empty.</p>
            <button onClick={handleSync} className="btn-primary inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync Beneficiaries
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BeneficiaryList;