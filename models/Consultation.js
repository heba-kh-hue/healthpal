// models/Consultation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consultation = sequelize.define('Consultation', {
    specialty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'confirmed' // Keep this default for direct bookings
    },
    mode: {
        type: DataTypes.ENUM('video', 'audio', 'chat'),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // patient_id, doctor_id, and slot_id are handled by associations
}, {
    // createdAt: 'created_at',
    // updatedAt: 'updated_at'
});

module.exports = Consultation;