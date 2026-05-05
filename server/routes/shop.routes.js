const express = require('express');
const { getAll, getOne, create, update, assignOfficer, getStats } = require('../controllers/shop.controller');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const router = express.Router();

router.use(protect);

router.get('/', getAll);
router.get('/:shopId', getOne);
router.get('/:shopId/stats', getStats);

// Admin only
router.post('/', roleCheck('admin'), create);
router.put('/:shopId', roleCheck('admin'), update);
router.put('/:shopId/officer', roleCheck('admin'), assignOfficer);

module.exports = router;