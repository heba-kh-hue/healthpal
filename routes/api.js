const express = require('express');
const router = express.Router();

// Import Your Refactored Controllers
const Coord = require('../controllers/CoordinationController');
const Health = require('../controllers/PublicHealthController');

// IMPORT PARTNER'S MIDDLEWARE (Crucial Step)
// Note: Ensure this path is correct based on where they put it
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Keep your upload logic

// --- FEATURE 3: Inventory & Requests ---

// Add Inventory (Protected: Donor or Admin)
router.post('/inventory/add', protect, authorize('donor', 'admin'), upload.single('image'), Coord.addInventory);
// Search Inventory (Public)
router.get('/inventory/search', Coord.search);

// Create Request (Protected: Patient)
router.post('/requests/create', protect, authorize('patient'), Coord.createRequest);

// Fulfill Request (Protected: NGO or Admin)
router.post('/requests/fulfill', protect, authorize('ngo', 'admin'), Coord.fulfillRequest);


// --- FEATURE 4: Education & Alerts ---

// Create Alert (Protected: Admin or Hospital)
router.post('/alerts', protect, authorize('admin', 'hospital'), Health.createAlert);

// Get Alerts (Public)
router.get('/alerts', Health.getAlerts);

// Get Guides (Public)
router.get('/guides', Health.getGuides);

// Get External News (Public)
router.get('/external/news', Health.getGlobalNews);


// --- WORKSHOPS ---

// Get Workshops (Public)
router.get('/workshops', Health.getWorkshops);

// Propose Workshop (Protected: Doctor, NGO, Admin)
router.post('/workshops/create', protect, authorize('doctor', 'ngo', 'admin'), Health.createWorkshop);

// Join Workshop (Protected: Any logged in user)
router.post('/workshops/join', protect, Health.joinWorkshop);


module.exports = router;