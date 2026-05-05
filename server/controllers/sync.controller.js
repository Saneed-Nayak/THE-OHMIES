const { processTransaction } = require('../services/syncProcessor');
const Beneficiary = require('../models/Beneficiary');
const Conflict = require('../models/Conflict');

const pushSync = async (req, res, next) => {
  try {
    const { shopId, transactions } = req.body;
    
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ success: false, error: 'Invalid transactions payload' });
    }

    const results = [];
    const summary = { success: 0, duplicate: 0, conflict: 0, error: 0 };

    for (const txn of transactions) {
      const result = await processTransaction({ ...txn, shopId });
      results.push({ txnId: txn.txnId, ...result });

      if (result.result === 'success') summary.success++;
      else if (result.result === 'duplicate') summary.duplicate++;
      else if (result.result === 'conflict') summary.conflict++;
      else summary.error++;
    }

    res.json({ success: true, results, summary });
  } catch (error) {
    next(error);
  }
};

const pullSync = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    
    // Simplistic pull: get active beneficiaries for the shop.
    // Real implementation would use lastSyncAt to filter updates.
    const beneficiaries = await Beneficiary.find({ assignedShopId: shopId, isActive: true });
    
    // Get resolved conflicts applicable to this shop and cardIds.
    // For simplicity, just pulling open conflicts to notify the local client
    const openConflicts = await Conflict.find({ shops: shopId, status: 'pending' });

    res.json({
      success: true,
      data: {
        beneficiaries,
        resolvedConflicts: [],
        openConflicts,
        config: { currentMonth: new Date().toISOString().slice(0, 7) }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getSyncStatus = async (req, res, next) => {
  try {
    res.json({ success: true, data: { status: 'healthy', timestamp: new Date() } });
  } catch (error) {
    next(error);
  }
};

module.exports = { pushSync, pullSync, getSyncStatus };