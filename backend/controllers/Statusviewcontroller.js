const StatusView = require("../models/StatusView");
const StatusItem = require("../models/StatusItem");
const Status = require("../models/Status");

// Marquer un item comme vu
const viewStatusItem = async (req, res) => {
  try {
    const { statusItemId } = req.params;
    const viewerId = req.user.iduser;

    const item = await StatusItem.findByPk(statusItemId);
    if (!item) {
      return res.status(404).json({ message: "Item introuvable" });
    }

    const [view, created] = await StatusView.findOrCreate({
      where: {
        viewerId,
        statusItemId,
      },
    });
    const statusItem = await StatusItem.findByPk(statusItemId, {
      include: {
        model: Status,
        as: "status",
      },
    });

    global.io.to(`user_${statusItem.status.userId}`).emit("status:viewed", {
      statusItemId,
      viewerId,
    });

    return res.status(200).json({
      message: created ? "Vue enregistrée" : "Déjà vu",
    });
  } catch (error) {
    console.error("viewStatusItem error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'enregistrement de la vue" });
  }
};

// Récupérer les vues d'un item (propriétaire seulement)
const getItemViews = async (req, res) => {
  try {
    const { statusItemId } = req.params;

    const views = await StatusView.findAll({
      where: { statusItemId },
      include: {
        model: require("../models/User"),
        as: "viewer",
        attributes: ["iduser", "username", "userphoto"],
      },
    });

    return res.status(200).json(views);
  } catch (error) {
    console.error("getItemViews error:", error);
    return res.status(500).json({ message: "Erreur de récupération des vues" });
  }
};

module.exports = {
  viewStatusItem,
  getItemViews,
};
