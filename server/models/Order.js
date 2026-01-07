const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('vehicle', 'product', 'course'),
        defaultValue: 'product'
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'in_transit', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('paid', 'unpaid', 'failed'),
        defaultValue: 'unpaid'
    },
    paymentMethod: {
        type: DataTypes.ENUM('orange_money', 'visa', 'paypal', 'bank_transfer'),
        allowNull: true
    },
    shippingDetails: {
        type: DataTypes.JSON,
        allowNull: true
    },
    estimatedDelivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    currentStep: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    timeline: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = Order;
