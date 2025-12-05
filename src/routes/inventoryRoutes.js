const express = require("express");
const router = express.Router();

const {
  createItem,
  getAllInventory,
  getItemById,
  updateItem,
  deleteItem
} = require("../controllers/inventoryController");

// create
router.post("/", createItem);

// get all
router.get("/", getAllInventory);

// get one
router.get("/:id", getItemById);

// update
router.put("/:id", updateItem);

// delete
router.delete("/:id", deleteItem);

module.exports = router;
