const express = require('express');
const router = express.Router();
const { 
    createSlots, 
    getDoctors, 
    getDoctorSlots, 
    bookConsultation,
    getMyConsultations,
    cancelConsultation,
    addMentalHealthDetails
} = require('../controllers/consultationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');

// --- Doctor Routes ---
router.post('/slots', protect, authorize('doctor'), createSlots);

// --- Patient Routes ---
router.get('/doctors', protect, authorize('patient'), getDoctors);
router.get('/doctors/:doctorId/slots', protect, authorize('patient'), getDoctorSlots);
router.post('/consultations/book/:slotId', protect, authorize('patient'), bookConsultation);

// --- Shared Routes ---
router.get('/consultations/me', protect, authorize('patient', 'doctor'), getMyConsultations);

router.put('/consultations/:id/cancel', protect, authorize('patient', 'doctor'), cancelConsultation);

router.route('/consultations/:consultationId/messages')
    .post(protect, authorize('patient', 'doctor'), sendMessage)
    .get(protect, authorize('patient', 'doctor'), getMessages);

module.exports = router;
