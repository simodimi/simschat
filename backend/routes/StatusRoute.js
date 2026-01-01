const express = require("express");
const router = express.Router();

const statusController = require("../controllers/statusController");
const { verifyToken } = require("../middleware/auth");
const { uploadStatusMedia } = require("../middleware/upload");

// Créer un status
router.post("/", verifyToken, uploadStatusMedia, statusController.createStatus);

// Récupérer les status actifs
router.get("/active", verifyToken, statusController.getActiveStatuses);

// Supprimer un status
router.delete("/:statusId", verifyToken, statusController.deleteStatus);

module.exports = router;
