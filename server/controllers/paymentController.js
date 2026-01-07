const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Mock payment processing (replace with real gateway integration)
const processPaymentGateway = async (method, amount, metadata) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (success) {
        return {
            success: true,
            transactionId: `${method.toUpperCase()}-${Date.now()}`,
            reference: `REF-${Math.floor(Math.random() * 1000000)}`,
            message: 'Paiement réussi'
        };
    } else {
        return {
            success: false,
            error: 'Transaction échouée',
            message: 'Échec du paiement'
        };
    }
};

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
const processPayment = async (req, res) => {
    try {
        const { orderId, amount, method, metadata } = req.body;

        // Validate order if provided
        let order = null;
        if (orderId) {
            order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Commande non trouvée' });
            }
        }

        // Create pending payment record
        const payment = await Payment.create({
            userId: req.user.id,
            orderId: orderId || null,
            amount,
            method,
            status: 'pending',
            metadata
        });

        // Process payment with gateway
        const result = await processPaymentGateway(method, amount, metadata);

        if (result.success) {
            // Update payment record
            payment.status = 'completed';
            payment.transactionId = result.transactionId;
            payment.reference = result.reference;
            await payment.save();

            // Update order payment status if applicable
            if (order) {
                order.paymentStatus = 'paid';
                await order.save();
            }

            res.json({
                success: true,
                payment,
                message: result.message
            });
        } else {
            // Update payment as failed
            payment.status = 'failed';
            payment.errorMessage = result.error;
            await payment.save();

            res.status(400).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user transactions
// @route   GET /api/payments/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const transactions = await Payment.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Order,
                as: 'order',
                attributes: ['trackingNumber', 'totalAmount']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/payments/all
// @access  Private/Admin
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Payment.findAll({
            include: [
                {
                    model: Order,
                    as: 'order',
                    attributes: ['trackingNumber', 'totalAmount']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Calculate payment fees
// @route   POST /api/payments/calculate-fees
// @access  Public
const calculateFees = async (req, res) => {
    try {
        const { amount, method } = req.body;

        const feeRates = {
            orange_money: 0.015, // 1.5%
            visa: 0.025, // 2.5%
            paypal: 0.029, // 2.9%
            bank_transfer: 0.01 // 1%
        };

        const fee = amount * (feeRates[method] || 0);

        res.json({
            subtotal: parseFloat(amount),
            fees: Math.round(fee),
            total: parseFloat(amount) + Math.round(fee)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    processPayment,
    getTransactions,
    getAllTransactions,
    calculateFees
};
