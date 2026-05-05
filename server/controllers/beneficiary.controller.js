const Beneficiary = require('../models/Beneficiary');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, shopId } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cardId: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (shopId) query.assignedShopId = shopId;

    const options = { page: parseInt(page), limit: parseInt(limit), sort: { createdAt: -1 } };
    const beneficiaries = await Beneficiary.paginate(query, options);

    res.json({
      success: true,
      data: beneficiaries.docs,
      pagination: {
        total: beneficiaries.totalDocs,
        page: beneficiaries.page,
        pages: beneficiaries.totalPages,
        limit: beneficiaries.limit
      }
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.findOne({ cardId: req.params.cardId });
    if (!beneficiary) return res.status(404).json({ success: false, error: 'Beneficiary not found' });
    res.json({ success: true, data: beneficiary });
  } catch (error) {
    next(error);
  }
};

const getByShop = async (req, res, next) => {
  try {
    const beneficiaries = await Beneficiary.find({ assignedShopId: req.params.shopId, isActive: true });
    res.json({ success: true, data: beneficiaries });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.create(req.body);
    res.status(201).json({ success: true, data: beneficiary });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.findOneAndUpdate(
      { cardId: req.params.cardId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!beneficiary) return res.status(404).json({ success: false, error: 'Beneficiary not found' });
    res.json({ success: true, data: beneficiary });
  } catch (error) {
    next(error);
  }
};

const deactivate = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.findOneAndUpdate(
      { cardId: req.params.cardId },
      { isActive: false },
      { new: true }
    );
    if (!beneficiary) return res.status(404).json({ success: false, error: 'Beneficiary not found' });
    res.json({ success: true, data: beneficiary });
  } catch (error) {
    next(error);
  }
};

const bulkImport = async (req, res, next) => {
  try {
    const beneficiaries = req.body;
    if (!Array.isArray(beneficiaries)) {
      return res.status(400).json({ success: false, error: 'Expected an array of beneficiaries' });
    }
    const result = await Beneficiary.insertMany(beneficiaries, { ordered: false });
    res.status(201).json({ success: true, data: { count: result.length }, message: 'Import successful' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Duplicate card IDs found during import' });
    }
    next(error);
  }
};

module.exports = { getAll, getOne, getByShop, create, update, deactivate, bulkImport };