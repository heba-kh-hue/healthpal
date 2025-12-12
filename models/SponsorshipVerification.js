// models/SponsorshipVerification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SponsorshipVerification = sequelize.define('SponsorshipVerification', {
    receipt_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patient_feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    approved_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
    // treatment_request_id and approved_by (user_id) handled by associations
}, {
    // Timestamps are handled automatically
});

module.exports = SponsorshipVerification;