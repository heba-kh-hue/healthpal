const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InventoryRegistry = sequelize.define(
  "inventory_registry",   
  {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    type: DataTypes.ENUM("medicine", "equipment"),
    quantity_available: DataTypes.INTEGER,
    total_quantity: DataTypes.INTEGER,
    storage_location: DataTypes.STRING,
    condition: DataTypes.ENUM(
      "good",
      "needs_repair",
      "out_of_service",
      "expired",
      "damaged"
    ),
    expiry_date: DataTypes.DATE,
    source_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  },
  {
    tableName: "inventory_registry", 
    freezeTableName: true,           
    timestamps: false
  }
);

module.exports = InventoryRegistry;
