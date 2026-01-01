const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  const senderId = req.user.iduser;
  const { receiverId, content } = req.body;

  const message = await Message.create({
    senderId,
    receiverId,
    content,
    fileUrl: req.file ? req.file.path : null,
  });

  res.status(201).json(message);
};

const getConversation = async (req, res) => {
  const userId = req.user.iduser;
  const { otherUserId } = req.params;

  const messages = await Message.findAll({
    where: {
      [require("sequelize").Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    order: [["createdAt", "ASC"]],
  });

  res.json(messages);
};

module.exports = { sendMessage, getConversation };
