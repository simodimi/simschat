const Friends = require("../models/Friends");
const User = require("../models/User");

// Envoyer une demande d'ami
const sendFriendRequest = async (req, res) => {
  const requesterId = req.user.iduser;
  const { addresseeId } = req.body;

  const request = await Friends.create({ requesterId, addresseeId });
  res.status(201).json(request);
};

// Accepter / refuser
const respondToRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await Friends.findByPk(requestId);
  if (!request) return res.status(404).json({ message: "Demande introuvable" });

  request.status = status;
  request.acceptedAt = status === "accepter" ? new Date() : null;
  await request.save();

  res.json(request);
};

// Liste des amis
const getFriends = async (req, res) => {
  const userId = req.user.iduser;

  const friends = await Friends.findAll({
    where: {
      status: "accepter",
      [require("sequelize").Op.or]: [
        { requesterId: userId },
        { addresseeId: userId },
      ],
    },
  });

  res.json(friends);
};

module.exports = {
  sendFriendRequest,
  respondToRequest,
  getFriends,
};
