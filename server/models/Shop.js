const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  village: { type: String, required: true },
  taluka: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBeneficiaries: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);