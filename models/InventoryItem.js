const { DataTypes } = require('sequelize');
// Assuming your partner exports the sequelize instance from here
const sequelize = require('../config/database');

const InventoryItem = sequelize.define('InventoryItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('medicine', 'equipment'),
        allowNull: false
    },
    quantity_available: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    storage_location: DataTypes.STRING,
    source_id: DataTypes.INTEGER, // References User ID
    image_url: DataTypes.STRING
}, {
    tableName: 'inventory_registry',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = InventoryItem;