const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();


exports.register = async (req, res) => {
    const { username, email, password, role, adminPassword } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the user wants to be an admin and knows the admin password
        let isAdmin = false;
        if (role === 'admin') {
            if (adminPassword === 'admin1818') {
                isAdmin = true;
            } else {
                return res.status(403).json({ message: 'Invalid admin password' });
            }
        }

        // Create the new user
        const user = new User({
            username,
            email,
            password,
            isAdmin
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email not exists. Please use a different email.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
