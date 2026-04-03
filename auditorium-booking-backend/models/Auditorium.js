const mongoose = require('mongoose');

const auditoriumSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Auditorium name is required'],
            unique: true,
            trim: true,
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: 1,
        },
        resources: {
            projector: { type: Boolean, default: false },
            mics: { type: Number, default: 0 },
            ac: { type: Boolean, default: false },
            sound: { type: String, default: 'None' },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Auditorium', auditoriumSchema);
