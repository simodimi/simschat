//connexion à la base de données
const { Sequelize } = require("sequelize");
require("dotenv").config();
//variable d'environnement
const DB_Host = process.env.HOST;
const DB_User = process.env.USER;
const DB_Password = process.env.PASSWORD;
const DB_Name = process.env.NAME;
const DB_Port = process.env.PORT;

//creer une nouvelle instance de sequelize
const sequelize = new Sequelize(DB_Name, DB_User, DB_Password, {
  host: DB_Host,
  dialect: "mysql",
  port: DB_Port,
  logging: false,
});
//test de connexion
sequelize
  .authenticate()
  .then(() => {
    console.log("connexion à la basde de données réussie");
  })
  .catch((error) => {
    console.log("erreur de connexion à la base de données", error);
  });

module.exports = sequelize;
