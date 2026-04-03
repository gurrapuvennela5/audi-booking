require('dotenv').config();
const mongoose = require('mongoose');
const Auditorium = require('../models/Auditorium');
const connectDB = require('../config/db');

const auditoriums = [
    {
        name: 'Main Auditorium',
        capacity: 1200,
        resources: {
            projector: true,
            mics: 6,
            ac: true,
            sound: 'Dolby 5.1 Surround',
        },
    },
    {
        name: 'Seminar Hall A',
        capacity: 300,
        resources: {
            projector: true,
            mics: 3,
            ac: true,
            sound: 'Stereo',
        },
    },
    {
        name: 'Seminar Hall B',
        capacity: 150,
        resources: {
            projector: true,
            mics: 2,
            ac: false,
            sound: 'Mono',
        },
    },
];

const seed = async () => {
    await connectDB();
    try {
        await Auditorium.deleteMany();
        const inserted = await Auditorium.insertMany(auditoriums);
        console.log(`Seeded ${inserted.length} auditoriums:`);
        inserted.forEach((a) => console.log(`  - ${a.name} (ID: ${a._id})`));
    } catch (error) {
        console.error('Seeding failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('DB connection closed.');
    }
};

seed();
