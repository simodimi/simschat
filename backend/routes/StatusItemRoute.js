const express = require("express");
const router = express.Router();

const statusItemController = require("../controllers/statusItemController");
const { verifyToken } = require("../middleware/auth");
const { uploadStatusMedia } = require("../middleware/upload");

// Ajouter un item à un status
router.post(
  "/:statusId",
  verifyToken,
  uploadStatusMedia,
  statusItemController.addStatusItem
);

// Modifier un item
router.put(
  "/item/:itemId",
  verifyToken,
  uploadStatusMedia,
  statusItemController.updateStatusItem
);

// Supprimer un item
router.delete(
  "/item/:itemId",
  verifyToken,
  statusItemController.deleteStatusItem
);

module.exports = router;
