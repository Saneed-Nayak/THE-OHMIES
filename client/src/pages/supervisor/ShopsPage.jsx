import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ShopStatusCard from '../../components/supervisor/ShopStatusCard';
import toast from 'react-hot-toast';
import { Store } from 'lucide-react';

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const shopsRes = await api.get('/shops');
      const shopsData = shopsRes.data.data;
      
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
            isOnline: stats.isOnline ?? true
          };
        } catch (e) {
          return { ...shop, officerName: 'Unassigned', isOnline: false };
        }
      }));
      
      setShops(hydratedShops);
    } catch (err) {
      toast.error('Failed to load shops');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading shops...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <Store className="w-8 h-8 text-green-600 mr-3" />
        <h1 className="text-3xl font-black text-gray-900">Shop Management</h1>
      </div>

      {shops.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xl font-bold text-gray-600">No shops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shops.map(shop => (
            <ShopStatusCard key={shop.shopId} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopsPage;
