const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config()

// Middleware to check if user is authenticated
exports.auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

        req.user = decoded; // Attach the user info to the request
        next(); // Proceed to the next middleware
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};


// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
  next();
};
