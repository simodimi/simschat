const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middleware/auth");
const { uploadMessageFile } = require("../middleware/upload");
const { messageLimiter } = require("../middleware/rateLimit");

// Envoyer un message
router.post(
  "/",
  verifyToken,
  messageLimiter,
  uploadMessageFile,
  messageController.sendMessage
);

// Récupérer une conversation
router.get(
  "/conversation/:otherUserId",
  verifyToken,
  messageController.getConversation
);

module.exports = router;
