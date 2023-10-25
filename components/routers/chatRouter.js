const router = require('express').Router();
const ChatController = require('../controllers/chatController');

// Chat route
// ===================================================================================
router.get("/chat", ChatController.getChatData);

module.exports = router;