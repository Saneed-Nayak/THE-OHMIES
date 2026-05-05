import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ShopFormModal = ({ shop, users, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    shopId: '',
    name: '',
    location: {
      address: '',
      district: '',
      state: '',
      pincode: ''
    },
    assignedOfficer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shop) {
      setFormData({
        shopId: shop.shopId || '',
        name: shop.name || '',
        location: shop.location || { address: '', district: '', state: '', pincode: '' },
        assignedOfficer: shop.assignedOfficer?._id || ''
      });
    }
  }, [shop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location_')) {
      const field = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  const officers = users.filter(u => u.role === 'officer');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-green-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">{shop ? 'Edit' : 'Add'} Shop</h2>
          <button onClick={onClose} className="hover:bg-green-700 p-2 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Shop ID *</label>
              <input
                type="text"
                name="shopId"
                value={formData.shopId}
                onChange={handleChange}
                disabled={!!shop}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Shop Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-900 mb-3">Location</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="location_address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                  <input
                    type="text"
                    name="location_district"
                    value={formData.location.district}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="location_state"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="location_pincode"
                    value={formData.location.pincode}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Assigned Officer</label>
            <select name="assignedOfficer" value={formData.assignedOfficer} onChange={handleChange} className="input">
              <option value="">Select Officer</option>
              {officers.map(officer => (
                <option key={officer._id} value={officer._id}>{officer.name} ({officer.email})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary py-3"
            >
              {isSubmitting ? 'Saving...' : shop ? 'Update' : 'Create'}
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

export default ShopFormModal;
