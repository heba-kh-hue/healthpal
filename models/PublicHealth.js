const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    severity: DataTypes.ENUM('low', 'moderate', 'high', 'critical'),
    published_by: DataTypes.INTEGER
}, { tableName: 'public_health_alerts', timestamps: true, createdAt: 'created_at', updatedAt: false });

const HealthGuide = sequelize.define('HealthGuide', {
    title: DataTypes.STRING,
    language: { type: DataTypes.STRING, defaultValue: 'ar' },
    content: DataTypes.TEXT,
    approved: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'health_guides', timestamps: false });

module.exports = { Alert, HealthGuide };