const Transaction = require('../models/Transaction');
const Conflict = require('../models/Conflict');

const detectConflicts = async (cardId, month) => {
  const transactions = await Transaction.find({ cardId, month, status: { $ne: 'rejected' } });
  
  if (transactions.length <= 1) {
    return null;
  }

  const shopIds = [...new Set(transactions.map(t => t.shopId))];
  
  if (shopIds.length > 1) {
    // Conflict exists
    return {
      transactions: transactions.map(t => t._id),
      shops: shopIds,
      beneficiaryName: transactions[0].beneficiaryName
    };
  }
  
  return null;
};

module.exports = { detectConflicts };