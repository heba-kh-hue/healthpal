// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    // --- Existing Fields (with password renamed) ---
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    // Renamed to match schema 'password_hash' -> 'password' in model for consistency
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash' // This maps the 'password' field to the 'password_hash' column in the DB
    },
    role: {
        type: DataTypes.ENUM('patient', 'doctor', 'donor', 'ngo', 'admin', 'hospital'),
        allowNull: false
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // --- New Fields ---
    contact_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    language_pref: {
        type: DataTypes.STRING,
        defaultValue: 'ar',
        allowNull: true
    },
    official_document_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    registration_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    website_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verification_status: {
        type: DataTypes.ENUM('none', 'requested', 'verified', 'rejected'),
        defaultValue: 'none'
    },
    verification_requested_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // --- Hooks (No change here) ---
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // It's also good practice to hash the password on update
        beforeUpdate: async(user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    },
    // --- Timestamps (Sequelize handles these automatically) ---
    // createdAt: 'created_at',
    // updatedAt: 'updated_at'
});

module.exports = User;