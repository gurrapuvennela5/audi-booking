const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
    createBooking,
    getMyBookings,
    getPendingBookings,
    approveBooking,
    rejectBooking,
} = require('../controllers/bookingController');

// Student: create a booking
router.post('/', verifyToken, authorizeRoles('student'), createBooking);

// Student: view their own bookings
router.get('/my', verifyToken, authorizeRoles('student'), getMyBookings);

// HOD & Admin: view pending bookings for their level
router.get('/pending', verifyToken, authorizeRoles('hod', 'admin'), getPendingBookings);

// HOD & Admin: approve a booking
router.put('/:id/approve', verifyToken, authorizeRoles('hod', 'admin'), approveBooking);

// HOD & Admin: reject a booking
router.put('/:id/reject', verifyToken, authorizeRoles('hod', 'admin'), rejectBooking);

module.exports = router;
