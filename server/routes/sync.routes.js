const express = require('express');
const { pushSync, pullSync, getSyncStatus } = require('../controllers/sync.controller');
const router = express.Router();

// Not enforcing strict protect for sync paths directly on all, 
// but in a real-world scenario, could protect with shop/device tokens.
// For this architecture following guidelines:
router.post('/push', pushSync);
router.get('/pull/:shopId', pullSync);
router.get('/status/:shopId', getSyncStatus);

module.exports = router;