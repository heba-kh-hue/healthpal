// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
    message_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
        // You can add validation later, e.g., isIn: [['ar', 'en']]
    },
    translated_text: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // sender_id, receiver_id, and consultation_id will be added via associations.
}, {
    // createdAt and updatedAt are handled automatically by Sequelize
});

module.exports = Message;

// // models/Message.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Message = sequelize.define('Message', {
//     message_text: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     language: {
//         type: DataTypes.STRING,
//         allowNull: true // e.g., 'ar', 'en'
//     },
//     translated_text: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     }
//     // sender_id, receiver_id, and consultation_id will be handled by associations
// });

// module.exports = Message;