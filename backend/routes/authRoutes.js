const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateLogin} = require('../validation/joi')
const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login',validateLogin, login);

module.exports = router;
