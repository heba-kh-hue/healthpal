const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MedicineRequest = sequelize.define("medicine_requests", {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  item_name_requested: {
    type: DataTypes.STRING
  },
  quantity_needsys_configed: {
  type: DataTypes.INTEGER
 , field: "quantity_needsys_configed"
},

  delivery_location: {
    type: DataTypes.STRING
  },
  assigned_source_id: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  },
  requested_date: {
    type: DataTypes.DATE
  },
  fulfilled_by: {
    type: DataTypes.INTEGER
  },
  fulfilled_date: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false
  ,freezeTableName: true  
});

module.exports = MedicineRequest;
