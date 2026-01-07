const express = require('express');
const router = express.Router();
const {
    processPayment,
    getTransactions,
    getAllTransactions,
    calculateFees
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/process', protect, processPayment);
router.get('/transactions', protect, getTransactions);
router.get('/all', protect, admin, getAllTransactions);
router.post('/calculate-fees', calculateFees);

module.exports = router;
