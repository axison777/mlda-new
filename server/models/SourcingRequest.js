const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SourcingRequest = sequelize.define('SourcingRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemRequested: {
        type: DataTypes.STRING,
        allowNull: false
    },
    budget: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'offer_sent', 'accepted', 'rejected', 'completed'),
        defaultValue: 'pending'
    },
    offers: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = SourcingRequest;
