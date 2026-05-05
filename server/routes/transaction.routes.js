const express = require('express');
const { getAll, getOne, getByShop, createSingle, getStats } = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/', getAll);
router.get('/stats', getStats);
router.get('/:txnId', getOne);
router.get('/shop/:shopId', getByShop);
router.post('/', createSingle);

module.exports = router;