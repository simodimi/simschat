const User = require("./User");
const Status = require("./Status");
const Friends = require("./Friends");
const Message = require("./Message");
const StatusView = require("./StatusView");
const StatusItem = require("./StatusItem");
const sequelize = require("../config/database");

//  Messages
//un utilisateur peut envoyer plusieurs messages
User.hasMany(Message, {
  foreignKey: { name: "senderId", allowNull: false },
  as: "sentMessages", //alias pour les requetes
  onDelete: "CASCADE",
});
//un utilisateur peut recevoir plusieurs messages
User.hasMany(Message, {
  foreignKey: { name: "receiverId", allowNull: false },
  as: "receivedMessages",
  onDelete: "CASCADE",
});
//chaque message appartient a un utilisateur(expediteur ou destinataire)
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

Message.belongsTo(Message, {
  foreignKey: "replyToId",
  as: "replyTo",
  onDelete: "SET NULL",
});
//un message peut avoir plusieurs replies
Message.hasMany(Message, {
  foreignKey: "replyToId",
  as: "replies",
  onDelete: "SET NULL",
});

Message.belongsTo(User, {
  foreignKey: "deletedById",
  as: "deletedBy",
  onDelete: "SET NULL",
});

// Status
User.hasMany(Status, {
  foreignKey: { name: "userId", allowNull: false },
  as: "statuses",
  onDelete: "CASCADE",
});
Status.belongsTo(User, { foreignKey: "userId", as: "user" });

Status.hasMany(StatusItem, {
  foreignKey: { name: "statusId", allowNull: false },
  as: "items",
  onDelete: "CASCADE",
});
StatusItem.belongsTo(Status, { foreignKey: "statusId", as: "status" });

// Views
User.hasMany(StatusView, {
  foreignKey: { name: "viewerId", allowNull: false },
  as: "statusViews",
  onDelete: "CASCADE",
});
StatusView.belongsTo(User, { foreignKey: "viewerId", as: "viewer" });

StatusItem.hasMany(StatusView, {
  foreignKey: { name: "statusItemId", allowNull: false },
  as: "views",
  onDelete: "CASCADE",
});
StatusView.belongsTo(StatusItem, {
  foreignKey: "statusItemId",
  as: "statusItem",
});
const models = {
  User,
  Status,
  Friends,
  Message,
  StatusView,
  StatusItem,
};
module.exports = { sequelize, models };
