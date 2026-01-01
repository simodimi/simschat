const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const StatusItem = sequelize.define(
  "StatusItem",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

    statusId: { type: DataTypes.BIGINT, allowNull: false },

    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    type: {
      type: DataTypes.ENUM("text", "background", "image", "media"),
      allowNull: false,
    },

    // contenu texte
    text: { type: DataTypes.TEXT, allowNull: true },

    // style texte/background (couleur + image background)
    color: { type: DataTypes.STRING(30), allowNull: true },
    backgroundUrl: { type: DataTypes.STRING(800), allowNull: true },

    // image/media
    mediaUrl: { type: DataTypes.STRING(800), allowNull: true },
    mediaType: { type: DataTypes.STRING(120), allowNull: true }, // video/* audio/* image/* ...

    // durée/segment (audio/vidéo start/end)
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: { min: 5, max: 30 },
    },
    startTime: { type: DataTypes.FLOAT, allowNull: true },
    endTime: { type: DataTypes.FLOAT, allowNull: true },
  },
  {
    indexes: [{ fields: ["statusId"] }, { fields: ["statusId", "order"] }],
  }
);

module.exports = StatusItem;
