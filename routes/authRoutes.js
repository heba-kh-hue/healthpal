// routes/authRoutes.js
const express = require('express');
const router = express.Router();
// Update the import to include login
const { register, login } = require('../controllers/authController');

// Register route (already exists)
router.post('/register', register);

// --- ADD THIS NEW ROUTE ---
router.post('/login', login);

module.exports = router;