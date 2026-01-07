const SourcingRequest = require('../models/SourcingRequest');
const User = require('../models/User');

// @desc    Create sourcing request
// @route   POST /api/sourcing
// @access  Private
const createSourcingRequest = async (req, res) => {
    try {
        const { clientName, itemRequested, budget, details } = req.body;

        const request = await SourcingRequest.create({
            clientId: req.user.id,
            clientName: clientName || req.user.name,
            itemRequested,
            budget,
            details
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all sourcing requests
// @route   GET /api/sourcing
// @access  Private/Transit/Admin
const getSourcingRequests = async (req, res) => {
    try {
        const requests = await SourcingRequest.findAll({
            include: [{
                model: User,
                as: 'client',
                attributes: ['name', 'email', 'phone']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add offer to sourcing request
// @route   POST /api/sourcing/:id/offer
// @access  Private/Transit
const addOffer = async (req, res) => {
    try {
        const { price, estimatedTime, notes } = req.body;

        const request = await SourcingRequest.findByPk(req.params.id);

        if (request) {
            const offers = request.offers || [];

            const offer = {
                transitId: req.user.id,
                price,
                estimatedTime,
                notes,
                createdAt: new Date()
            };

            offers.push(offer);
            request.offers = offers;
            request.status = 'offer_sent';

            await request.save();
            res.json(request);
        } else {
            res.status(404).json({ message: 'Demande non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSourcingRequest,
    getSourcingRequests,
    addOffer
};
