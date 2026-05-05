const Transaction = require('../models/Transaction');
const Conflict = require('../models/Conflict');
const Beneficiary = require('../models/Beneficiary');

const processTransaction = async (txnData) => {
  try {
    // CHECK 1 — DUPLICATE TXNID
    const existingTxn = await Transaction.findOne({ txnId: txnData.txnId });
    if (existingTxn) {
      return { result: 'duplicate' };
    }

    // CHECK 2 — SAME FAMILY DIFFERENT SHOP (Conflict)
    const existingFamilyTxns = await Transaction.find({
      cardId: txnData.cardId,
      month: txnData.month,
      status: { $ne: 'rejected' }
    });

    const isConflict = existingFamilyTxns.some(t => t.shopId !== txnData.shopId);

    if (isConflict) {
      // Save this incoming transaction as conflict
      const newTxn = await Transaction.create({
        ...txnData,
        status: 'conflict',
        syncedAt: new Date()
      });

      // Update existing family txns to conflict
      await Transaction.updateMany(
        { _id: { $in: existingFamilyTxns.map(t => t._id) } },
        { status: 'conflict' }
      );

      const allTxnIds = [...existingFamilyTxns.map(t => t._id), newTxn._id];
      const shopIds = [...new Set([...existingFamilyTxns.map(t => t.shopId), txnData.shopId])];

      // Create conflict record
      const conflict = await Conflict.create({
        conflictId: `CON-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cardId: txnData.cardId,
        beneficiaryName: txnData.beneficiaryName,
        month: txnData.month,
        transactions: allTxnIds,
        shops: shopIds,
        status: 'pending'
      });

      // Link conflict to transactions
      await Transaction.updateMany(
        { _id: { $in: allTxnIds } },
        { conflictId: conflict._id }
      );

      return { result: 'conflict', conflictId: conflict.conflictId };
    }

    // CHECK 3 — QUOTA VALIDATION
    const beneficiary = await Beneficiary.findOne({ cardId: txnData.cardId });
    // Assuming simple validation: just need beneficiary to exist for now
    if (!beneficiary) {
      return { result: 'invalid' };
    }

    // IF ALL CHECKS PASS
    await Transaction.create({
      ...txnData,
      status: 'synced',
      syncedAt: new Date()
    });

    return { result: 'success' };
  } catch (error) {
    console.error('Sync process error:', error);
    return { result: 'error' };
  }
};

module.exports = { processTransaction };