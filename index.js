// // index.js
//
// const express = require('express');
// const sequelize = require('./config/database');
//
// // --- MIDDLEWARE ---
// const app = express();
// app.use(express.json());
//
// // --- MODELS & ASSOCIATIONS ---
// const User = require('./models/User');
// const Consultation = require('./models/Consultation');
// const ConsultationSlot = require('./models/ConsultationSlot');
// const MentalHealthConsultation = require('./models/MentalHealthConsultation');
// const Message = require('./models/Message');
//
// const TreatmentRequest = require('./models/TreatmentRequest');
// const Donation = require('./models/Donation');
// const RecoveryUpdate = require('./models/RecoveryUpdate');
// const SponsorshipVerification = require('./models/SponsorshipVerification');
//
// // User (Doctor) has many ConsultationSlots
// User.hasMany(ConsultationSlot, { foreignKey: 'doctor_id' });
// ConsultationSlot.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });
//
// // User (Patient) has many Consultations
// User.hasMany(Consultation, { as: 'patient_consultations', foreignKey: 'patient_id' });
// Consultation.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });
//
// // User (Doctor) has many Consultations
// User.hasMany(Consultation, { as: 'doctor_consultations', foreignKey: 'doctor_id' });
// Consultation.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });
//
// // A ConsultationSlot can have one Consultation
// // ConsultationSlot.hasOne(Consultation, { foreignKey: 'slot_id' });
// // Consultation.belongsTo(ConsultationSlot, { as: 'slot', foreignKey: 'slot_id' });
//
// Consultation.hasOne(ConsultationSlot, { foreignKey: 'consultation_id', onDelete: 'SET NULL' });
// ConsultationSlot.belongsTo(Consultation, { as: 'consultation', foreignKey: 'consultation_id' });
//
// Consultation.hasOne(MentalHealthConsultation, { foreignKey: 'consultation_id', onDelete: 'CASCADE' });
// MentalHealthConsultation.belongsTo(Consultation, { foreignKey: 'consultation_id' });
//
//
// Consultation.hasMany(Message, { foreignKey: 'consultation_id', onDelete: 'CASCADE' });
// Message.belongsTo(Consultation, { foreignKey: 'consultation_id' });
//
// // A Message has a Sender (a User)
// User.hasMany(Message, { as: 'sent_messages', foreignKey: 'sender_id', onDelete: 'CASCADE' });
// Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
//
// // A Message has a Receiver (a User)
// User.hasMany(Message, { as: 'received_messages', foreignKey: 'receiver_id', onDelete: 'CASCADE' });
// Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });
//
//
// // A TreatmentRequest is created by a Doctor (User) for a Patient (User)
// TreatmentRequest.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });
// TreatmentRequest.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });
// User.hasMany(TreatmentRequest, { as: 'created_treatment_requests', foreignKey: 'doctor_id' });
// User.hasMany(TreatmentRequest, { as: 'patient_treatment_requests', foreignKey: 'patient_id' });
//
// // A TreatmentRequest can optionally be linked to a Consultation
// TreatmentRequest.belongsTo(Consultation, { foreignKey: 'consultation_id', allowNull: true });
// Consultation.hasMany(TreatmentRequest, { foreignKey: 'consultation_id' });
//
// // A TreatmentRequest can have many Donations
// TreatmentRequest.hasMany(Donation, { foreignKey: 'treatment_request_id', onDelete: 'CASCADE' });
// Donation.belongsTo(TreatmentRequest, { foreignKey: 'treatment_request_id' });
//
// // A Donation is made by a Donor (User)
// Donation.belongsTo(User, { as: 'donor', foreignKey: 'donor_id' });
// User.hasMany(Donation, { foreignKey: 'donor_id' });
//
// TreatmentRequest.hasMany(RecoveryUpdate, { foreignKey: 'treatment_request_id', onDelete: 'CASCADE' });
// RecoveryUpdate.belongsTo(TreatmentRequest, { foreignKey: 'treatment_request_id' });
// RecoveryUpdate.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });
// User.hasMany(RecoveryUpdate, { as: 'recovery_updates', foreignKey: 'patient_id' });
//
// // A Verification is linked to one TreatmentRequest (one-to-one)
// TreatmentRequest.hasOne(SponsorshipVerification, { foreignKey: 'treatment_request_id', onDelete: 'CASCADE' });
// SponsorshipVerification.belongsTo(TreatmentRequest, { foreignKey: 'treatment_request_id' });
//
// // A Verification is approved by a User (Admin/Hospital)
// SponsorshipVerification.belongsTo(User, { as: 'approved_by_user', foreignKey: 'approved_by' });
//
//
//
// // --- DATABASE & SERVER START ---
// const startServer = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connection has been established successfully.');
//
//         // Use { alter: true } to update tables if the model changes. Avoids dropping data.
//         await sequelize.sync({ alter: true });
//         console.log('All models were synchronized successfully.');
//
//         app.listen(PORT, () => {
//             console.log(`Server has started successfully on http://localhost:${PORT}`);
//         });
//     } catch (error) {
//         console.error('Unable to start the server:', error);
//     }
// };
//
// const PORT = process.env.PORT || 5000;
//
// // --- ROUTES ---
// app.get('/', (req, res) => res.send('HealthPal API is up and running!'));
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api', require('./routes/consultationRoutes'));
// app.use('/api/sponsorship', require('./routes/sponsorshipRoutes'));
//
//
// app.use('/api/guides', require('./routes/guidesRoutes'));
// app.use('/api/alerts', require('./routes/alertsRoutes'));
// app.use('/api/inventory', require('./routes/inventoryRoutes'));
// app.use('/api/medicine', require('./routes/medicineRoutes'));
// startServer();

// ===================================
//              IMPORTS
// ===================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./config/database');

// ===================================
//         CORE MIDDLEWARE
// ===================================
const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ===================================
//      MODELS & ASSOCIATIONS
// ===================================
// --- IMPORT ALL MODELS ---
const User = require('./models/User');
const Consultation = require('./models/Consultation');
const ConsultationSlot = require('./models/ConsultationSlot');
// ... your other models (Message, TreatmentRequest, etc.) ...

// Partner's Models
const InventoryItem = require('./models/InventoryItem');
const MedicineRequest = require('./models/MedicineRequest');
const { Alert, HealthGuide } = require('./models/PublicHealth'); // Destructure from this file
const { Workshop, WorkshopRegistration } = require('./models/Workshop');

// --- DEFINE ALL ASSOCIATIONS ---
// (Add ALL associations from your entire schema here)
// Example: A User (source) has many Inventory Items
User.hasMany(InventoryItem, { foreignKey: 'source_id' });
InventoryItem.belongsTo(User, { as: 'source', foreignKey: 'source_id' });

// Example: A User (patient) has many Medicine Requests
User.hasMany(MedicineRequest, { foreignKey: 'patient_id' });
MedicineRequest.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });

// ... and so on for every relationship in your master schema ...


// ===================================
//               ROUTES
// ===================================
app.get('/', (req, res) => res.send('HealthPal API is running!'));

// Your Original Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/consultationRoutes'));
app.use('/api/sponsorship', require('./routes/sponsorshipRoutes'));

// Combined Partner Routes
app.use('/api/v1', require('./routes/api'));

// ===================================
//      ERROR HANDLING MIDDLEWARE
// ===================================
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// ===================================
//         START THE SERVER
// ===================================
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established.');

        await sequelize.sync({ alter: true });

        console.log('✅ All models were synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
    }
};

startServer();
