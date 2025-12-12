// models/Donation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('Donation', {
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // We can add a 'payment_status' or 'transaction_id' field here in a real app
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    // treatment_request_id and donor_id are handled by associations
}, {
    // Use 'donated_at' instead of 'createdAt' to match schema
    createdAt: 'donated_at',
    updatedAt: false // We don't need an 'updatedAt' for donations
});

module.exports = Donation;