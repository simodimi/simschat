const sequelize = require("../config/database");
const User = require("./User");
const { DataTypes } = require("sequelize");

const Friends = sequelize.define(
  "Friends",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    requesterId: { type: DataTypes.INTEGER, allowNull: false },
    addresseeId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("attente", "accepter", "refuser"),
      defaultValue: "attente",
    },
    acceptedAt: { type: DataTypes.DATE, allowNull: true },
    rejectedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    indexes: [
      // Empêche les doublons (même demande répétée)
      { unique: true, fields: ["requesterId", "addresseeId"] },
      { fields: ["status"] },
    ],
  }
);
Friends.belongsTo(User, { foreignKey: "requesterId", as: "requester" });
Friends.belongsTo(User, { foreignKey: "addresseeId", as: "addressee" });

// Ajouter des hooks après la définition du modèle
Friends.afterCreate(async (friendship, options) => {
  // Log ou autres actions après création
});

Friends.afterUpdate(async (friendship, options) => {
  if (friendship.changed("status")) {
    // Émettre un événement socket pour synchronisation
    if (global.io) {
      global.io
        .to(`user_${friendship.requesterId}`)
        .to(`user_${friendship.addresseeId}`)
        .emit("friendship_updated", {
          friendshipId: friendship.id,
          status: friendship.status,
        });
    }
  }
});

Friends.afterDestroy(async (friendship, options) => {
  // Notifier les deux parties
  if (global.io) {
    global.io
      .to(`user_${friendship.requesterId}`)
      .to(`user_${friendship.addresseeId}`)
      .emit("friendship_removed", {
        friendId:
          friendship.requesterId === options.userId
            ? friendship.addresseeId
            : friendship.requesterId,
      });
  }
});
module.exports = Friends;
