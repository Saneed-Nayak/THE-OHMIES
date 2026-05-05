const Conflict = require('../models/Conflict');
const Transaction = require('../models/Transaction');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const options = { 
      page: parseInt(page), 
      limit: parseInt(limit), 
      sort: { detectedAt: -1 },
      populate: ['transactions', 'resolvedBy'] 
    };
    const conflicts = await Conflict.paginate(query, options);

    res.json({
      success: true,
      data: conflicts.docs,
      pagination: {
        total: conflicts.totalDocs,
        page: conflicts.page,
        pages: conflicts.totalPages,
        limit: conflicts.limit
      }
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const conflict = await Conflict.findOne({ conflictId: req.params.conflictId })
      .populate('transactions')
      .populate('resolvedBy');
    if (!conflict) return res.status(404).json({ success: false, error: 'Conflict not found' });
    res.json({ success: true, data: conflict });
  } catch (error) {
    next(error);
  }
};

const resolve = async (req, res, next) => {
  try {
    const { validTransactionId, fraudTransactionId, resolutionNote } = req.body;
    const conflict = await Conflict.findOne({ conflictId: req.params.conflictId });
    
    if (!conflict) return res.status(404).json({ success: false, error: 'Conflict not found' });

    conflict.status = 'resolved';
    conflict.resolvedAt = new Date();
    conflict.resolvedBy = req.user._id;
    conflict.validTransactionId = validTransactionId;
    conflict.fraudTransactionId = fraudTransactionId;
    conflict.resolutionNote = resolutionNote;
    await conflict.save();

    // Update transactions based on resolution
    if (validTransactionId) await Transaction.findByIdAndUpdate(validTransactionId, { status: 'synced' });
    if (fraudTransactionId) await Transaction.findByIdAndUpdate(fraudTransactionId, { status: 'rejected' });

    res.json({ success: true, data: conflict });
  } catch (error) {
    next(error);
  }
};

const flag = async (req, res, next) => {
  try {
    const conflict = await Conflict.findOneAndUpdate(
      { conflictId: req.params.conflictId },
      { status: 'flagged' },
      { new: true }
    );
    if (!conflict) return res.status(404).json({ success: false, error: 'Conflict not found' });
    res.json({ success: true, data: conflict });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const total = await Conflict.countDocuments();
    const pending = await Conflict.countDocuments({ status: 'pending' });
    const resolved = await Conflict.countDocuments({ status: 'resolved' });
    const flagged = await Conflict.countDocuments({ status: 'flagged' });
    const unresolvedCount = pending + flagged; // Unresolved = pending + flagged
    
    res.json({ 
      success: true, 
      data: { 
        total, 
        pending, 
        resolved, 
        flagged,
        unresolvedCount 
      } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, resolve, flag, getStats };