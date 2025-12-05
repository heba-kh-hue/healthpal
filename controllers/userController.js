// controllers/userController.js
const User = require('../models/User');

// @desc    Get current logged in user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
    });
    res.status(200).json(user);
};

// @desc    Update current logged in user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res) => {
    try {
        // Find the user by the ID from the token
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get the fields to update from the request body
        const { username, specialty } = req.body;

        // Update the fields if they were provided
        user.username = username || user.username;
        // Only allow doctors to update their specialty
        if (req.user.role === 'doctor') {
            user.specialty = specialty || user.specialty;
        }

        // Save the updated user to the database
        const updatedUser = await user.save();
        
        // Exclude password from the response
        const userResponse = updatedUser.toJSON();
        delete userResponse.password;

        res.status(200).json(userResponse);

    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).send('Server Error');
    }
};