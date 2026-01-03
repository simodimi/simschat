const express = require("express");
const router = express.Router();

const friendController = require("../controllers/friendController");
const { verifyToken } = require("../middleware/auth");
const { friendRequestLimiter } = require("../middleware/ratelimit");

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
  friendRequestLimiter,
  friendController.respondToRequest
);
// Récupérer les demandes envoyées
router.get("/requests/sent", verifyToken, friendController.getSentRequests);

// Récupérer les demandes reçues (en attente)
router.get(
  "/requests/received",
  verifyToken,
  friendController.getReceivedRequests
);

// Annuler une demande envoyée
router.delete(
  "/request/:requestId",
  verifyToken,
  friendRequestLimiter,
  friendController.cancelRequest
);

// Liste des amis
router.get("/", verifyToken, friendController.getFriends);

module.exports = router;
