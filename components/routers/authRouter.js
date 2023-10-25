const router = require('express').Router();
const AuthController = require('../controllers/authController');

// Registration
// ===================================================================================
router.post("/registration", AuthController.registration);

// Login
// ===================================================================================
router.post("/login", AuthController.login);

module.exports = router;