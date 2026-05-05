import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BeneficiaryFormModal = ({ beneficiary, shops, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    cardId: '',
    name: '',
    category: 'BPL',
    assignedShopId: '',
    monthlyQuota: {
      rice: 0,
      wheat: 0,
      sugar: 0,
      kerosene: 0
    },
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (beneficiary) {
      setFormData({
        cardId: beneficiary.cardId || '',
        name: beneficiary.name || '',
        category: beneficiary.category || 'BPL',
        assignedShopId: beneficiary.assignedShopId || '',
        monthlyQuota: beneficiary.monthlyQuota || { rice: 0, wheat: 0, sugar: 0, kerosene: 0 },
        isActive: beneficiary.isActive !== undefined ? beneficiary.isActive : true
      });
    }
  }, [beneficiary]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('quota_')) {
      const item = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        monthlyQuota: { ...prev.monthlyQuota, [item]: parseFloat(value) || 0 }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">{beneficiary ? 'Edit' : 'Add'} Beneficiary</h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Card ID *</label>
              <input
                type="text"
                name="cardId"
                value={formData.cardId}
                onChange={handleChange}
                disabled={!!beneficiary}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input">
                <option value="APL">APL</option>
                <option value="BPL">BPL</option>
                <option value="AAY">AAY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Assigned Shop</label>
              <select name="assignedShopId" value={formData.assignedShopId} onChange={handleChange} className="input">
                <option value="">Select Shop</option>
                {shops.map(shop => (
                  <option key={shop.shopId} value={shop.shopId}>{shop.name} ({shop.shopId})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-900 mb-3">Monthly Quota</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rice (kg)</label>
                <input
                  type="number"
                  name="quota_rice"
                  value={formData.monthlyQuota.rice}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Wheat (kg)</label>
                <input
                  type="number"
                  name="quota_wheat"
                  value={formData.monthlyQuota.wheat}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sugar (kg)</label>
                <input
                  type="number"
                  name="quota_sugar"
                  value={formData.monthlyQuota.sugar}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kerosene (L)</label>
                <input
                  type="number"
                  name="quota_kerosene"
                  value={formData.monthlyQuota.kerosene}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-semibold text-gray-700">Active</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary py-3"
            >
              {isSubmitting ? 'Saving...' : beneficiary ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-bold border-2 border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeneficiaryFormModal;
