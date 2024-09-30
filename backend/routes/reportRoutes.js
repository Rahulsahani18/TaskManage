const express = require('express');
const { getTaskReport } = require('../controllers/reportController');
const { auth, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Get task report (Admin only)
router.get('/', auth, isAdmin, getTaskReport);

module.exports = router;
