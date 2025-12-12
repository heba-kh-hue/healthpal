// models/RecoveryUpdate.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecoveryUpdate = sequelize.define('RecoveryUpdate', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    file_url: { // Optional link to a photo or document
        type: DataTypes.STRING,
        allowNull: true
    },
    status: { // Optional status update
        type: DataTypes.ENUM('improving', 'stable', 'critical', 'recovered'),
        allowNull: true
    }
    // patient_id and treatment_request_id will be added via associations
}, {
    // Timestamps are handled automatically
});

module.exports = RecoveryUpdate;