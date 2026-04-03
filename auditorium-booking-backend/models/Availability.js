const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
    {
        auditoriumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auditorium',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        timeSlot: {
            type: String,
            required: true,
        },
        isBooked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Compound unique index to prevent duplicate slot entries
availabilitySchema.index({ auditoriumId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
