const express = require("express");
const router = express.Router();

const {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlert,
  deleteAlert
} = require("../controllers/alertsController");

// create
router.post("/", createAlert);

// get all
router.get("/", getAllAlerts);

// get one
router.get("/:id", getAlertById);

// update
router.put("/:id", updateAlert);

// delete
router.delete("/:id", deleteAlert);

module.exports = router;
