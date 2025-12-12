// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const { getHealthNews } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware'); // Only logged-in users can see news

router.get('/health', protect, getHealthNews);

module.exports = router;