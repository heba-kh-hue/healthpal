const { InventoryRegistry } = require("../models");

// Create an item
exports.createItem = async (req, res) => {
  try {
    const item = await InventoryRegistry.create(req.body);
    res.status(201).json({ message: "Item created", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await InventoryRegistry.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await InventoryRegistry.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const item = await InventoryRegistry.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await item.update(req.body);
    res.json({ message: "Item updated", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await InventoryRegistry.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await item.destroy();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
