const express = require('express');
const { getAll, getOne, resolve, flag, getStats } = require('../controllers/conflict.controller');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const router = express.Router();

router.use(protect);
router.use(roleCheck('supervisor', 'admin'));

router.get('/', getAll);
router.get('/stats', getStats);
router.get('/:conflictId', getOne);
router.put('/:conflictId/resolve', resolve);
router.put('/:conflictId/flag', flag);

module.exports = router;