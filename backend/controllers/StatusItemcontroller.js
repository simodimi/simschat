const StatusItem = require("../models/StatusItem");
const Status = require("../models/Status");

// Ajouter un item à un status existant
const addStatusItem = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = await Status.findOne({
      where: { id: statusId, userId: req.user.iduser },
    });

    if (!status) {
      return res.status(404).json({
        message: "Status introuvable ou vous n'êtes pas le propriétaire",
      });
    }

    const item = await StatusItem.create({
      ...req.body,
      statusId,
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error("addStatusItem error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de l'item" });
  }
};

// Modifier un item
const updateStatusItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await StatusItem.findByPk(itemId, {
      include: { model: Status, as: "status" },
    });

    if (!item || item.status.userId !== req.user.iduser) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await item.update(req.body);
    return res.status(200).json(item);
  } catch (error) {
    console.error("updateStatusItem error:", error);
    return res.status(500).json({ message: "Erreur de mise à jour" });
  }
};

// Supprimer un item
const deleteStatusItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await StatusItem.findByPk(itemId, {
      include: { model: Status, as: "status" },
    });

    if (!item || item.status.userId !== req.user.iduser) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await item.destroy();
    return res.status(200).json({ message: "Item supprimé avec succès" });
  } catch (error) {
    console.error("deleteStatusItem error:", error);
    return res.status(500).json({ message: "Erreur de suppression" });
  }
};

module.exports = {
  addStatusItem,
  updateStatusItem,
  deleteStatusItem,
};
