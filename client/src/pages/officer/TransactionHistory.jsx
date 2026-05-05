import React, { useState, useEffect } from 'react';
import { db } from '../../db/localDB';

// Define localized fallbacks since utils/formatters might be tightly scoped
const formatDateIST = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
};
const formatItems = (obj) => {
  if (!obj) return '';
  return Object.entries(obj).filter(([_, val]) => val > 0).map(([key, val]) => `${val}kg ${key}`).join(', ');
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const txns = await db.transactions.orderBy('recordedAt').reverse().toArray();
      setTransactions(txns);
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Transaction History</h1>
      <p className="text-gray-500 font-medium mb-8">View all recent offline and online distributions recorded on this device.</p>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium bg-gray-50">
            No transactions recorded yet in local storage.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Date & Time (IST)</th>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Beneficiary</th>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Card ID</th>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Items Distributed</th>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map(t => (
                  <tr key={t.txnId} className="hover:bg-gray-50 transition">
                    <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-700">{formatDateIST(t.recordedAt)}</td>
                    <td className="p-4 font-bold text-gray-900">{t.beneficiaryName}</td>
                    <td className="p-4 font-mono text-sm text-gray-500">{t.cardId}</td>
                    <td className="p-4 text-sm text-gray-800 bg-white shadow-sm border border-gray-100 rounded inline-block mt-2 ml-4 px-2 py-1">{formatItems(t.itemsDistributed)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        t.status === 'synced' ? 'bg-green-50 text-green-700 border-green-200' :
                        t.status === 'conflict' ? 'bg-red-50 text-red-700 border-red-200' :
                        t.status === 'rejected' ? 'bg-gray-100 text-gray-600 border-gray-300' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default TransactionHistory;