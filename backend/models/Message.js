const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    replyToId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    MessageType: {
      type: DataTypes.ENUM("text", "image", "video", "audio", "file", "pdf"),
      defaultValue: "text",
    },
    fileUrl: {
      type: DataTypes.STRING(800),
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fileType: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      { fields: ["senderId", "receiverId"] },
      { fields: ["createdAt"] },
      { fields: ["replyToId"] },
    ],
  }
);
module.exports = Message;
