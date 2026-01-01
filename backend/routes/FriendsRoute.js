const express = require("express");
const router = express.Router();

const friendController = require("../controllers/friendController");
const { verifyToken } = require("../middleware/auth");
const { friendRequestLimiter } = require("../middleware/rateLimit");

// Envoyer une demande d'ami
router.post(
  "/request",
  verifyToken,
  friendRequestLimiter,
  friendController.sendFriendRequest
);

// Accepter / refuser une demande
router.put(
  "/request/:requestId",
  verifyToken,
  friendController.respondToRequest
);

// Liste des amis
router.get("/", verifyToken, friendController.getFriends);

module.exports = router;
