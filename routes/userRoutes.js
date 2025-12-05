// routes/userRoutes.js
const express = require('express');
const router = express.Router();
// Update the import to include updateMe
const { getMe, updateMe } = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

// The GET route already exists
router.get('/me', protect, authorize('doctor', 'patient'), getMe);

// Using .route() to chain methods for the same path
router.route('/me')
    .get(protect, authorize('doctor', 'patient'), getMe)
    .put(protect, authorize('doctor', 'patient'), updateMe);

module.exports = router;