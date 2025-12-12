const express = require('express');
const router = express.Router();
const Auth = require('../controllers/AuthController');
const Coord = require('../controllers/CoordinationController');
const Health = require('../controllers/PublicHealthController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Auth
router.post('/auth/login', Auth.login);

// Inventory (Donors)
router.post('/inventory/add', verifyToken, checkRole(['donor', 'admin']), upload.single('image'), Coord.addInventory);
router.get('/inventory/search', Coord.search);

// Requests (Patients & NGOs)
router.post('/requests/create', verifyToken, checkRole(['patient']), Coord.createRequest);
router.post('/requests/fulfill', verifyToken, checkRole(['ngo', 'admin']), Coord.fulfillRequest);

// Alerts (Admin)
router.post('/alerts', verifyToken, checkRole(['admin', 'hospital']), Health.createAlert);
router.get('/alerts', Health.getAlerts);


// Guides
router.get('/guides', Health.getGuides);

// Workshops (Updated)
router.get('/workshops', Health.getWorkshops); // Public list

// Propose Workshop (Doctors, NGOs, Admin)
router.post('/workshops/create', verifyToken, checkRole(['doctor', 'ngo', 'admin']), Health.createWorkshop);

// Join Workshop (Any Logged in User: Patient, etc)
router.post('/workshops/join', verifyToken, Health.joinWorkshop);

router.get('/external/news', Health.getGlobalNews);

router.post('/auth/login', Auth.login);
router.post('/auth/register', Auth.register); // New Endpoint

module.exports = router;