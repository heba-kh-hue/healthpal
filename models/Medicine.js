const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicineRequest = sequelize.define('MedicineRequest', {
    request_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patient_id: DataTypes.INTEGER,
    item_name_requested: DataTypes.STRING,
    quantity_needed: DataTypes.INTEGER,
    delivery_location: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('pending', 'fulfilled'),
        defaultValue: 'pending'
    },
    fulfilled_by: DataTypes.INTEGER,
    fulfilled_date: DataTypes.DATE
}, {
    tableName: 'medicine_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = MedicineRequest;