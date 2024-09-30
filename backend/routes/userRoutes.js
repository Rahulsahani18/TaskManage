const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware
const router = express.Router();

// Route to get all users (Admin only)
router.get('/allUsers', auth, getAllUsers);

module.exports = router;
