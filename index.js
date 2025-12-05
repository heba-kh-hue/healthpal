// index.js

const express = require('express');
const sequelize = require('./config/database');

// --- MIDDLEWARE ---
const app = express();
app.use(express.json());

// --- MODELS & ASSOCIATIONS ---
const User = require('./models/User');
const Consultation = require('./models/Consultation');
const ConsultationSlot = require('./models/ConsultationSlot');
const MentalHealthConsultation = require('./models/MentalHealthConsultation');
const Message = require('./models/Message');


// User (Doctor) has many ConsultationSlots
User.hasMany(ConsultationSlot, { foreignKey: 'doctor_id' });
ConsultationSlot.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });

// User (Patient) has many Consultations
User.hasMany(Consultation, { as: 'patient_consultations', foreignKey: 'patient_id' });
Consultation.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });

// User (Doctor) has many Consultations
User.hasMany(Consultation, { as: 'doctor_consultations', foreignKey: 'doctor_id' });
Consultation.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });

// A ConsultationSlot can have one Consultation
// ConsultationSlot.hasOne(Consultation, { foreignKey: 'slot_id' });
// Consultation.belongsTo(ConsultationSlot, { as: 'slot', foreignKey: 'slot_id' });

Consultation.hasOne(ConsultationSlot, { foreignKey: 'consultation_id', onDelete: 'SET NULL' });
ConsultationSlot.belongsTo(Consultation, { as: 'consultation', foreignKey: 'consultation_id' });

Consultation.hasOne(MentalHealthConsultation, { foreignKey: 'consultation_id', onDelete: 'CASCADE' });
MentalHealthConsultation.belongsTo(Consultation, { foreignKey: 'consultation_id' });


Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });
Message.belongsTo(Consultation, { foreignKey: 'consultation_id' });
Consultation.hasMany(Message, { foreignKey: 'consultation_id', onDelete: 'CASCADE' }); 

// --- DATABASE & SERVER START ---
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');
        
        // Use { alter: true } to update tables if the model changes. Avoids dropping data.
        await sequelize.sync({ alter: true });
        console.log('✅ All models were synchronized successfully.');
        
        app.listen(PORT, () => {
            console.log(`Server has started successfully on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to start the server:', error);
    }
};

const PORT = process.env.PORT || 5000;

// --- ROUTES ---
app.get('/', (req, res) => res.send('HealthPal API is up and running!'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/consultationRoutes'));

// We will add the new routes here soon

startServer();

///////////////////////////////////////
// const express = require('express');
// const sequelize = require('./config/database');

// // --- MIDDLEWARE ---
// const app = express();
// app.use(express.json()); // Crucial: This must come before the routes are defined

// // --- MODELS & ASSOCIATIONS ---
// const User = require('./models/User');
// const Consultation = require('./models/Consultation');
// const ConsultationSlot = require('./models/ConsultationSlot');

// // User (Doctor) has many ConsultationSlots
// User.hasMany(ConsultationSlot, { foreignKey: 'doctor_id', onDelete: 'CASCADE' });
// ConsultationSlot.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });

// // User (Patient) has many Consultations
// User.hasMany(Consultation, { as: 'patient_consultations', foreignKey: 'patient_id', onDelete: 'CASCADE' });
// Consultation.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });

// // User (Doctor) has many Consultations
// User.hasMany(Consultation, { as: 'doctor_consultations', foreignKey: 'doctor_id', onDelete: 'CASCADE' });
// Consultation.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });

// // A ConsultationSlot can have one Consultation
// ConsultationSlot.hasOne(Consultation, { foreignKey: 'slot_id', onDelete: 'SET NULL' });
// Consultation.belongsTo(ConsultationSlot, { as: 'slot', foreignKey: 'slot_id' });

// const PORT = process.env.PORT || 5000;

// // --- ROUTES ---
// app.get('/', (req, res) => res.send('HealthPal API is up and running!'));
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api', require('./routes/consultationRoutes'));


// // --- DATABASE & SERVER START ---
// const startServer = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('✅ Database connection has been established successfully.');
        
//         await sequelize.sync({ alter: true });
//         console.log('✅ All models were synchronized successfully.');
        
//         app.listen(PORT, () => {
//             console.log(`🚀 Server has started successfully on http://localhost:${PORT}`);
//         });
//     } catch (error) {
//         console.error('❌ Unable to start the server:', error);
//     }
// };

// startServer();