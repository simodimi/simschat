const Friends = require("../models/Friends");
const User = require("../models/User");
const { Op } = require("sequelize");

/* ============================
   ENVOYER UNE DEMANDE D'AMI
============================ */
const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user.iduser;
    const { addresseeId } = req.body;

    if (!addresseeId) {
      return res.status(400).json({ message: "Destinataire manquant" });
    }

    if (requesterId === addresseeId) {
      return res.status(400).json({ message: "Action impossible" });
    }

    const requester = await User.findByPk(requesterId);
    const addressee = await User.findByPk(addresseeId);

    if (!requester || !addressee) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const existingRequest = await Friends.findOne({
      where: {
        [Op.or]: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existingRequest) {
      if (existingRequest.status === "attente") {
        return res.status(400).json({
          message:
            existingRequest.requesterId === requesterId
              ? "Demande déjà envoyée"
              : "Vous avez déjà reçu une demande de cet utilisateur",
        });
      }

      if (existingRequest.status === "accepter") {
        return res.status(400).json({ message: "Déjà amis" });
      }

      if (existingRequest.status === "refuser") {
        await existingRequest.destroy();
      }
    }

    // 1️⃣ Création
    const request = await Friends.create({
      requesterId,
      addresseeId,
      status: "attente",
    });

    // 2️⃣ Récupération avec user
    const requestWithUser = await Friends.findByPk(request.id, {
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["iduser", "username", "userphoto"],
        },
      ],
    });

    // 3️⃣ Socket ciblé (UI instantanée)
    if (global.io) {
      global.io.to(`user_${addresseeId}`).emit("friend_request_received", {
        requestId: request.id,
        sender: {
          id: requester.iduser,
          name: requester.username,
          image: requester.userphoto,
        },
      });

      // 4️ Sécurité : resync global
      global.io.to(`user_${addresseeId}`).emit("friends_updated");
    }

    res.status(201).json({
      ...requestWithUser.toJSON(),
      message: "Demande d'amitié envoyée",
    });
  } catch (error) {
    console.error("Erreur envoi demande:", error);
    res.status(500).json({
      message:
        error.name === "SequelizeUniqueConstraintError"
          ? "Relation déjà existante"
          : "Erreur serveur",
    });
  }
};

/* ============================
   DEMANDES ENVOYÉES
============================ */
const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.iduser;

    const requests = await Friends.findAll({
      where: { requesterId: userId, status: "attente" },
      include: [
        {
          model: User,
          as: "addressee",
          attributes: ["iduser", "username", "userphoto"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============================
   DEMANDES REÇUES
============================ */
const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.iduser;

    const requests = await Friends.findAll({
      where: { addresseeId: userId, status: "attente" },
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["iduser", "username", "userphoto"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============================
   RÉPONDRE À UNE DEMANDE
============================ */
const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.iduser;

    if (!["accepter", "refuser"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const request = await Friends.findByPk(requestId, {
      include: [
        { model: User, as: "requester" },
        { model: User, as: "addressee" },
      ],
    });

    if (!request) {
      return res.status(404).json({ message: "Demande introuvable" });
    }

    if (request.addresseeId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    if (request.status !== "attente") {
      return res.status(400).json({ message: "Demande déjà traitée" });
    }

    request.status = status;
    if (status === "accepter") {
      request.acceptedAt = new Date();
    } else {
      request.rejectedAt = new Date();
    }

    await request.save();

    // 🔔 SOCKET : Correction Problème 4
    if (global.io) {
      const userData =
        status === "accepter"
          ? {
              id: request.addressee.iduser,
              name: request.addressee.username,
              image: request.addressee.userphoto,
            }
          : null;

      global.io
        .to(`user_${request.requesterId}`)
        .emit("friend_request_responded", {
          responderId: request.addressee.iduser,
          status,
          user: userData,
        });

      // Également notifier les deux parties pour mise à jour en temps réel
      global.io
        .to(`user_${request.requesterId}`)
        .to(`user_${request.addresseeId}`)
        .emit("friends_updated");
    }

    res.json({
      ...request.toJSON(),
      message: status === "accepter" ? "Demande acceptée" : "Demande refusée",
    });
  } catch (error) {
    console.error("Erreur réponse:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============================
   ANNULER UNE DEMANDE
============================ */
const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.iduser;

    const request = await Friends.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ message: "Demande introuvable" });
    }

    if (request.requesterId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    if (request.status !== "attente") {
      return res.status(400).json({ message: "Demande déjà traitée" });
    }

    await request.destroy({ userId });

    // 🔔 SOCKET : Correction Problème 1
    if (global.io) {
      global.io
        .to(`user_${request.addresseeId}`)
        .emit("friend_request_cancelled", {
          requestId: request.id,
        });
    }

    res.json({ message: "Demande annulée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============================
   LISTE DES AMIS
============================ */
const getFriends = async (req, res) => {
  try {
    const userId = req.user.iduser;

    const friendships = await Friends.findAll({
      where: {
        status: "accepter", // Assurez-vous que c'est "accepter" et non "accepter"
        [Op.or]: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: User,
          as: "addressee",
          attributes: ["iduser", "username", "userphoto"],
        },
      ],
    });

    const friends = friendships.map((f) => {
      // Déterminez qui est l'ami (l'autre utilisateur)
      const friend = f.requesterId === userId ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        friend: {
          iduser: friend.iduser,
          username: friend.username,
          userphoto: friend.userphoto,
        },
        since: f.acceptedAt || f.updatedAt,
      };
    });

    res.json(friends);
  } catch (error) {
    console.error("Erreur getFriends:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  sendFriendRequest,
  getSentRequests,
  getReceivedRequests,
  respondToRequest,
  cancelRequest,
  getFriends,
};
