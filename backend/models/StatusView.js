const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const StatusView = sequelize.define(
  "StatusView",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    viewerId: { type: DataTypes.INTEGER, allowNull: false },
    statusItemId: { type: DataTypes.BIGINT, allowNull: false },
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      { unique: true, fields: ["viewerId", "statusItemId"] }, // une vue par item
    ],
  }
);

module.exports = StatusView;
