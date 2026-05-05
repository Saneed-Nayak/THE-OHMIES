const express = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const router = express.Router();

router.use(protect);
router.use(roleCheck('admin'));

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
