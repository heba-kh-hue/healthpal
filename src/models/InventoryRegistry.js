const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Inventory = sequelize.define("inventory_registry", {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM("medicine", "equipment") },
    quantity_available: { type: DataTypes.INTEGER },
    total_quantity: { type: DataTypes.INTEGER },
    storage_location: { type: DataTypes.STRING },
    condition: { type: DataTypes.ENUM("good","needs_repair","out_of_service","expired","damaged") },
    expiry_date: { type: DataTypes.DATE },
    source_id: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE }
}, {
    timestamps: false
});

module.exports = Inventory;
