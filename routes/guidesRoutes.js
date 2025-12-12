const express = require("express");
const router = express.Router();

const {
  createGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
  deleteGuide
} = require("../controllers/guidesController");

// create
router.post("/", createGuide);

// get all
router.get("/", getAllGuides);

// get one
router.get("/:id", getGuideById);

// update
router.put("/:id", updateGuide);

// delete
router.delete("/:id", deleteGuide);

module.exports = router;
