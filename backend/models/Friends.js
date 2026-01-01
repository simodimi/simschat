const sequelize = require("../config/database");
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
  },
  {
    indexes: [
      // Empêche les doublons (même demande répétée)
      { unique: true, fields: ["requesterId", "addresseeId"] },
      { fields: ["status"] },
    ],
  }
);
module.exports = Friends;
