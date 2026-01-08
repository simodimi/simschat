// Créer un status (story)
const { Op } = require("sequelize");
const Status = require("../models/Status");
const StatusItem = require("../models/StatusItem");
const Friends = require("../models/Friends");
const User = require("../models/User");
const createStatus = async (req, res) => {
  try {
    let { expiresAt, items } = req.body;
    const files = req.files || [];
    if (!expiresAt) {
      return res.status(400).json({ message: "expiresAt manquant" });
    }

    if (!items) {
      return res.status(400).json({ message: "items manquant" });
    }
    if (!Array.isArray(items)) {
      items = Object.values(items);
    }

    if (items.length === 0) {
      return res.status(400).json({ message: "Aucun item fourni" });
    }
    const status = await Status.create({
      userId: req.user.iduser,
      expiresAt: new Date(expiresAt),
      isPublished: true,
    });
    let fileIndex = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      let mediaUrl = null;

      // Associer fichier uploadé à l’item
      if (
        (item.type === "media" || item.type === "image") &&
        files[fileIndex]
      ) {
        mediaUrl = `/uploads/${files[fileIndex].filename}`;
        fileIndex++;
      }

      await StatusItem.create({
        statusId: status.id,
        order: i,
        type: item.type,

        // texte / style
        text: item.text || null,
        color: item.color || null,
        backgroundUrl: item.backgroundUrl || null,

        // media
        mediaUrl,
        mediaType: item.mediatype || null,

        // durée / segmentation
        duration: Number(item.duration) || 10,
        startTime: item.startTime !== undefined ? Number(item.startTime) : null,
        endTime: item.endTime !== undefined ? Number(item.endTime) : null,
      });
    }

    const friends = await Friends.findAll({
      where: {
        status: "accepted",
        [Op.or]: [
          { requesterId: req.user.iduser },
          { addresseeId: req.user.iduser },
        ],
      },
    });

    friends.forEach((f) => {
      const friendId =
        f.requesterId === req.user.iduser ? f.addresseeId : f.requesterId;

      global.io.to(`user_${friendId}`).emit("status:new", {
        userId: req.user.iduser,
        statusId: status.id,
        timestamp: new Date().toISOString(),
      });
    });
    return res.status(201).json({
      message: "Status créé avec succès",
      statusId: status.id,
    });
  } catch (error) {
    console.error("❌ createStatus error:", error);
    return res.status(500).json({
      message: "Erreur lors de la création du status",
    });
  }
};

const getActiveStatuses = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user.iduser;

    // 1️⃣ Récupérer les amis ACCEPTÉS (ENUM = "accepter")
    const friends = await Friends.findAll({
      where: {
        status: "accepter", // ✅ CORRECTION ICI
        [Op.or]: [{ requesterId: userId }, { addresseeId: userId }],
      },
    });

    // 2️⃣ Construire la liste des users autorisés
    const allowedUserIds = friends.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // 3️⃣ Ajouter soi-même
    allowedUserIds.push(userId);

    // (optionnel mais recommandé) supprimer les doublons
    const uniqueAllowedUserIds = [...new Set(allowedUserIds)];

    // 4️⃣ Récupérer les statuts visibles
    const statuses = await Status.findAll({
      where: {
        isPublished: true,
        expiresAt: { [Op.gt]: now },
        userId: {
          [Op.in]: uniqueAllowedUserIds,
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: StatusItem,
          as: "items",
          separate: true, // ✅ important pour l'ordre
          order: [["order", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedStatuses = statuses.map((status) => ({
      id: status.id,
      createdAt: status.createdAt,
      expiresAt: status.expiresAt,

      user: {
        iduser: status.user.iduser,
        username: status.user.username,
        userphoto: status.user.userphoto,
      },

      items: status.items.map((i) => ({
        id: i.id,
        type: i.type,

        // 🔥 CHAMPS ATTENDUS PAR LE FRONTEND
        value: i.text,
        color: i.color,
        backgroundUrl: i.backgroundUrl,

        mediaUrl: i.mediaUrl,
        mediatype: i.mediaType,

        time: i.duration,
        startTime: i.startTime,
        endTime: i.endTime,

        order: i.order,
      })),
    }));

    return res.status(200).json(formattedStatuses);
  } catch (error) {
    console.error("getActiveStatuses error:", error);
    return res
      .status(500)
      .json({ message: "Erreur de récupération des status" });
  }
};

/*// Récupérer les status actifs (non expirés)
const getActiveStatuses = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user.iduser;

    // 1️⃣ Récupérer les amis acceptés
    const friends = await Friends.findAll({
      where: {
        status: "accepted",
        [Op.or]: [{ requesterId: userId }, { addresseeId: userId }],
      },
    });

    // 2️⃣ Construire la liste des users autorisés
    const allowedUserIds = friends.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // 3️⃣ IMPORTANT : ajouter soi-même
    allowedUserIds.push(userId);

    // 4️⃣ Récupérer les statuts visibles
    const statuses = await Status.findAll({
      where: {
        isPublished: true,
        expiresAt: { [Op.gt]: now },
        userId: {
          [Op.in]: allowedUserIds,
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: StatusItem,
          as: "items",
          order: [["order", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(statuses);
  } catch (error) {
    console.error("getActiveStatuses error:", error);
    return res
      .status(500)
      .json({ message: "Erreur de récupération des status" });
  }
};*/

// Supprimer un status
const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = await Status.findOne({
      where: {
        id: statusId,
        userId: req.user.iduser,
      },
    });

    if (!status) {
      return res
        .status(404)
        .json({ message: "Status introuvable ou accès refusé" });
    }

    await status.destroy();
    global.io.to(`user_${req.user.iduser}`).emit("status:deleted");
    return res.status(200).json({ message: "Status supprimé avec succès" });
  } catch (error) {
    console.error("deleteStatus error:", error);
    return res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

module.exports = {
  createStatus,
  getActiveStatuses,
  deleteStatus,
};
