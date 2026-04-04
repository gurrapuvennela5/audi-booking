const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        auditoriumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auditorium',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
        },
        duration: {
            type: Number,
            default: 2,
            description: 'Duration in hours',
        },
        status: {
            type: String,
            enum: ['PENDING_HOD', 'APPROVED_HOD', 'APPROVED_ADMIN', 'REJECTED'],
            default: 'PENDING_HOD',
        },
        generatedLetter: {
            type: String,
            default: '',
        },
        remarks: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
