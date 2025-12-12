// controllers/consultationController.js
const { Op } = require('sequelize');
const User = require('../models/User');
const ConsultationSlot = require('../models/ConsultationSlot');
const Consultation = require('../models/Consultation');
const sequelize = require('../config/database');
const Message = require('../models/Message');
const translate = require('translate-google'); // <-- ADD THIS LINE


// @desc    Doctor creates new availability slots
// @route   POST /api/slots
// @access  Private (Doctor)
exports.createSlots = async (req, res) => {
    // Expecting an array of slots in the body, e.g., [{ start_datetime, end_datetime }, ...]
    const { slots } = req.body;
    const doctor_id = req.user.id;

    try {
        const slotsToCreate = slots.map(slot => ({ ...slot, doctor_id }));
        const createdSlots = await ConsultationSlot.bulkCreate(slotsToCreate);
        res.status(201).json(createdSlots);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Patient gets a list of all doctors
// @route   GET /api/doctors
// @access  Private (Patient)
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.findAll({
            where: { role: 'doctor' },
            attributes: ['id', 'username', 'specialty'] // Only send public info
        });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Patient gets available slots for a specific doctor
// @route   GET /api/doctors/:doctorId/slots
// @access  Private (Patient)
exports.getDoctorSlots = async (req, res) => {
    try {
        const slots = await ConsultationSlot.findAll({
            where: {
                doctor_id: req.params.doctorId,
                is_booked: false,
                start_datetime: { [Op.gt]: new Date() } // Only show future slots
            }
        });
        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Patient books a consultation slot
// @route   POST /api/consultations/book/:slotId
// @access  Private (Patient)
exports.bookConsultation = async (req, res) => {
    const { slotId } = req.params;
    const patient_id = req.user.id;

    const t = await sequelize.transaction();

    try {
        // 1. Find the requested slot and lock it
        const slot = await ConsultationSlot.findByPk(slotId, { transaction: t, lock: true });

        if (!slot || slot.is_booked || new Date(slot.start_datetime) < new Date()) {
            await t.rollback();
            return res.status(400).json({ msg: 'Slot is not available for booking.' });
        }
        
        // 2. Create the consultation record first
        const doctor = await User.findByPk(slot.doctor_id);
        const consultation = await Consultation.create({
            patient_id,
            doctor_id: slot.doctor_id,
            specialty: doctor.specialty,
            mode: 'audio'
        }, { transaction: t });

        // 3. Now, update the slot to mark it as booked AND link it to the new consultation
        slot.is_booked = true;
        slot.consultation_id = consultation.id; // <-- This is the key change
        await slot.save({ transaction: t });

        await t.commit();
        
        // Return the created consultation
        res.status(201).json(consultation);

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all consultations for the logged-in user (patient or doctor)
// @route   GET /api/consultations/me
// @access  Private (Patient, Doctor)
exports.getMyConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.findAll({
            where: {
                [Op.or]: [{ patient_id: req.user.id }, { doctor_id: req.user.id }]
            },
            include: [
                { model: User, as: 'patient', attributes: ['id', 'username'] },
                { model: User, as: 'doctor', attributes: ['id', 'username', 'specialty'] },
                { model: ConsultationSlot, as: 'slot' }
            ]
        });
        res.json(consultations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.cancelConsultation = async (req, res) => {
    const consultationId = req.params.id;
    const userId = req.user.id;

    const t = await sequelize.transaction();

    try {
        const consultation = await Consultation.findByPk(consultationId, { transaction: t });

        // 1. Check if consultation exists
        if (!consultation) {
            await t.rollback();
            return res.status(404).json({ msg: 'Consultation not found' });
        }

        // 2. Security Check: Ensure the user is either the patient or the doctor for this consultation
        if (consultation.patient_id !== userId && consultation.doctor_id !== userId) {
            await t.rollback();
            return res.status(403).json({ msg: 'User not authorized to modify this consultation' });
        }
        
        // 3. Check if the consultation is already completed or cancelled
        if (['completed', 'cancelled'].includes(consultation.status)) {
            await t.rollback();
            return res.status(400).json({ msg: `Cannot cancel a consultation that is already ${consultation.status}` });
        }

        // 4. Update the consultation status
        consultation.status = 'cancelled';
        await consultation.save({ transaction: t });

        // 5. IMPORTANT: Free up the original slot to be booked again
        if (consultation.slot_id) {
            const slot = await ConsultationSlot.findByPk(consultation.slot_id, { transaction: t });
            if (slot) {
                slot.is_booked = false;
                await slot.save({ transaction: t });
            }
        }

        await t.commit();
        res.status(200).json({ msg: 'Consultation successfully cancelled', consultation });

    } catch (error) {
        await t.rollback();
        console.error("Cancel Consultation Error:", error);
        res.status(500).send('Server Error');
    }

};


    // @desc    Send a message within a consultation
// @route   POST /api/consultations/:id/messages
// @access  Private (Patient or Doctor involved)
// in controllers/consultationController.js

exports.sendMessage = async (req, res) => {
    const consultationId = req.params.id;
    const senderId = req.user.id;
    const { message_text, language } = req.body; // Expect language (e.g., 'ar', 'en') from the client

    try {
        const consultation = await Consultation.findByPk(consultationId, {
            // Eagerly load the user details to get their language preferences
            include: [
                { model: User, as: 'patient' },
                { model: User, as: 'doctor' }
            ]
        });

        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found' });
        }

        // Security check
        if (consultation.patient_id !== senderId && consultation.doctor_id !== senderId) {
            return res.status(403).json({ msg: 'Not authorized to send messages in this consultation' });
        }

        // Determine sender, receiver, and their language preferences
        const sender = senderId === consultation.patient_id ? consultation.patient : consultation.doctor;
        const receiver = senderId === consultation.patient_id ? consultation.doctor : consultation.patient;
        const receiverLang = receiver.language_pref || 'en'; // Default receiver to English if not set

        let translated_text = null;

        // --- TRANSLATION LOGIC ---
        if (language && language !== receiverLang) {
            try {
                console.log(`Translating from '${language}' to '${receiverLang}'...`);
                translated_text = await translate(message_text, { from: language, to: receiverLang });
                console.log(`Translation successful: "${translated_text}"`);
            } catch (translationError) {
                console.error("Translation API Error:", translationError);
                // Don't stop the message from being sent; just note the translation failed.
                // In a real app, you might handle this more gracefully.
            }
        }

        // Create the message with original text and optional translation
        const message = await Message.create({
            consultation_id: consultationId,
            sender_id: senderId,
            receiver_id: receiver.id,
            message_text,
            language,
            translated_text
        });

        res.status(201).json(message);

    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all messages for a consultation
// @route   GET /api/consultations/:id/messages
// @access  Private (Patient or Doctor involved)
    exports.getMessages = async (req, res) => {
        const consultationId = req.params.id;
        const userId = req.user.id;

        try {
            const consultation = await Consultation.findByPk(consultationId);
            if (!consultation) {
                return res.status(404).json({ msg: 'Consultation not found' });
            }

            // Security: Ensure the user is part of this consultation
            if (consultation.patient_id !== userId && consultation.doctor_id !== userId) {
                return res.status(403).json({ msg: 'Not authorized to view these messages' });
            }

            const messages = await Message.findAll({
                where: { consultation_id: consultationId },
                include: [ // Include sender info to display names in the chat
                    { model: User, as: 'sender', attributes: ['id', 'username', 'role'] }
                ],
                order: [['createdAt', 'ASC']] // Order messages chronologically
            });

            res.json(messages);

        } catch (error) {
            console.error("Get Messages Error:", error);
            res.status(500).send('Server Error');
        }

};