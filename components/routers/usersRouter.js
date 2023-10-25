const router = require('express').Router();
const UsersController = require('../controllers/usersController');

// Account route
// ===================================================================================
router.get("/users-list", UsersController.getUsersList);

module.exports = router;