const Message = require("../models/Message");
const path = require("path");
const User = require("../models/User");
const fs = require("fs");
const { Op } = require("sequelize");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.iduser;
    const { receiverId, content, replyToId } = req.body;

    // Déterminer le type de message
    let messageType = "text";
    let fileName = null;
    let fileSize = null;
    let fileType = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      fileName = req.file.filename;
      fileSize = req.file.size;
      fileType = req.file.mimetype;

      // Déterminer le type de message basé sur le type de fichier
      if (req.file.mimetype.startsWith("image/")) {
        messageType = "image";
      } else if (req.file.mimetype.startsWith("video/")) {
        messageType = "video";
      } else if (req.file.mimetype.startsWith("audio/")) {
        messageType = "audio";
      } else if (req.file.mimetype === "application/pdf") {
        messageType = "pdf";
      } else {
        messageType = "file";
      }
    }

    const message = await Message.create({
      senderId: req.user.iduser,
      receiverId: req.body.receiverId,
      content: req.body.content,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName,
      fileSize,
      fileType,
      messageType: messageType,
      replyToId: req.body.replyToId || null,
    });

    // Récupérer le message complet avec les relations
    const messageWithRelations = await Message.findByPk(message.id, {
      include: [
        {
          model: require("../models/User"),
          as: "sender",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: require("../models/User"),
          as: "receiver",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: Message,
          as: "replyTo",
          include: [
            {
              model: require("../models/User"),
              as: "sender",
              attributes: ["iduser", "username", "userphoto"],
            },
          ],
        },
      ],
    });

    // Émettre le message via Socket.io
    global.io
      .to(`user_${receiverId}`)
      .emit("new_message", messageWithRelations);
    global.io.to(`user_${senderId}`).emit("new_message", messageWithRelations);

    res.status(201).json(messageWithRelations);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

/*const getConversation = async (req, res) => {
  try {
    const userId = req.user.iduser;
    const otherUserId = parseInt(req.params.id, 10);

    if (!otherUserId) {
      return res.status(400).json({
        message: "ID utilisateur invalide",
      });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
        isDeleted: false,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: Message,
          as: "replyTo",
          required: false,
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["iduser", "username", "userphoto"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération conversation" });
  }
};*/
const getConversation = async (req, res) => {
  try {
    const userId = req.user.iduser;
    const otherUserId = parseInt(req.params.otherUserId, 10);

    if (isNaN(otherUserId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
        {
          model: Message,
          as: "replyTo",
          required: false,
          include: [{ model: User, as: "sender" }],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération conversation" });
  }
};

// Nouvelle fonction pour marquer un message comme supprimé
/*const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.iduser;
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    // Vérifier si l'utilisateur a le droit de supprimer le message
    if (message.senderId !== userId && message.receiverId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Marquer le message comme supprimé
    await message.update({
      isDeleted: true,
      deletedById: userId,
      content: "message supprimé",
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileType: null,
    });

    // Émettre la mise à jour via Socket.io
    global.io.to(`user_${message.senderId}`).emit("message_deleted", messageId);
    global.io
      .to(`user_${message.receiverId}`)
      .emit("message_deleted", messageId);

    res.json({ message: "Message supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du message" });
  }
};*/
const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.iduser;
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: Message,
          as: "replyTo",
          required: false,
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["iduser", "username", "userphoto"],
            },
          ],
        },
      ],
    });

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    // Vérifier si l'utilisateur a le droit de supprimer le message
    if (message.senderId !== userId && message.receiverId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Sauvegarder les données originales avant suppression
    const originalMessage = { ...message.toJSON() };

    // Marquer le message comme supprimé
    await message.update({
      isDeleted: true,
      deletedById: userId,
      content: "message supprimé",
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileType: null,
    });

    // Récupérer le message mis à jour avec toutes les relations
    const updatedMessage = await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["iduser", "username", "userphoto"],
        },
        {
          model: Message,
          as: "replyTo",
          required: false,
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["iduser", "username", "userphoto"],
            },
          ],
        },
      ],
    });

    // Émettre le message COMPLET mis à jour
    global.io
      .to(`user_${originalMessage.senderId}`)
      .emit("message_deleted", updatedMessage);
    global.io
      .to(`user_${originalMessage.receiverId}`)
      .emit("message_deleted", updatedMessage);

    res.json({ message: "Message supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du message" });
  }
};
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.iduser;

    const unread = await Message.findAll({
      where: {
        receiverId: userId,
        isRead: false,
      },
      attributes: ["senderId"],
    });

    // Grouper par senderId
    const counts = {};
    unread.forEach((msg) => {
      counts[msg.senderId] = (counts[msg.senderId] || 0) + 1;
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: "Erreur unread count" });
  }
};
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.iduser; // receveur (celui qui lit)
    const senderId = parseInt(req.params.senderId, 10);

    if (isNaN(senderId)) {
      return res.status(400).json({ message: "senderId invalide" });
    }

    const [updatedCount] = await Message.update(
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        where: {
          senderId,
          receiverId: userId,
          isRead: false,
        },
      }
    );

    // Option socket (facultatif)
    global.io.to(`user_${userId}`).emit("messages_read", { senderId });

    res.json({
      success: true,
      updated: updatedCount,
    });
  } catch (error) {
    console.error("Erreur markAsRead:", error);
    res.status(500).json({ message: "Erreur mark as read" });
  }
};
const getMediaMessages = async (req, res) => {
  try {
    const userId = req.user.iduser;
    const { friendId } = req.params;

    const medias = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        fileUrl: { [Op.ne]: null },
        isDeleted: false,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(medias);
  } catch (e) {
    res.status(500).json({ message: "Erreur récupération médias" });
  }
};
const getLastConversationDate = async (req, res) => {
  try {
    const userId = req.user?.iduser;
    const { friendId } = req.params;

    // 🔐 sécurité
    if (!userId || !friendId) {
      return res.status(400).json({ message: "Paramètres invalides" });
    }

    // 🔍 dernier message entre les deux users
    const lastMessage = await Message.findOne({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        isDeleted: false,
      },
      order: [["createdAt", "DESC"]],
    });

    // 🟡 aucun échange
    if (!lastMessage) {
      return res.json({ formattedDate: null });
    }

    const date = new Date(lastMessage.createdAt);

    res.json({
      formattedDate: {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      },
    });
  } catch (error) {
    console.error("❌ getLastConversationDate error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  deleteMessage,
  getUnreadCount,
  markAsRead,
  getMediaMessages,
  getLastConversationDate,
};
