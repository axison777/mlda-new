const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderByTracking,
    updateOrderStatus,
    getAllOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, getMyOrders);
router.route('/all').get(protect, getAllOrders);
router.route('/track/:trackingNumber').get(getOrderByTracking);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;
