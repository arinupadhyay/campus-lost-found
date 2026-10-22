const express = require('express');
const router = express.Router();
const { createClaim, getMyClaims, updateClaimStatus } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createClaim);
router.get('/myclaims', protect, getMyClaims);
router.put('/:id/status', protect, updateClaimStatus);

module.exports = router;