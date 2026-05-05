import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatItems, formatDateIST } from '../../utils/formatters';
import { Receipt } from 'lucide-react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    shopId: '',
    month: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (filters.shopId) params.shopId = filters.shopId;
      if (filters.month) params.month = filters.month;

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load transactions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setIsLoading(true);
    fetchTransactions();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading transactions...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <Receipt className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-black text-gray-900">All Transactions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="shopId"
            placeholder="Filter by Shop ID"
            value={filters.shopId}
            onChange={handleFilterChange}
            className="input"
          />
          <input
            type="text"
            name="month"
            placeholder="Filter by Month (e.g., 2024-05)"
            value={filters.month}
            onChange={handleFilterChange}
            className="input"
          />
          <button onClick={handleApplyFilters} className="btn-primary">
            Apply Filters
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xl font-bold text-gray-600">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div key={txn._id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-lg">{txn.beneficiaryName}</p>
                  <p className="text-sm text-gray-600 font-mono">{txn.cardId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-700">{txn.shopId}</p>
                  <p className="text-xs text-gray-500">{formatDateIST(txn.recordedAt)}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-sm text-gray-800">{formatItems(txn.itemsDistributed)}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {txn.month}
                </span>
                {txn.isOfflineRecord && (
                  <span className="text-xs font-bold text-amber-600">Offline Record</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
