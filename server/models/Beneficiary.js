const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const beneficiarySchema = new mongoose.Schema({
  cardId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  fatherName: { type: String },
  gender: { type: String, enum: ['M', 'F', 'Other'] },
  age: { type: Number },
  village: { type: String, required: true },
  taluka: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String },
  category: { type: String, enum: ['APL', 'BPL', 'AAY'], required: true },
  familyMembers: { type: Number, default: 1 },
  monthlyQuota: {
    rice: { type: Number, default: 0 },
    wheat: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    oil: { type: Number, default: 0 }
  },
  assignedShopId: { type: String, ref: 'Shop' }, // Using String matching Shop.shopId per instructions
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

beneficiarySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Beneficiary', beneficiarySchema);