const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.iduser);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non valide" });
    }

    req.user = {
      iduser: user.iduser,
      username: user.username,
      useremail: user.useremail,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    console.error("verifyToken error:", error);
    return res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour vérifier si l'utilisateur est le propriétaire
const isOwner = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.iduser !== parseInt(resourceUserId)) {
      return res.status(403).json({
        message: "Accès refusé : vous n'êtes pas le propriétaire",
      });
    }
    next();
  };
};

// Middleware pour vérifier l'accès aux messages privés
// Middleware pour vérifier l'accès aux messages privés
const canAccessMessage = async (req, res, next) => {
  try {
    const messageId =
      req.params.messageId || req.params.id || req.body.messageId;
    const currentUserId = req.user.iduser;

    if (!messageId) {
      return res.status(400).json({ message: "ID du message requis" });
    }

    // Chercher le message
    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    // Vérifier les droits d'accès
    const canAccess =
      message.senderId === currentUserId ||
      message.receiverId === currentUserId;

    if (!canAccess) {
      return res.status(403).json({
        message: "Accès refusé : vous n'avez pas accès à ce message",
      });
    }

    // Ajouter le message à la requête pour usage ultérieur
    req.message = message;
    next();
  } catch (error) {
    console.error("canAccessMessage error:", error);
    return res.status(500).json({ message: "Erreur de vérification d'accès" });
  }
};

module.exports = {
  verifyToken,
  isOwner,
  canAccessMessage,
};
