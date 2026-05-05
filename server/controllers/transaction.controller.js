const Transaction = require('../models/Transaction');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, shopId, status, month, search } = req.query;
    const query = {};
    if (shopId) query.shopId = shopId;
    if (status) query.status = status;
    if (month) query.month = month;
    if (search) {
      query.$or = [
        { cardId: { $regex: search, $options: 'i' } },
        { beneficiaryName: { $regex: search, $options: 'i' } }
      ];
    }

    const options = { page: parseInt(page), limit: parseInt(limit), sort: { createdAt: -1 }, populate: 'officerId' };
    const transactions = await Transaction.paginate(query, options);

    res.json({
      success: true,
      data: transactions.docs,
      pagination: {
        total: transactions.totalDocs,
        page: transactions.page,
        pages: transactions.totalPages,
        limit: transactions.limit
      }
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ txnId: req.params.txnId }).populate('officerId');
    if (!transaction) return res.status(404).json({ success: false, error: 'Transaction not found' });
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

const getByShop = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ shopId: req.params.shopId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

const createSingle = async (req, res, next) => {
  try {
    const existingTxn = await Transaction.findOne({ txnId: req.body.txnId });
    if (existingTxn) return res.status(400).json({ success: false, error: 'Duplicate transaction ID' });

    const transaction = await Transaction.create({ ...req.body, status: 'synced', syncedAt: new Date() });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const total = await Transaction.countDocuments();
    const synced = await Transaction.countDocuments({ status: 'synced' });
    const conflicts = await Transaction.countDocuments({ status: 'conflict' });
    
    // Aggregation for distributions by item
    const items = await Transaction.aggregate([
      { $match: { status: { $in: ['synced', 'pending_sync'] } } },
      { $group: {
          _id: null,
          totalRice: { $sum: '$itemsDistributed.rice' },
          totalWheat: { $sum: '$itemsDistributed.wheat' },
          totalSugar: { $sum: '$itemsDistributed.sugar' },
          totalOil: { $sum: '$itemsDistributed.oil' }
        }
      }
    ]);

    res.json({ success: true, data: { total, synced, conflicts, itemStats: items[0] || {} } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, getByShop, createSingle, getStats };