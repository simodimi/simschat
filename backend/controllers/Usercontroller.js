const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mailjet = require("node-mailjet");
const crypto = require("crypto");

//génére un token jwt
const generateToken = (user) => {
  return jwt.sign(
    {
      iduser: user.iduser,
      useremail: user.useremail,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );
};
//utilitaire pour l'envoi des mails
const mailjet = new Mailjet({
  apiKey: process.env.EMAIL_USER,
  apiSecret: process.env.EMAIL_PASSWORD,
});
//créer un user
const createUser = async (req, res) => {
  try {
    const { username, useremail, userpassword, userconfirmpassword } = req.body;
    //generer une url complete pour l'image
    const userphoto = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;
    if (!username || !useremail || !userpassword || !userconfirmpassword) {
      return res
        .status(400)
        .json({ message: "tous les champs sont obligatoires" });
    }
    //verifions si le mot de passe et la confirmation sont identiques
    if (userpassword !== userconfirmpassword) {
      return res
        .status(400)
        .json({ message: "les mots de passe ne correspondent pas" });
    }
    //verifions si l'utilisateur existe deja
    const user = await User.findOne({ where: { useremail } });
    if (user) {
      return res.status(400).json({ message: "l'utilisateur existe deja" });
    }
    //generer un token de confirmation
    const token = crypto.randomBytes(32).toString("hex");
    //hashage du mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(userpassword, salt);
    //créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      useremail,
      userphoto,
      userpassword: hashedPassword,
      userphoto,
      validationToken: token,
      isActive: false, //le compte n'est actif qu'après la confirmation par mail
    });
    //envoi de l'email de confirmation
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: "simodimitri08@gmail.com", Name: "Sim'sChat" },
          To: [{ Email: newUser.useremail, Name: newUser.username }],
          Subject: "Compte crée avec succès",
          HTMLPart: `
           <div style="text-align: center;">
              <h1 style="margin-bottom: 10px;">Sim'sChat</h1>
              <img src="http://localhost:5000/public/logochat.png" alt="Logo" style="width: 120px; height: 90px;" />
              </div>
              
          <p>Bonjour ${newUser.username}, votre compte a été crée avec succès.</p>
          <p>Veuillez confirmer votre compte en cliquant sur le lien suivant : <a href="http://localhost:3000/confirmation/${newUser.validationToken}">Confirmer mon compte</a></p>
          <p> à bientot sur Sim'sChat !</p>
          `,
        },
      ],
    });
    //renvoyer les données de l'user
    return res.status(201).json({
      iduser: newUser.iduser,
      username: newUser.username,
      useremail: newUser.useremail,
      userphoto: newUser.userphoto,
    });
  } catch (error) {
    console.error("erreur lors de la création de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
//conexion utilisateur
const loginUser = async (req, res) => {
  try {
    const { useremail, userpassword } = req.body;
    if (!username || !userpassword) {
      return res
        .status(400)
        .json({ message: "tous les champs sont obligatoires" });
    }
    //verifions si l'utilisateur existe
    const user = await User.findOne({ where: { useremail } });
    if (!user) {
      return res.status(404).json({ message: "l'utilisateur n'existe pas" });
    }
    // Vérifier si le compte est validé
    if (!user.isActive) {
      return res.status(403).json({
        message: "Compte non validé. Veuillez vérifier vos emails.",
      });
    }
    //verifions si le mot de passe est correct
    const passwordmatch = await bcrypt.compare(userpassword, user.userpassword);
    if (!passwordmatch) {
      return res.status(401).json({ message: "mot de passe incorrect" });
    }
    const token = generateToken(user);
    // Cookie options : secure en production, httpOnly, sameSite Strict
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en prod (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 5 * 60 * 60 * 1000, // 5h
    };
    res.cookie("token", token, cookieOptions);
    //renvoyer les données de l'utilisateur
    return res.status(200).json({
      iduser: user.iduser,
      username: user.username,
      useremail: user.useremail,
    });
  } catch (error) {
    console.error("erreur lors de la connexion de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
//validation de compte
const validateUserByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { validationToken: token } });
    if (!user) {
      return res.status(404).json({ message: "l'utilisateur n'existe pas" });
    }
    user.validationToken = null;
    user.isActive = true;
    await user.save();
    return res.status(200).json({ message: "compte validé avec succès" });
  } catch (error) {
    console.error("erreur lors de la validation de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
//supprimer un user
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { iduser: req.params.iduser },
    });
    if (deleted) {
      return res
        .status(200)
        .json({ message: "utilisateur supprimé avec succès" });
    } else {
      return res.status(404).json({ message: "utilisateur n'existe pas" });
    }
  } catch (error) {
    console.error("erreur lors de la suppression de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
//recuperer tous les user
const getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: { exclude: ["userpassword"] },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error("erreur lors de la recuperation de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
//recuperer un user
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.iduser, {
      attributes: { exclude: ["userpassword"] },
    });
    if (!user) {
      user;
      return res.status(404).json({ message: "l'utilisateur n'existe pas" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("erreur lors de la recuperation de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
//mis à jour d'un user
const updateUser = async (req, res) => {
  try {
    const { username, userpassword, useremail, userphoto } = req.body;
    const updateData = { username, userpassword, useremail, userphoto };
    //si nouveau mot de passe
    if (userpassword) {
      const hash = await bcrypt.hash(userpassword, 12);
      updateData.userpassword = hash;
    }
    const [updated] = await User.update(updateData, {
      where: { iduser: req.params.iduser },
    });
    if (updated > 0) {
      return res
        .status(200)
        .json({ message: "utilisateur mis à jour avec succès" });
    } else {
      return res.status(404).json({ message: "utilisateur n'existe pas" });
    }
  } catch (error) {
    console.error("erreur lors de la mise à jour de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const checkTokenValidity = async (req, res) => {
  try {
    // Ici verifyToken a déjà été exécuté (middleware), et req.admin est present
    const user = await User.findByPk(req.user.iduser, {
      attributes: ["iduser", "username", "useremail"],
    });
    if (!user) {
      return res
        .status(401)
        .json({ valid: false, message: "Utilisateur introuvable" });
    }
    // Token valide
    return res.status(200).json({
      valid: true,
      user: {
        iduser: user.iduser,
        username: user.username,
        useremail: user.useremail,
      },
    });
  } catch (error) {
    console.error("checkTokenValidity error:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Erreur de vérification" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { useremail } = req.body;
    if (!useremail) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir le champ email" });
    }
    const user = await User.findOne({ where: { useremail } });
    if (!user) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
    //return res.status(200).json();
    const code = generateVerificationCode();
    //stockage du code temporairement
    verificationCodes.set(useremail, { code, timestamp: Date.now() });
    //nettoyer les codes temporairements expirés
    cleanExpiredCodes();
    // Envoyer l’email
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: "simodimitri08@gmail.com", Name: "Sim'schat" },
          To: [{ Email: user.useremail, Name: user.username }],
          Subject: "Code de vérification - Réinitialisation de mot de passe",
          HTMLPart: `
            <div style="text-align: center;">
              <h1>Sim'schat</h1>
              <p>Bonjour ${user.username},</p>
              <p>Voici votre code de vérification :</p>
              <h2>${code}</h2>
              <p>Ce code expirera dans 5 minutes.</p>
              <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
            </div>
          `,
        },
      ],
    });

    return res
      .status(200)
      .json({ message: "Code de vérification envoyé par email" });
  } catch (error) {
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString().padStart(6, "0");
};
//stockage temporaire du code
const verificationCodes = new Map();
// Fonction pour nettoyer les codes expirés
const cleanExpiredCodes = () => {
  const now = Date.now();
  for (const [useremail, data] of verificationCodes.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      // 5 minutes
      verificationCodes.delete(useremail);
    }
  }
};
// --- Vérification du code ---
const verifyCode = async (req, res) => {
  try {
    const { useremail, code } = req.body;
    const entry = verificationCodes.get(useremail);

    if (!entry) {
      return res
        .status(400)
        .json({ message: "Aucun code trouvé pour cet email ou expiré" });
    }

    if (Date.now() - entry.timestamp > 5 * 60 * 1000) {
      verificationCodes.delete(useremail);
      return res.status(400).json({ message: "Code expiré" });
    }

    if (entry.code !== code) {
      return res.status(400).json({ message: "Code invalide" });
    }

    // on le supprime pour éviter la réutilisation
    verificationCodes.delete(useremail);

    return res.status(200).json({ message: "Code vérifié avec succès" });
  } catch (error) {
    console.error("Erreur verifyCode:", error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { useremail, userpassword } = req.body;

    // Vérifier les champs
    if (!useremail || !userpassword) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { useremail } });
    if (!user) {
      return res.status(404).json();
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(userpassword, 10);

    // Mettre à jour le mot de passe
    user.userpassword = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    return res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la mise à jour" });
  }
};
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Déconnexion réussie" });
};

module.exports = {
  loginUser,
  logoutUser,
  getUser,
  verifyCode,
  resetPassword,
  cleanExpiredCodes,
  forgotPassword,
  checkTokenValidity,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
  validateUserByToken,
};
