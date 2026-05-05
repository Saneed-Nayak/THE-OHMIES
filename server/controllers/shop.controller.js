const Shop = require('../models/Shop');
const User = require('../models/User');
const Beneficiary = require('../models/Beneficiary');

const getAll = async (req, res, next) => {
  try {
    const shops = await Shop.find().populate('assignedOfficer', 'name email');
    res.json({ success: true, data: shops });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ shopId: req.params.shopId }).populate('assignedOfficer', 'name email');
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });
    res.json({ success: true, data: shop });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json({ success: true, data: shop });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { shopId: req.params.shopId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });
    res.json({ success: true, data: shop });
  } catch (error) {
    next(error);
  }
};

const assignOfficer = async (req, res, next) => {
  try {
    const { officerId } = req.body; // user Object ID
    const shop = await Shop.findOneAndUpdate(
      { shopId: req.params.shopId },
      { assignedOfficer: officerId },
      { new: true }
    );
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    await User.findByIdAndUpdate(officerId, { shopId: shop._id });
    
    res.json({ success: true, data: shop });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ shopId: req.params.shopId });
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    const totalBeneficiaries = await Beneficiary.countDocuments({ assignedShopId: req.params.shopId, isActive: true });
    
    res.json({
      success: true,
      data: {
        totalBeneficiaries,
        shopInfo: shop
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, update, assignOfficer, getStats };