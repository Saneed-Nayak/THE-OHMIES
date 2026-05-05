import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, Upload, Search, Trash2, Edit } from 'lucide-react';
import BeneficiaryFormModal from '../../components/admin/BeneficiaryFormModal';

const BeneficiariesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [beneficiariesRes, shopsRes] = await Promise.all([
        api.get('/beneficiaries'),
        api.get('/shops')
      ]);
      setBeneficiaries(beneficiariesRes.data.data || []);
      setShops(shopsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBeneficiary(null);
    setShowModal(true);
  };

  const handleEdit = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowModal(true);
  };

  const handleDelete = async (cardId) => {
    if (!confirm('Are you sure you want to delete this beneficiary?')) return;
    
    try {
      await api.delete(`/beneficiaries/${cardId}`);
      toast.success('Beneficiary deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete beneficiary');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedBeneficiary) {
        await api.put(`/beneficiaries/${selectedBeneficiary.cardId}`, formData);
        toast.success('Beneficiary updated successfully');
      } else {
        await api.post('/beneficiaries', formData);
        toast.success('Beneficiary created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
      console.error(err);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.cardId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category) => {
    const styles = {
      APL: 'bg-blue-100 text-blue-800',
      BPL: 'bg-green-100 text-green-800',
      AAY: 'bg-purple-100 text-purple-800'
    };
    return <span className={`text-xs font-bold px-2 py-1 rounded ${styles[category]}`}>{category}</span>;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading beneficiaries...</div>;
  }

  return (
    <>
      <div className="container-responsive max-w-7xl pb-8 sm:pb-12 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Beneficiary Management</h1>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Import</span>
              <span className="sm:hidden">Import</span>
            </button>
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Beneficiary</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or card ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 sm:pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="APL">APL</option>
              <option value="BPL">BPL</option>
              <option value="AAY">AAY</option>
            </select>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <span className="font-semibold text-gray-700">
                Total: {filteredBeneficiaries.length}
              </span>
            </div>
          </div>
        </div>

        {/* Beneficiaries Table */}
        {filteredBeneficiaries.length === 0 ? (
          <div className="text-center p-8 sm:p-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-lg sm:text-xl font-bold text-gray-600">No beneficiaries found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="table-responsive">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-700 uppercase">Card ID</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-700 uppercase hidden md:table-cell">Category</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-700 uppercase hidden lg:table-cell">Shop</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-700 uppercase hidden xl:table-cell">Quota</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-700 uppercase hidden sm:table-cell">Status</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBeneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.cardId} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="font-mono text-xs sm:text-sm font-medium">{beneficiary.cardId}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div>
                          <span className="font-semibold text-sm sm:text-base block">{beneficiary.name}</span>
                          <span className="md:hidden text-xs text-gray-500">{getCategoryBadge(beneficiary.category)}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                        {getCategoryBadge(beneficiary.category)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                        {beneficiary.assignedShopId || 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm hidden xl:table-cell">
                        <div className="text-gray-700">
                          Rice: {beneficiary.monthlyQuota?.rice || 0}kg<br />
                          Wheat: {beneficiary.monthlyQuota?.wheat || 0}kg
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                        {beneficiary.isActive ? (
                          <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        ) : (
                          <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button 
                            onClick={() => handleEdit(beneficiary)}
                            className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 tap-target"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(beneficiary.cardId)}
                            className="text-red-600 hover:text-red-800 font-semibold inline-flex items-center gap-1 tap-target"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <BeneficiaryFormModal
          beneficiary={selectedBeneficiary}
          shops={shops}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default BeneficiariesPage;
