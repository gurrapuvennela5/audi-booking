const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getAvailability } = require('../controllers/availabilityController');

router.get('/', verifyToken, getAvailability);

module.exports = router;
