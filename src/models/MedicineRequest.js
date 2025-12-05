const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MedicineRequest = sequelize.define("medicine_requests", {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: DataTypes.INTEGER,
  item_name_requested: DataTypes.STRING,
  quantity_needed: DataTypes.INTEGER,
  delivery_location: DataTypes.STRING,
  assigned_source_id: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM(
      "pending",
      "available",
      "in_progress",
      "fulfilled",
      "rejected",
      "cancelled"
    ),
    defaultValue: "pending"
  },
  requested_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fulfilled_by: DataTypes.INTEGER,
  fulfilled_date: DataTypes.DATE,
  notes: DataTypes.TEXT
}, {
  timestamps: false
});

module.exports = MedicineRequest;
