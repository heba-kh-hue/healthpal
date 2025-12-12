const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthGuide = sequelize.define("health_guides", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    category: { 
        type: DataTypes.ENUM("first_aid","chronic_illness","nutrition","maternal_care","mental_health","other")
    },
    description: { type: DataTypes.TEXT },
    media_url: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    created_by: { type: DataTypes.INTEGER },
    approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    approved_by: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE }
}, {
    timestamps: false
});

module.exports = HealthGuide;
