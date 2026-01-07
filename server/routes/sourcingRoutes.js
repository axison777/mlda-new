const express = require('express');
const router = express.Router();
const {
    createSourcingRequest,
    getSourcingRequests,
    addOffer
} = require('../controllers/sourcingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSourcingRequest).get(protect, getSourcingRequests);
router.route('/:id/offer').post(protect, addOffer);

module.exports = router;
