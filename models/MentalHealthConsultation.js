// models/MentalHealthConsultation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MentalHealthConsultation = sequelize.define('MentalHealthConsultation', {
    trauma_type: {
        type: DataTypes.ENUM('war_trauma', 'loss', 'childhood', 'stress', 'other'),
        allowNull: true
    },
    severity_level: {
        type: DataTypes.ENUM('mild', 'moderate', 'severe', 'critical'),
        allowNull: true
    },
    anonymity: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    age_group: {
        type: DataTypes.ENUM('child', 'teen', 'adult', 'senior'),
        allowNull: true
    },
    session_focus: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    follow_up_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    follow_up_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // consultation_id is handled by associations
}, {
    // createdAt: 'created_at',
    // updatedAt: 'updated_at'
});

module.exports = MentalHealthConsultation;