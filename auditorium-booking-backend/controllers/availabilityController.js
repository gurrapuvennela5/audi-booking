const Availability = require('../models/Availability');

// @desc  Get availability slots for a given date
// @route GET /api/availability?date=YYYY-MM-DD
// @access Private (any authenticated user)
const getAvailability = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Query parameter "date" is required (YYYY-MM-DD)' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Match the full day (midnight to midnight)
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    try {
        const slots = await Availability.find({
            date: { $gte: startOfDay, $lte: endOfDay },
        }).populate('auditoriumId', 'name capacity');

        res.json({ date, count: slots.length, slots });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAvailability };
