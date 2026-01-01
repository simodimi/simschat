const db = require("./config/database");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const http = require("http"); //serveur de node
const app = express(); //contenir les routes
const server = http.createServer(app); //création du serveur

// Configuration Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// CORS (important: withCredentials côté frontend)
const CLIENT_ORIGIN = "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // permet d'envoyer/recevoir cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
// Sécurité: headers HTTP sûrs
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//routes
const userRoute = require("./routes/UserRoute");
const statusRoute = require("./routes/StatusRoute");
const statusItemRoute = require("./routes/StatusItemRoute");
const statusViewRoute = require("./routes/StatusViewRoute");
const messageRoute = require("./routes/MessageRoute");
const friendRoute = require("./routes/FriendsRoute");

//middleware
const { verifyToken } = require("./middleware/auth");
const { uploadStatusMedia } = require("./middleware/upload");
const { messageLimiter } = require("./middleware/rateLimit");
const { friendRequestLimiter } = require("./middleware/rateLimit");

//routes
app.use("/user", userRoute);
app.use("/status", verifyToken, statusRoute);
app.use("/status-item", verifyToken, uploadStatusMedia, statusItemRoute);
app.use("/status-item-view", verifyToken, statusViewRoute);
app.use("/message", verifyToken, messageLimiter, messageRoute);
app.use("/friends", verifyToken, friendRequestLimiter, friendRoute);

io.on("connection", (socket) => {
  // Déconnexion du client
  socket.on("disconnect", () => {
    // Tu peux mettre ici du code à exécuter quand un client se déconnecte
    // Exemple : retirer l’utilisateur d’une liste en mémoire, mettre à jour un statut, etc.
  });

  /* // Gestion activation/désactivation produits
  socket.on("join_products", () => {
    socket.join("products_room");
  });

  socket.on("leave_products", () => {
    socket.leave("products_room");
  });*/

  // Messages utilisateurs
  socket.on("join_messages_room", () => socket.join("messages_room"));
  socket.on("leave_messages_room", () => socket.leave("messages_room"));

  /* // Gestion des commandes
  socket.on("join_orders_room", () => socket.join("orders_room"));
  socket.on("leave_orders_room", () => socket.leave("orders_room"));*/
});
//lancons le serveur
db.sync({ alter: true })
  .then(() => {
    server.listen(process.env.SERVER_PORT, () => {
      console.log(`serveur lancé sur le port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
