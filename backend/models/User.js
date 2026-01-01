const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  iduser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  useremail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  userpassword: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  userphoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_inscription: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  statut: {
    type: DataTypes.ENUM("En ligne", "Hors ligne"),
    defaultValue: "Hors ligne",
  },
  background_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  validationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
module.exports = User;
