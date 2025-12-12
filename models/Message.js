// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
    message_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    language: { // e.g., 'en', 'ar'
        type: DataTypes.STRING,
        allowNull: true
    },
    translated_text: { // Will be used later for translation feature
        type: DataTypes.TEXT,
        allowNull: true
    }
    // sender_id, receiver_id, and consultation_id are handled by associations
}, {
    // createdAt: 'created_at',
    // updatedAt: 'updated_at'
});

module.exports = Message;