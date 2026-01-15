const db = require("./config/database");
const express = require("express");
require("dotenv").config();
const cors = require("cors"); //autorisation des requêtes
const helmet = require("helmet"); //protection de sécurité des headers HTTP
const cookieParser = require("cookie-parser"); //lire les cookies
const { Server } = require("socket.io"); //temps réel
const http = require("http");
const app = express();
const server = http.createServer(app); //créer le serveur HTTP
const path = require("path");
require("./models/Unit");
const fs = require("fs");

// Configuration CORS
//definir l'adresse frontend autorisé à parler au backend
const CLIENT_ORIGIN = "http://localhost:5173";
const corsOptions = {
  origin: CLIENT_ORIGIN,
  credentials: true, //autoriser les cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //autoriser certains headers
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Appliquercette configuration CORS à toutes les requêtes entrantes
app.use(cors(corsOptions));

// Sécurité: headers HTTP sûrs
app.use(
  helmet({
    //desactiver certaines restrictions pour permettre
    crossOriginResourcePolicy: false, //chargement des images
    crossOriginEmbedderPolicy: false, //fichiers média
  })
);
//permet de lire les données envoyées via formulaire html
app.use(express.urlencoded({ extended: true }));
//permet de lire les données envoyées en json
app.use(express.json());
//permet de lire les cookies
app.use(cookieParser());

// autoriser le frontend à se connecter en temps réel via socket.io
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Créer un middleware CORS spécifique pour les uploads
const staticCors = (req, res, next) => {
  //j'autorise le frontend à accéder aux fichiers statiques
  res.header("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  //autoriser l'envoie des cookies
  res.header("Access-Control-Allow-Credentials", "true");
  //autorise la lecture des fichiers
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // si le navigateur demande une autorisation préalable ,je réponds ok
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
};

// Je rends le dossier uploads accessible via HTTP avec CORS.
app.use(
  "/uploads",
  staticCors,
  express.static(path.join(__dirname, "uploads"))
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
app.use("/friends", friendRoute);
//Je renvoie au frontend la liste des IDs des utilisateurs en ligne.
app.get("/online-users", verifyToken, (req, res) => {
  res.json([...onlineUsers.keys()]);
});

const onlineUsers = new Map(); // userId => socketId
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers.set(userId, socket.id);

    // notifier tout le monde
    io.emit("user_online", userId);
  }
  socket.on("get_online_users", () => {
    socket.emit("online_users", [...onlineUsers.keys()]);
  });

  socket.on("disconnect", () => {
    for (const [id, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(id);

        // notifier tout le monde
        io.emit("user_offline", id);
        break;
      }
    }
  });

  socket.on("join_friends_room", () => socket.join("friends_room"));
  socket.on("leave_friends_room", () => socket.leave("friends_room"));

  socket.on("join_user_room", (userId) => {
    if (!userId) return;
    socket.join(`user_${userId}`);
    console.log(`Utilisateur ${userId} rejoint room user_${userId}`);
  });
});

//exporter io pour l'utiliser dans les controllers
global.io = io;

//lancons le serveur
db.sync() /*{ alter: true }*/
  .then(() => {
    server.listen(process.env.SERVER_PORT || 5000, () => {
      console.log(
        `serveur lancé sur le port ${process.env.SERVER_PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
