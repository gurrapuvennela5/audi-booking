const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .matches(/@vnrvjiet\.in$/)
        .withMessage('Email must end with @vnrvjiet.in'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['student', 'hod', 'admin'])
        .withMessage('Role must be student, hod, or admin'),
];

const loginValidation = [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;
