const User = require('../models/User');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if the user is an admin
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Access denied. Admins only.' });
    // }

    // Retrieve all users, excluding the password field
    const users = await User.find().select('-password');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
