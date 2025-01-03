// backend/routes/authRoutes.js
const express = require('express');
const { signup, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile); // Route is now protected

module.exports = router;

// Add other auth routes...