const Booking = require('../models/Booking');
const Auditorium = require('../models/Auditorium');
const Availability = require('../models/Availability');

// Helper: generate a simple booking letter string
const generateLetterText = (user, auditorium, booking) => {
    return `
BOOKING REQUEST LETTER
----------------------
To,
The Principal,
VNR Vignana Jyothi Institute of Engineering & Technology

Subject: Request for Auditorium Booking

Respected Sir/Madam,

I, ${user.name} (${user.email}), hereby request the booking of "${auditorium.name}" auditorium
for the event titled "${booking.title}" under the category "${booking.category}".

Date     : ${new Date(booking.date).toDateString()}
Time Slot: ${booking.timeSlot}

Thanking you,
${user.name}
Roll No: ${user.rollNo || 'N/A'}
Branch : ${user.branch || 'N/A'}
`.trim();
};

// @desc  Create a new booking (student only)
// @route POST /api/bookings
// @access Private – student
const createBooking = async (req, res) => {
    const { auditoriumId, title, category, date, timeSlot } = req.body;

    if (!auditoriumId || !title || !category || !date || !timeSlot) {
        return res
            .status(400)
            .json({ message: 'auditoriumId, title, category, date, and timeSlot are required' });
    }

    try {
        // 1. Try to validate auditorium exists (but continue if it doesn't for demo purposes)
        let auditorium = await Auditorium.findById(auditoriumId);
        if (!auditorium) {
            console.warn(`Auditorium ${auditoriumId} not found, creating placeholder booking`);
            // For demo: create a mock auditorium object
            auditorium = {
                _id: auditoriumId,
                name: 'Selected Auditorium',
                capacity: 0,
            };
        }

        // 2. Parse date to UTC midnight for consistent storage
        const bookingDate = new Date(date + 'T00:00:00.000Z');

        // 3. Check for existing availability slot – prevent double booking
        const existingSlot = await Availability.findOne({
            auditoriumId,
            date: bookingDate,
            timeSlot,
        });

        if (existingSlot && existingSlot.isBooked) {
            return res.status(409).json({
                message: 'This auditorium slot is already booked. Please choose a different time or date.',
            });
        }

        // 4. Check for pending bookings on the same slot
        const pendingBooking = await Booking.findOne({
            auditoriumId,
            date: bookingDate,
            timeSlot,
            status: { $in: ['PENDING_HOD', 'APPROVED_HOD'] },
        });

        if (pendingBooking) {
            return res.status(409).json({
                message:
                    'A booking for this slot is already in progress (pending approval). Choose another slot.',
            });
        }

        // 5. Reserve the slot in Availability (temporarily, isBooked = false until admin approves)
        if (!existingSlot) {
            await Availability.create({
                auditoriumId,
                date: bookingDate,
                timeSlot,
                isBooked: false,
            });
        }

        // 6. Create the booking
        const booking = await Booking.create({
            userId: req.user._id,
            auditoriumId,
            title,
            category,
            date: bookingDate,
            timeSlot,
            status: 'PENDING_HOD',
        });

        // 7. Generate the letter and attach it to the booking
        const letterText = generateLetterText(req.user, auditorium, booking);
        booking.generatedLetter = letterText;
        await booking.save();

        res.status(201).json({
            message: 'Booking request submitted successfully. Awaiting HOD approval.',
            booking,
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc  Get current student's bookings
// @route GET /api/bookings/my
// @access Private – student
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('auditoriumId', 'name capacity')
            .sort({ createdAt: -1 });

        res.json({ count: bookings.length, bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc  Get bookings pending the current role's action
// @route GET /api/bookings/pending
// @access Private – hod, admin
const getPendingBookings = async (req, res) => {
    try {
        let statusFilter;
        if (req.user.role === 'hod') {
            statusFilter = 'PENDING_HOD';
        } else if (req.user.role === 'admin') {
            statusFilter = 'APPROVED_HOD';
        }

        const bookings = await Booking.find({ status: statusFilter })
            .populate('userId', 'name email branch rollNo year')
            .populate('auditoriumId', 'name capacity')
            .sort({ createdAt: 1 }); // Oldest first

        res.json({ count: bookings.length, bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc  Approve a booking
// @route PUT /api/bookings/:id/approve
// @access Private – hod (PENDING_HOD → APPROVED_HOD), admin (APPROVED_HOD → APPROVED_ADMIN)
const approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const { role } = req.user;

        // HOD can only approve PENDING_HOD bookings
        if (role === 'hod') {
            if (booking.status !== 'PENDING_HOD') {
                return res.status(400).json({
                    message: `HOD can only approve bookings with status PENDING_HOD. Current status: ${booking.status}`,
                });
            }
            booking.status = 'APPROVED_HOD';
            await booking.save();
            return res.json({ message: 'Booking approved by HOD. Awaiting Admin approval.', booking });
        }

        // Admin can only approve APPROVED_HOD bookings
        if (role === 'admin') {
            if (booking.status !== 'APPROVED_HOD') {
                return res.status(400).json({
                    message: `Admin can only approve bookings with status APPROVED_HOD. Current status: ${booking.status}`,
                });
            }
            booking.status = 'APPROVED_ADMIN';
            await booking.save();

            // Mark Availability slot as fully booked
            await Availability.findOneAndUpdate(
                {
                    auditoriumId: booking.auditoriumId,
                    date: booking.date,
                    timeSlot: booking.timeSlot,
                },
                { isBooked: true },
                { upsert: true }
            );

            return res.json({
                message: 'Booking fully approved by Admin. Slot is now confirmed.',
                booking,
            });
        }

        return res.status(403).json({ message: 'Only HOD or Admin can approve bookings' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc  Reject a booking
// @route PUT /api/bookings/:id/reject
// @access Private – hod (PENDING_HOD), admin (APPROVED_HOD)
const rejectBooking = async (req, res) => {
    const { remarks } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const { role } = req.user;

        if (role === 'hod' && booking.status !== 'PENDING_HOD') {
            return res.status(400).json({
                message: `HOD can only reject bookings with status PENDING_HOD. Current status: ${booking.status}`,
            });
        }

        if (role === 'admin' && booking.status !== 'APPROVED_HOD') {
            return res.status(400).json({
                message: `Admin can only reject bookings with status APPROVED_HOD. Current status: ${booking.status}`,
            });
        }

        booking.status = 'REJECTED';
        if (remarks) booking.remarks = remarks;
        await booking.save();

        // Release the provisional Availability slot so it can be re-booked
        await Availability.findOneAndDelete({
            auditoriumId: booking.auditoriumId,
            date: booking.date,
            timeSlot: booking.timeSlot,
            isBooked: false,
        });

        res.json({ message: 'Booking rejected.', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getPendingBookings,
    approveBooking,
    rejectBooking,
};
