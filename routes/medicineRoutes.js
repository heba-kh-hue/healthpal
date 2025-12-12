const express = require("express");
const router = express.Router();

const {
  createMedicineRequest,
  getAllMedicineRequests,
  getMedicineRequestById,
  updateMedicineStatus,
  deleteMedicineRequest
} = require("../controllers/medicineController");

// CREATE
router.post("/", createMedicineRequest);

// GET ALL
router.get("/", getAllMedicineRequests);

// GET ONE
router.get("/:id", getMedicineRequestById);

// UPDATE STATUS
router.put("/:id/status", updateMedicineStatus);

// DELETE
router.delete("/:id", deleteMedicineRequest);

module.exports = router;
