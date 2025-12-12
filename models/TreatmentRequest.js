// models/TreatmentRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TreatmentRequest = sequelize.define('TreatmentRequest', {
    treatment_type: {
        type: DataTypes.ENUM('surgery', 'cancer_treatment', 'dialysis', 'rehabilitation', 'prescription', 'other'),
        allowNull: false
    },
    content: { // Medical notes or description of the treatment
        type: DataTypes.TEXT,
        allowNull: false
    },
    goal_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    raised_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('open', 'funded', 'closed', 'cancelled'),
        defaultValue: 'open'
    }
    // doctor_id, patient_id, and consultation_id are handled by associations
}, {
    // Timestamps are handled automatically
});

module.exports = TreatmentRequest;