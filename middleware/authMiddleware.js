// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require a user to be logged in
exports.protect = async (req, res, next) => {
    let token;

    // We will send the token in the 'Authorization' header like this: 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user's info (id and role) to the request object
            // so that subsequent protected routes can access it
            req.user = { id: decoded.user.id, role: decoded.user.role };

            next(); // Move on to the next piece of middleware or the controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// Middleware to authorize based on user role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: `User role '${req.user.role}' is not authorized to access this route` });
        }
        next();
    };
};