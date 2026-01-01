const { Op } = require("sequelize");
const Status = require("../models/Status");
const StatusItem = require("../models/StatusItem");
const User = require("../models/User");

// Créer un status (story)
const createStatus = async (req, res) => {
  try {
    const { expiresAt, items } = req.body;

    if (!expiresAt || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "expiresAt et items sont obligatoires",
      });
    }

    const status = await Status.create({
      userId: req.user.iduser,
      expiresAt,
      isPublished: true,
    });

    for (let i = 0; i < items.length; i++) {
      await StatusItem.create({
        ...items[i],
        statusId: status.id,
        order: i,
      });
    }

    return res.status(201).json({
      message: "Status créé avec succès",
      statusId: status.id,
    });
  } catch (error) {
    console.error("createStatus error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création du status" });
  }
};

// Récupérer les status actifs (non expirés)
const getActiveStatuses = async (req, res) => {
  try {
    const now = new Date();

    const statuses = await Status.findAll({
      where: {
        isPublished: true,
        expiresAt: { [Op.gt]: now },
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
};

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
