// src/routes/inventoryRoutes.js
const express = require("express");
const router = express.Router();

const {
  createItem,
  getAllInventory, 
  getItemById,
  updateItem,
  deleteItem
} = require("../controllers/inventoryController");

// Create
router.post("/", createItem);

// Get all
router.get("/", getAllInventory);

// Get one
router.get("/:id", getItemById);

// Update
router.put("/:id", updateItem);

// Delete
router.delete("/:id", deleteItem);

module.exports = router;
