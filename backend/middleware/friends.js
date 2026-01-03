const Friends = require("../models/Friends");
const User = require("../models/User");
const { Op } = require("sequelize");

// Vérifier si deux utilisateurs sont amis
const areFriends = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.iduser;

    if (parseInt(userId) === currentUserId) {
      return next(); // L'utilisateur peut accéder à son propre profil
    }

    const friendship = await Friends.findOne({
      where: {
        status: "accepter",
        [Op.or]: [
          { requesterId: currentUserId, addresseeId: userId },
          { requesterId: userId, addresseeId: currentUserId },
        ],
      },
    });

    if (!friendship) {
      return res.status(403).json({
        message: "Accès refusé : vous devez être amis avec cet utilisateur",
      });
    }

    req.friendship = friendship;
    next();
  } catch (error) {
    console.error("areFriends middleware error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la vérification de l'amitié" });
  }
};

// Vérifier si une demande d'ami existe déjà
const checkFriendRequestExists = async (req, res, next) => {
  try {
    const { addresseeId } = req.body;
    const requesterId = req.user.iduser;

    const existingRequest = await Friends.findOne({
      where: {
        [Op.or]: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "Une demande d'ami existe déjà entre ces utilisateurs",
        status: existingRequest.status,
      });
    }

    next();
  } catch (error) {
    console.error("checkFriendRequestExists error:", error);
    return res.status(500).json({ message: "Erreur lors de la vérification" });
  }
};

// Vérifier si l'utilisateur est propriétaire de la demande d'ami
const isFriendRequestOwner = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.iduser;

    const friendRequest = await Friends.findByPk(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Demande d'ami non trouvée" });
    }

    // Vérifier si l'utilisateur est le demandeur ou le destinataire
    if (
      friendRequest.requesterId !== userId &&
      friendRequest.addresseeId !== userId
    ) {
      return res.status(403).json({
        message: "Accès refusé : vous n'êtes pas concerné par cette demande",
      });
    }

    req.friendRequest = friendRequest;
    next();
  } catch (error) {
    console.error("isFriendRequestOwner error:", error);
    return res.status(500).json({ message: "Erreur lors de la vérification" });
  }
};

module.exports = {
  areFriends,
  checkFriendRequestExists,
  isFriendRequestOwner,
};
