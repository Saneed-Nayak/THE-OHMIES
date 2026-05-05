import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';

const ReportsPage = () => {
  const [stats, setStats] = useState({
    totalBeneficiaries: 0,
    totalShops: 0,
    totalTransactions: 0,
    totalConflicts: 0,
    monthlyDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [beneficiariesRes, shopsRes, transactionsRes, conflictsRes] = await Promise.all([
        api.get('/beneficiaries'),
        api.get('/shops'),
        api.get('/transactions/stats'),
        api.get('/conflicts/stats')
      ]);

      setStats({
        totalBeneficiaries: beneficiariesRes.data.data?.length || 0,
        totalShops: shopsRes.data.data?.length || 0,
        totalTransactions: transactionsRes.data.data?.total || 0,
        totalConflicts: conflictsRes.data.data?.total || 0,
        monthlyDistribution: transactionsRes.data.data?.daily || []
      });
    } catch (err) {
      toast.error('Failed to load reports');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type) => {
    toast.success(`Exporting ${type} report...`);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading reports...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-black text-gray-900">Reports & Analytics</h1>
        </div>
        <button 
          onClick={() => handleExport('full')}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-semibold">Total Beneficiaries</p>
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-4xl font-black">{stats.totalBeneficiaries}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm font-semibold">Active Shops</p>
            <TrendingUp className="w-5 h-5 text-green-200" />
          </div>
          <p className="text-4xl font-black">{stats.totalShops}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100 text-sm font-semibold">Total Transactions</p>
            <TrendingUp className="w-5 h-5 text-purple-200" />
          </div>
          <p className="text-4xl font-black">{stats.totalTransactions}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100 text-sm font-semibold">Conflicts Detected</p>
            <TrendingUp className="w-5 h-5 text-red-200" />
          </div>
          <p className="text-4xl font-black">{stats.totalConflicts}</p>
        </div>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Report */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Distribution Report</h2>
            <button 
              onClick={() => handleExport('distribution')}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Export
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-700">Monthly Distributions</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalTransactions}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-700">Average per Shop</span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalShops > 0 ? Math.round(stats.totalTransactions / stats.totalShops) : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Conflict Report */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Conflict Report</h2>
            <button 
              onClick={() => handleExport('conflicts')}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Export
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-semibold text-red-700">Total Conflicts</span>
              <span className="text-lg font-bold text-red-900">{stats.totalConflicts}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-semibold text-green-700">Fraud Detection Rate</span>
              <span className="text-lg font-bold text-green-900">
                {stats.totalTransactions > 0 
                  ? ((stats.totalConflicts / stats.totalTransactions) * 100).toFixed(2)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Beneficiary Report */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Beneficiary Report</h2>
            <button 
              onClick={() => handleExport('beneficiaries')}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Export
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-semibold text-blue-700">Registered Beneficiaries</span>
              <span className="text-lg font-bold text-blue-900">{stats.totalBeneficiaries}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-700">Coverage Rate</span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalBeneficiaries > 0 && stats.totalTransactions > 0
                  ? ((stats.totalTransactions / stats.totalBeneficiaries) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Shop Performance */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Shop Performance</h2>
            <button 
              onClick={() => handleExport('shops')}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Export
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-semibold text-green-700">Active Shops</span>
              <span className="text-lg font-bold text-green-900">{stats.totalShops}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-700">Avg Transactions/Shop</span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalShops > 0 ? Math.round(stats.totalTransactions / stats.totalShops) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-gray-900">Custom Date Range</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input type="date" className="input" />
          <input type="date" className="input" />
          <button className="btn-primary">Generate Report</button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
