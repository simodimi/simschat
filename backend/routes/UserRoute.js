const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");
const { uploadProfilePhoto } = require("../middleware/upload");

// Auth
router.post("/register", uploadProfilePhoto, userController.createUser);
router.post("/login", userController.loginUser);
router.post("/logout", verifyToken, userController.logoutUser);

// Validation compte
router.get("/validate/:token", userController.validateUserByToken);

// Token
router.get("/check-token", verifyToken, userController.checkTokenValidity);

// Mot de passe oublié
router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-code", userController.verifyCode);
router.post("/reset-password", userController.resetPassword);

// CRUD user
router.get("/", verifyToken, userController.getAllUsers);
router.get("/:iduser", verifyToken, userController.getUser);
router.put(
  "/:iduser",
  verifyToken,
  uploadProfilePhoto,
  userController.updateUser
);
router.delete("/:iduser", verifyToken, userController.deleteUser);

module.exports = router;
