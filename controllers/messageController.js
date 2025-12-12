// controllers/messageController.js
const Consultation = require('../models/Consultation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message within a consultation
// @route   POST /api/consultations/:consultationId/messages
// @access  Private (Patient or Doctor involved)
exports.sendMessage = async (req, res) => {
    const { consultationId } = req.params;
    const { message_text } = req.body;
    const sender_id = req.user.id;

    try {
        // 1. Find the consultation
        const consultation = await Consultation.findByPk(consultationId);
        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found' });
        }

        // 2. Security: Ensure the sender is part of this consultation
        if (sender_id !== consultation.patient_id && sender_id !== consultation.doctor_id) {
            return res.status(403).json({ msg: 'User not authorized to send messages in this consultation' });
        }
        
        // 3. Determine the receiver's ID
        const receiver_id = sender_id === consultation.patient_id ? consultation.doctor_id : consultation.patient_id;
        
        // 4. Create the message
        const message = await Message.create({
            message_text,
            sender_id,
            receiver_id,
            consultation_id: consultation.id
            // We will add translation logic here later
        });

        res.status(201).json(message);

    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all messages for a specific consultation
// @route   GET /api/consultations/:consultationId/messages
// @access  Private (Patient or Doctor involved)
exports.getMessages = async (req, res) => {
    const { consultationId } = req.params;
    const userId = req.user.id;

    try {
        const consultation = await Consultation.findByPk(consultationId);
        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found' });
        }

        // Security: Ensure the user is part of this consultation
        if (userId !== consultation.patient_id && userId !== consultation.doctor_id) {
            return res.status(403).json({ msg: 'User not authorized to view these messages' });
        }

        const messages = await Message.findAll({
            where: { consultation_id: consultationId },
            include: [ // Include sender info to display who sent the message
                { model: User, as: 'sender', attributes: ['id', 'username', 'role'] }
            ],
            order: [['createdAt', 'ASC']] // Show messages in chronological order
        });

        res.status(200).json(messages);

    } catch (error) {
        console.error("Get Messages Error:", error);
        res.status(500).send('Server Error');
    }
};