// routes/sponsorshipRoutes.js
const express = require('express');
const router = express.Router();
const {
    createTreatmentRequest,
    getOpenRequests,
    makeDonation,
    addRecoveryUpdate,       // <-- ADD THIS
    uploadForVerification    // <-- AND ADD THIS
} = require('../controllers/sponsorshipController');
const {
    protect, authorize
} = require('../middleware/authMiddleware');

// Route for doctors to create requests
router.post('/requests', protect, authorize('doctor'), createTreatmentRequest);
// Route for any logged-in user (e.g., a donor) to see open requests
router.get('/requests', protect, getOpenRequests);
router.post('/requests/:id/donate', protect, makeDonation); // Any logged-in user can donate
router.post('/requests/:id/updates', protect, authorize('patient', 'doctor'), addRecoveryUpdate);
router.post('/requests/:id/verify', protect, authorize('ngo', 'hospital', 'admin'), uploadForVerification);

module.exports = router;