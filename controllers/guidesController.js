const HealthGuide = require("../models/HealthGuide");

// ================================
// Create a new guide
// ================================
exports.createGuide = async (req, res) => {
  try {
    const guide = await HealthGuide.create(req.body);
    res.status(201).json({ message: "Guide created", guide });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Get all guides
// ================================
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await HealthGuide.findAll();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Get guide by ID
// ================================
exports.getGuideById = async (req, res) => {
  try {
    const guide = await HealthGuide.findByPk(req.params.id);
    if (!guide) return res.status(404).json({ error: "Guide not found" });

    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Update guide
// ================================
exports.updateGuide = async (req, res) => {
  try {
    const guide = await HealthGuide.findByPk(req.params.id);
    if (!guide) return res.status(404).json({ error: "Guide not found" });

    await guide.update(req.body);
    res.json({ message: "Guide updated", guide });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// Delete guide
// ================================
exports.deleteGuide = async (req, res) => {
  try {
    const guide = await HealthGuide.findByPk(req.params.id);
    if (!guide) return res.status(404).json({ error: "Guide not found" });

    await guide.destroy();
    res.json({ message: "Guide deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
