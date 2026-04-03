const Auditorium = require('../models/Auditorium');

// @desc  Get all auditoriums
// @route GET /api/auditoriums
// @access Private (any authenticated user)
const getAuditoriums = async (req, res) => {
    try {
        const auditoriums = await Auditorium.find().sort({ name: 1 });
        res.json({ count: auditoriums.length, auditoriums });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAuditoriums };
