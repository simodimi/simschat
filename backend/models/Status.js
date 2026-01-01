const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Status = sequelize.define(
  "Status",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ["userId"] }, { fields: ["expiresAt"] }],
  }
);
module.exports = Status;
