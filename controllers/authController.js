// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password, role, specialty } = req.body;

    try {
        // Check if email already exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        // Check if username already exists
        user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        // Create new user (password is hashed by the model's hook)
        user = await User.create({
            username,
            email,
            password,
            role,
            specialty: role === 'doctor' ? specialty : null
        });

        // Create JWT
        const payload = {
            user: { id: user.id, role: user.role }
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        // Send token in response
        res.status(201).json({ token });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).send('Server Error');
    }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT
        const payload = {
            user: { id: user.id, role: user.role }
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.json({ token });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send('Server Error');
    }
};