const express = require("express");
const router = express.Router();

const messageController = require("../controllers/Messagecontroller");
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
//compter les messages non lus
router.get("/unread", verifyToken, messageController.getUnreadCount);
// Marquer les messages comme lus
router.put(
  "/mark-as-read/:senderId",
  verifyToken,
  messageController.markAsRead
);

// Supprimer un message
router.delete("/:messageId", verifyToken, messageController.deleteMessage);
module.exports = router;
