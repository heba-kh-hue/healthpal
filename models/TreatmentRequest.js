const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TreatmentRequest = sequelize.define('TreatmentRequest', {
    treatment_type: {
        type: DataTypes.ENUM('surgery', 'cancer_treatment', 'dialysis', 'rehabilitation', 'medication'),
        allowNull: false
    },
    content: {
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
    // patient_id and doctor_id will be added via associations
});

module.exports = TreatmentRequest;