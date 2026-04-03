const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getAuditoriums } = require('../controllers/auditoriumController');

router.get('/', verifyToken, getAuditoriums);

module.exports = router;
