const { PublicHealthAlert } = require("../models");

// Create alert
exports.createAlert = async (req, res) => {
  try {
    const alert = await PublicHealthAlert.create(req.body);
    res.status(201).json({ message: "Alert created", alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await PublicHealthAlert.findAll();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getAlertById = async (req, res) => {
  try {
    const alert = await PublicHealthAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });

    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update alert
exports.updateAlert = async (req, res) => {
  try {
    const alert = await PublicHealthAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });

    await alert.update(req.body);
    res.json({ message: "Alert updated", alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete alert
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await PublicHealthAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });

    await alert.destroy();
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
