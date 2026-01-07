const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            type,
            shippingDetails,
            paymentMethod
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Aucun article dans la commande' });
        }

        // Generate tracking number
        const trackingNumber = `MDL-${Math.floor(1000 + Math.random() * 9000)}`;

        // Create timeline based on order type
        let timeline = [];
        if (type === 'vehicle') {
            timeline = [
                { step: 1, title: 'Commande Validée', status: 'current', description: 'Acompte reçu. Dossier ouvert.' },
                { step: 2, title: 'Achat & Enlèvement', status: 'pending', description: 'Récupération du véhicule.' },
                { step: 3, title: 'Transit vers le Port', status: 'pending', description: 'Acheminement vers le port.' },
                { step: 4, title: 'Expédition Maritime', status: 'pending', description: 'Transport maritime.' },
                { step: 5, title: 'Dédouanement', status: 'pending', description: 'Formalités douanières.' },
                { step: 6, title: 'Livraison Finale', status: 'pending', description: 'Mise à disposition client.' }
            ];
        } else {
            timeline = [
                { step: 1, title: 'Commande Validée', status: 'current', description: 'Paiement reçu.' },
                { step: 2, title: 'Préparation', status: 'pending', description: 'Préparation de la commande.' },
                { step: 3, title: 'Expédition', status: 'pending', description: 'Envoi en cours.' },
                { step: 4, title: 'Livraison', status: 'pending', description: 'Livraison finale.' }
            ];
        }

        const order = await Order.create({
            userId: req.user.id,
            items,
            totalAmount,
            trackingNumber,
            type: type || 'product',
            paymentMethod,
            shippingDetails,
            timeline,
            currentStep: 1,
            status: 'processing',
            paymentStatus: 'paid'
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by tracking number
// @route   GET /api/orders/track/:trackingNumber
// @access  Public
const getOrderByTracking = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { trackingNumber: req.params.trackingNumber },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email', 'phone']
            }]
        });

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Commande non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Transit
const updateOrderStatus = async (req, res) => {
    try {
        const { status, currentStep, timeline } = req.body;

        const order = await Order.findByPk(req.params.id);

        if (order) {
            if (status) order.status = status;
            if (currentStep) order.currentStep = currentStep;
            if (timeline) order.timeline = timeline;

            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Commande non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin/Transit)
// @route   GET /api/orders/all
// @access  Private/Admin/Transit
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email', 'phone']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderByTracking,
    updateOrderStatus,
    getAllOrders
};
