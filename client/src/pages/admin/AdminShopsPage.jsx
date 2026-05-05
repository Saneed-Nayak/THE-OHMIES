import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Store, Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import ShopFormModal from '../../components/admin/ShopFormModal';

const AdminShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shopsRes, usersRes] = await Promise.all([
        api.get('/shops'),
        api.get('/users')
      ]);
      setShops(shopsRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedShop(null);
    setShowModal(true);
  };

  const handleEdit = (shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const handleDelete = async (shopId) => {
    if (!confirm('Are you sure you want to delete this shop?')) return;
    
    try {
      await api.delete(`/shops/${shopId}`);
      toast.success('Shop deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete shop');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedShop) {
        await api.put(`/shops/${selectedShop.shopId}`, formData);
        toast.success('Shop updated successfully');
      } else {
        await api.post('/shops', formData);
        toast.success('Shop created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading shops...</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto pb-12 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Store className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-black text-gray-900">Shop Management</h1>
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Shop
          </button>
        </div>

        {shops.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xl font-bold text-gray-600">No shops found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div key={shop.shopId} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{shop.name}</h3>
                    <p className="text-sm font-mono text-gray-600">{shop.shopId}</p>
                  </div>
                  <Store className="w-6 h-6 text-green-600" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-700">{shop.location?.address || 'N/A'}</p>
                      {shop.location?.district && (
                        <p className="text-xs text-gray-500">
                          {shop.location.district}, {shop.location.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Assigned Officer</p>
                    <p className="font-semibold text-gray-900">
                      {shop.assignedOfficer?.name || 'Unassigned'}
                    </p>
                    {shop.assignedOfficer?.email && (
                      <p className="text-xs text-gray-600">{shop.assignedOfficer.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button 
                    onClick={() => handleEdit(shop)}
                    className="flex-1 text-sm font-semibold text-blue-600 hover:text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-50 transition inline-flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(shop.shopId)}
                    className="flex-1 text-sm font-semibold text-red-600 hover:text-red-800 py-2 px-3 rounded-lg hover:bg-red-50 transition inline-flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ShopFormModal
          shop={selectedShop}
          users={users}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default AdminShopsPage;
