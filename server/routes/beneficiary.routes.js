const express = require('express');
const { getAll, getOne, getByShop, create, update, deactivate, bulkImport } = require('../controllers/beneficiary.controller');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const router = express.Router();

router.use(protect);

router.get('/', getAll);
router.get('/:cardId', getOne);
router.get('/shop/:shopId', getByShop);

// Admin only routes
router.post('/', roleCheck('admin'), create);
router.post('/bulk', roleCheck('admin'), bulkImport);
router.put('/:cardId', roleCheck('admin'), update);
router.delete('/:cardId', roleCheck('admin'), deactivate);

module.exports = router;