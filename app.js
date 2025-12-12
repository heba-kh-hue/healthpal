const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Security
const morgan = require('morgan'); // Logging
require('dotenv').config();
const apiRoutes = require('./src/routes/api');

const app = express();

// 1. SECURITY & LOGGING MIDDLEWARE
app.use(helmet()); // Sets HTTP headers to prevent attacks (XSS, etc.)
app.use(morgan('dev')); // Logs requests: "GET /api/v1/alerts 200 5.6ms"
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 2. ROUTES
app.use('/api/v1', apiRoutes);

// 3. CENTRALIZED ERROR HANDLING (Req: Error Handling)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error internally
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HealthPal Final Running on Port ${PORT}`));