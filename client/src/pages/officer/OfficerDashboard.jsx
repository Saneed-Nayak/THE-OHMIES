import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { db } from '../../db/localDB';
import { ClipboardList, Users, History } from 'lucide-react';

const OfficerDashboard = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({ target: 0, completed: 0, pendingSync: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      const allTxns = await db.transactions.toArray();
      const todayTxns = allTxns.filter(t => {
        if (!t.recordedAt) return false;
        const dateStr = t.recordedAt instanceof Date ? t.recordedAt.toISOString() : String(t.recordedAt);
        return dateStr.startsWith(today);
      });
      const pending = await db.pendingSync.count();
      
      setStats({
        target: 100, // mock target
        completed: todayTxns.length,
        pendingSync: pending
      });
    };
    loadStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome, {user?.name || 'Officer'}</h1>
      <p className="text-gray-500 font-medium mb-8">Here is your activity for today.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center hover:border-primary transition">
          <div className="p-4 bg-green-100 rounded-full mr-4 text-green-600"><ClipboardList size={28} /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Today's Txns</p>
            <p className="text-3xl font-black text-gray-900">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center hover:border-primary transition">
          <div className="p-4 bg-amber-100 rounded-full mr-4 text-amber-600"><History size={28} /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pending Sync</p>
            <p className="text-3xl font-black text-gray-900">{stats.pendingSync}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center hover:border-primary transition">
          <div className="p-4 bg-blue-100 rounded-full mr-4 text-blue-600"><Users size={28} /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Beneficiaries</p>
            <Link to="/officer/beneficiaries" className="text-blue-600 font-bold hover:underline">View Local Roster →</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-2">Ready to distribute?</h2>
          <p className="text-gray-600 mb-6 font-medium">Record a new transaction. The system will automatically check for duplicate collections offline.</p>
          <Link to="/officer/record" className="btn-primary py-4 px-6 text-center text-lg shadow-md hover:shadow-lg transition font-bold flex justify-center items-center">
            <span className="text-2xl mr-2">+</span> Record New Distribution
          </Link>
        </div>
        <div className="flex flex-col justify-center">
           <h2 className="text-xl font-bold mb-2">Review Past Records</h2>
           <p className="text-gray-600 mb-6 font-medium">View chronological logs of all successful and conflicted transactions for your shop.</p>
          <Link to="/officer/history" className="bg-white border-2 border-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg text-center text-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-gray-200 transition">
            View History Ledger
          </Link>
        </div>
      </div>
    </div>
  );
};
export default OfficerDashboard;