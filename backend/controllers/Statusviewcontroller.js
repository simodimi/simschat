const StatusView = require("../models/StatusView");
const StatusItem = require("../models/StatusItem");

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
