const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new mongoose.Schema({
  txnId: { type: String, unique: true, required: true },
  cardId: { type: String, required: true },
  beneficiaryName: { type: String },
  shopId: { type: String, required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  month: { type: String, required: true }, // Format: YYYY-MM
  itemsDistributed: {
    rice: { type: Number, default: 0 },
    wheat: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    oil: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['pending_sync', 'synced', 'conflict', 'rejected'], 
    default: 'synced' 
  },
  recordedAt: { type: Date },
  syncedAt: { type: Date },
  deviceId: { type: String },
  isOfflineRecord: { type: Boolean, default: false },
  conflictId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conflict' },
  notes: { type: String }
}, { timestamps: true });

transactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Transaction', transactionSchema);