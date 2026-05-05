import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import FraudAlertBanner from '../../components/supervisor/FraudAlertBanner';
import ShopStatusCard from '../../components/supervisor/ShopStatusCard';
import DistributionChart from '../../components/supervisor/DistributionChart';
import CategoryBreakdown from '../../components/supervisor/CategoryBreakdown';
import toast from 'react-hot-toast';

const SupervisorDashboard = () => {
  const [shops, setShops] = useState([]);
  const [conflictCount, setConflictCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all assigned shops
        const shopsRes = await api.get('/shops');
        const shopsData = shopsRes.data.data;
        
        // Enhance shops with live backend stats
        const hydratedShops = await Promise.all(shopsData.map(async (shop) => {
          try {
             const statsRes = await api.get(`/shops/${shop.shopId}/stats`);
             const stats = statsRes.data.data;
             return {
               ...shop,
               officerName: shop.assignedOfficer?.name || 'Unassigned',
               todayCount: stats.todayCount || 0,
               pendingSync: stats.pendingCount || 0,
               lastSyncTime: stats.lastSyncTime || 'N/A',
               isOnline: stats.isOnline ?? true // Mock online status from backend if it tracks heartbeats
             };
          } catch (e) {
             return { ...shop, officerName: 'Unassigned', isOnline: false };
          }
        }));
        
        setShops(hydratedShops);

        // Fetch Conflict Stats
        const conflictRes = await api.get('/conflicts/stats');
        setConflictCount(conflictRes.data.data?.unresolvedCount || 0);

        // Fetch Global Txn Stats
        const txnStatsRes = await api.get('/transactions/stats');
        const { daily = [], categories = [] } = txnStatsRes.data.data || {};
        
        setChartData(daily.length ? daily : [{ date: 'Today', count: 0 }]);
        setPieData(categories.length ? categories : [{ name: 'N/A', value: 1 }]);

      } catch (err) {
        toast.error('Failed to load live supervisor data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading live fleet metrics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-6">Supervisor Overview</h1>
      
      <FraudAlertBanner count={conflictCount} />
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Network Fleet Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shops.length > 0 ? shops.map(shop => (
             <ShopStatusCard key={shop.shopId} shop={shop} />
          )) : (
             <div className="col-span-2 text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">No shops reporting in your jurisdiction.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart data={chartData} />
        <CategoryBreakdown data={pieData} />
      </div>
    </div>
  );
};
export default SupervisorDashboard;