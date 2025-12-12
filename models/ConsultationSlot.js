// models/ConsultationSlot.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConsultationSlot = sequelize.define('ConsultationSlot', {
    start_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_booked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    // doctor_id will be added via associations
    // consultation_id will be added via associations
});

module.exports = ConsultationSlot;
