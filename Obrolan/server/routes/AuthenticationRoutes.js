const express = require('express');
const router = express.Router();

// importing controllers
const { login, register } = require('../controllers/AuthenticationControllers');

router.post('/login', login);
router.post('/register', register);

module.exports = router;