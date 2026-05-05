const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const conflictSchema = new mongoose.Schema({
  conflictId: { type: String, unique: true, required: true },
  cardId: { type: String, required: true },
  beneficiaryName: { type: String },
  month: { type: String, required: true }, // Format: YYYY-MM
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  shops: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'flagged'], 
    default: 'pending' 
  },
  detectedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  validTransactionId: { type: String },
  fraudTransactionId: { type: String },
  resolutionNote: { type: String }
}, { timestamps: true });

conflictSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Conflict', conflictSchema);