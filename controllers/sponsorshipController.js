const TreatmentRequest = require('../models/TreatmentRequest');
const User = require('../models/User');
const { Op } = require('sequelize');
const Donation = require('../models/Donation');
const sequelize = require('../config/database');
const RecoveryUpdate = require('../models/RecoveryUpdate');
const SponsorshipVerification = require('../models/SponsorshipVerification');

// @desc    Doctor creates a treatment request for a patient
// @route   POST /api/sponsorship/requests
// @access  Private (Doctor)
exports.createTreatmentRequest = async (req, res) => {
    const doctor_id = req.user.id;
    // Doctor must specify the patient's ID and the treatment details
    const { patient_id, consultation_id, treatment_type, content, goal_amount } = req.body;

    try {
        // Optional: Verify the patient exists and has the 'patient' role
        const patient = await User.findOne({ where: { id: patient_id, role: 'patient' } });
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found.' });
        }

        const request = await TreatmentRequest.create({
            doctor_id,
            patient_id,
            consultation_id, // This can be null
            treatment_type,
            content,
            goal_amount
        });

        res.status(201).json(request);

    } catch (error) {
        console.error("Create Treatment Request Error:", error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all open treatment requests (for donors to see)
// @route   GET /api/sponsorship/requests
// @access  Private (Any authenticated user)
exports.getOpenRequests = async (req, res) => {
    try {
        const requests = await TreatmentRequest.findAll({
            where: { status: 'open' },
            include: [ // Include info about the patient for context
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'username'] // Don't send sensitive patient info
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(requests);
    } catch (error) {
        console.error("Get Open Requests Error:", error);
        res.status(500).send('Server Error');
    }
};


// @desc    Donor makes a donation to a treatment request
// @route   POST /api/sponsorship/requests/:id/donate
// @access  Private (Donor, but any role can donate)
exports.makeDonation = async (req, res) => {
    const donor_id = req.user.id;
    const treatment_request_id = req.params.id;
    const { amount } = req.body;

    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // 1. Find the treatment request and lock it for the duration of the transaction
        const request = await TreatmentRequest.findByPk(treatment_request_id, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!request) {
            await t.rollback();
            return res.status(404).json({ msg: 'Treatment request not found.' });
        }

        // 2. Check if the request is still open for donations
        if (request.status !== 'open') {
            await t.rollback();
            return res.status(400).json({ msg: `This request is already ${request.status} and cannot receive donations.` });
        }

        // Basic validation for the donation amount
        if (!amount || amount <= 0) {
            await t.rollback();
            return res.status(400).json({ msg: 'Please provide a valid donation amount.' });
        }

        // 3. Create the donation record
        const donation = await Donation.create({
            treatment_request_id,
            donor_id,
            amount
        }, { transaction: t });

        // 4. Update the raised_amount on the treatment request
        const newRaisedAmount = parseFloat(request.raised_amount) + parseFloat(amount);
        request.raised_amount = newRaisedAmount;

        // 5. Check if the goal has been met or exceeded
        if (newRaisedAmount >= parseFloat(request.goal_amount)) {
            request.status = 'funded';
            console.log(`Treatment request ${request.id} is now fully funded!`);
        }

        // 6. Save the changes to the treatment request
        await request.save({ transaction: t });

        // 7. If everything was successful, commit the transaction
        await t.commit();

        res.status(201).json({ msg: 'Donation successful!', donation });

    } catch (error) {
        // If any step fails, roll back all changes
        await t.rollback();
        console.error("Make Donation Error:", error);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a recovery update to a treatment request
// @route   POST /api/sponsorship/requests/:id/updates
// @access  Private (Patient or Doctor involved in the request)
exports.addRecoveryUpdate = async (req, res) => {
    const treatment_request_id = req.params.id;
    const userId = req.user.id;
    const { content, file_url, status } = req.body;

    try {
        const request = await TreatmentRequest.findByPk(treatment_request_id);
        if (!request) {
            return res.status(404).json({ msg: 'Treatment request not found.' });
        }

        // Security: Only the patient or the doctor who created the request can post an update
        if (request.patient_id !== userId && request.doctor_id !== userId) {
            return res.status(403).json({ msg: 'You are not authorized to post an update for this request.' });
        }

        const update = await RecoveryUpdate.create({
            treatment_request_id,
            patient_id: request.patient_id, // The update is always from the patient's perspective
            content,
            file_url,
            status
        });

        res.status(201).json(update);

    } catch (error) {
        console.error("Add Recovery Update Error:", error);
        res.status(500).send('Server Error');
    }
};

// @desc    Upload a receipt for verification
// @route   POST /api/sponsorship/requests/:id/verify
// @access  Private (NGO, Hospital, or Admin)
exports.uploadForVerification = async (req, res) => {
    const treatment_request_id = req.params.id;
    const { receipt_url, patient_feedback } = req.body;

    try {
        const request = await TreatmentRequest.findByPk(treatment_request_id);
        if (!request) {
            return res.status(404).json({ msg: 'Treatment request not found.' });
        }

        // A real app might check if the request is 'funded' before allowing verification
        // For now, we'll allow it.

        const verification = await SponsorshipVerification.create({
            treatment_request_id,
            receipt_url,
            patient_feedback
        });

        res.status(201).json(verification);

    } catch (error) {
        console.error("Upload Verification Error:", error);
        res.status(500).send('Server Error');
    }
};