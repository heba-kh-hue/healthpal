const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PublicHealthAlert = sequelize.define("public_health_alerts", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
    alert_type: { 
        type: DataTypes.ENUM("disease_outbreak","air_quality","urgent_need","general")
    },
    severity: { type: DataTypes.ENUM("low","moderate","high","critical") },
    country: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    published_by: { type: DataTypes.INTEGER },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE },
    expires_at: { type: DataTypes.DATE }
}, {
    timestamps: false
});

module.exports = PublicHealthAlert;
