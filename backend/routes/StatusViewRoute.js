const express = require("express");
const router = express.Router();

const statusViewController = require("../controllers/statusViewController");
const { verifyToken } = require("../middleware/auth");

// Marquer un item comme vu
router.post("/:statusItemId", verifyToken, statusViewController.viewStatusItem);

// Voir qui a vu un item (propriétaire)
router.get("/:statusItemId", verifyToken, statusViewController.getItemViews);

module.exports = router;
