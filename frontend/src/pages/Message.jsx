import React, { useEffect, useRef, useState } from "react";
import img from "../assets/ami.png";
import "../styles/message.css";
import img1 from "../assets/im1.png";
import img2 from "../assets/im2.png";
import img3 from "../assets/im3.png";
import img4 from "../assets/im4.png";
import audio from "../assets/audio.png";
import video from "../assets/video.png";
import fichier from "../assets/fichier.png";
import pdf from "../assets/pdf.png";
import save from "../assets/save.jpg";
import image from "../assets/image.png";
import Emojis from "../containers/Emojis.jsx";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "../containers/Button.jsx";
import { useAuth, getSocket } from "../pages/AuthContextUser.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useFriendRequests } from "./FriendRequestContext.jsx";

const Message = ({ choicebk, clickuser }) => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [textsearch, settextsearch] = useState("");
  const [users, setusers] = useState([]);
  const [adduser, setadduser] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [valuesms, setvaluesms] = useState("");
  const [showfulltext, setshowfulltext] = useState(false);
  const [selectedmedia, setSelectedmedia] = useState(null);
  const [messageToReply, setMessageToReply] = useState(null);
  const [selectUser, setselectUser] = useState(null);
  const [selectUserName, setselectUserName] = useState(null);
  const [conversations, setConversations] = useState({});
  const [viewOption, setViewOption] = useState(null);
  const [uploadingMessages, setUploadingMessages] = useState({});
  const [copymedia, setcopymedia] = useState(null);
  const [open10, setOpen10] = useState(false);
  const scrollcopy = useRef({});
  const refhide = useRef(null);
  const ref = useRef(null);
  const refmedia = useRef(null);
  const refpicker = useRef(null);
  const refslider = useRef(null);
  const [showphoto, setshowphoto] = useState(null);
  const { user } = useAuth();
  const { setnumbersms, onlineUsers } = useFriendRequests();

  // Récupérer la conversation actuelle
  const currentMessages = conversations[selectUser] || [];

  // Fonctions utilitaires normalisées
  const getMessageText = (msg) => msg?.content || msg?.fileName || "";
  const isTextMessage = (msg) => msg?.messageType === "text";
  const isFileMessage = (msg) => msg?.messageType !== "text";

  const handlechangeMedia = (e) => {
    refmedia.current.click();
  };

  const handlechangePhoto = (e) => {
    ref.current.click();
  };
  //

  // Formate la date ici aussi
  const formatMessage = (message) => {
    return {
      ...message,
      datesms: new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };
  useEffect(() => {
    const distinctUnreadUsers = Object.values(unreadCounts).filter(
      (count) => count > 0
    ).length;

    setnumbersms(distinctUnreadUsers);
  }, [unreadCounts]);
  useEffect(() => {
    const loadUnreadCounts = async () => {
      const res = await axios.get("http://localhost:5000/message/unread", {
        withCredentials: true,
      });
      setUnreadCounts(res.data);
    };

    loadUnreadCounts();
  }, []);

  // Initialiser Socket.io

  // Charger les amis et leurs conversations
  useEffect(() => {
    if (!user?.iduser) return;

    const loadFriendsAndConversations = async () => {
      try {
        // Charger les amis
        const friendsRes = await axios.get("http://localhost:5000/friends", {
          withCredentials: true,
        });

        const friends = friendsRes.data.map((f) => ({
          id: f.friend.iduser,
          name: f.friend.username,
          image: f.friend.userphoto || img,
        }));

        setadduser(friends);
        setusers(friends);

        // Charger les conversations pour chaque ami
        const conversationsData = {};
        for (const friend of friends) {
          try {
            const messagesRes = await axios.get(
              `http://localhost:5000/message/conversation/${friend.id}`,
              { withCredentials: true }
            );

            conversationsData[friend.id] = messagesRes.data.map((msg) => ({
              ...msg,
              datesms: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));
          } catch (error) {
            console.error(
              `Erreur lors du chargement des messages avec ${friend.name}:`,
              error
            );
            conversationsData[friend.id] = [];
          }
        }

        setConversations(conversationsData);
      } catch (error) {
        console.error("Erreur de chargement des amis", error);
      }
    };

    loadFriendsAndConversations();
    const socket = getSocket();
    if (!socket) return;
    if (socket) {
      socket.on("friends_updated", loadFriendsAndConversations);
    }

    return () => {
      if (socket) {
        socket.off("friends_updated", loadFriendsAndConversations);
      }
    };
  }, [user?.iduser]);

  // Gérer le clic sur un ami depuis la liste d'amis
  useEffect(() => {
    if (clickuser && adduser.length > 0) {
      const found = adduser.find((user) => user.id === clickuser);
      if (found) {
        setselectUser(clickuser);
        setselectUserName(found);

        // Charger la conversation si elle n'est pas déjà chargée
        if (!conversations[clickuser]) {
          loadConversation(clickuser);
        }
      }
    }
  }, [clickuser, adduser]);

  // Charger une conversation spécifique
  const loadConversation = async (userId) => {
    try {
      const messagesRes = await axios.get(
        `http://localhost:5000/message/conversation/${userId}`,
        { withCredentials: true }
      );

      setConversations((prev) => ({
        ...prev,
        [userId]: messagesRes.data.map((msg) => ({
          ...msg,
          datesms: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      }));
    } catch (error) {
      console.error("Erreur lors du chargement de la conversation:", error);
    }
  };

  // Envoyer un message
  const handlesendsms = async () => {
    if (!valuesms.trim() || !selectUser) return;

    try {
      // Envoie le message au serveur
      const formData = new FormData();
      formData.append("receiverId", selectUser);
      formData.append("content", valuesms);

      if (messageToReply) {
        formData.append("replyToId", messageToReply.id);
      }

      const response = await axios.post(
        "http://localhost:5000/message",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setvaluesms("");
      setMessageToReply(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  // Envoyer un fichier
  const handleFileUpload = async (file, isImage = false) => {
    if (!selectUser) return;

    try {
      const formData = new FormData();
      formData.append("receiverId", selectUser);
      formData.append("content", "");
      formData.append("file", file);

      if (messageToReply) {
        formData.append("replyToId", messageToReply.id);
      }

      // Afficher l'indicateur de progression
      const messageId =
        Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      setUploadingMessages((prev) => ({ ...prev, [messageId]: true }));

      const response = await axios.post(
        "http://localhost:5000/message",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadingMessages((prev) => ({ ...prev, [messageId]: false }));
      setMessageToReply(null);
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
    }
  };

  // Gérer l'upload de photo
  const handleupdate = async (e) => {
    if (e.target.name === "picturesmsuser") {
      const file = e.target.files[0];
      if (file) {
        if (file.size <= 20 * 1024 * 1024) {
          // 10MB max
          await handleFileUpload(file, true);
          setshowphoto(URL.createObjectURL(file));
        } else {
          toast.error("Le fichier depasse la taille maximale de 20 Mo");
        }
      }
    }

    if (e.target.name === "mediasms") {
      const files = Array.from(e.target.files);
      for (const file of files) {
        if (file.size <= 50 * 1024 * 1024) {
          // 10MB max
          await handleFileUpload(file, false);
        } else {
          toast.error(
            `Le fichier ${file.name} dépasse la taille maximale de 10 Mo`
          );
        }
      }
    }
  };

  // Supprimer un message
  const handledelete = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/message/${messageId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
      alert("Erreur lors de la suppression du message");
    }
  };

  // Copier/Répondre à un message
  const handlecopy = (message) => {
    setMessageToReply(message);
  };

  const handleupdating = (e) => {
    setvaluesms(e.target.value);
  };

  // Gérer la sélection d'emoji
  const handleEmojiSelect = (emoji) => {
    setvaluesms((prev) => prev + emoji);
  };

  // Gérer l'ouverture/fermeture du sélecteur d'emojis
  const handleicone = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Télécharger un fichier
  const handledownload = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000${fileUrl}`, {
        responseType: "blob",
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setOpen10(false);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      alert("Erreur lors du téléchargement");
    }
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Obtenir l'icône du fichier
  const getFileIcon = (fileType, fileUrl) => {
    if (!fileType && !fileUrl) return null;

    if (fileType?.startsWith("image/")) return image;
    if (fileType?.startsWith("video/")) return video;
    if (fileType?.startsWith("audio/")) return audio;
    if (fileType === "application/pdf") return pdf;

    return fichier;
  };

  // Obtenir le dernier temps de message
  const getLastMessageTime = (userId) => {
    const messages = conversations[userId];
    if (!messages || messages.length === 0) return 0;
    return new Date(messages[messages.length - 1].createdAt).getTime();
  };

  // Recherche d'utilisateurs
  const handlechange = (e) => {
    const value = e.target.value;
    settextsearch(value);

    if (!adduser || adduser.length === 0) return;

    if (value.trim() !== "") {
      const filtered = adduser.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setusers(filtered);
    } else {
      setusers(adduser);
    }
  };

  // Gérer le clic droit sur un message
  const handlerightclick = (id) => {
    setViewOption((prev) => (prev === id ? null : id));
  };

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handlecloseOption = (e) => {
      if (refhide.current && !refhide.current.contains(e.target)) {
        setViewOption(null);
      }
    };

    const handleoutside = (e) => {
      if (refpicker.current && !refpicker.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handlecloseOption);
    document.addEventListener("mousedown", handleoutside);

    return () => {
      document.removeEventListener("mousedown", handlecloseOption);
      document.removeEventListener("mousedown", handleoutside);
    };
  }, []);

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (refslider.current) {
      refslider.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations[selectUser]]);

  const handleselectionUser = (p) => {
    setselectUserName(p);
  };

  const handletoggle = (p) => {
    setselectUser(p);
  };

  // Ouvrir le dialogue de média
  const handleOpenDialog = (message) => {
    setSelectedmedia(message);
    setOpen10(true);
  };

  // Fermer le dialogue de média
  const handleClose = () => {
    setOpen10(false);
    setSelectedmedia(null);
  };

  // Fonction pour gérer le défilement vers un message spécifique
  const handlescrollCopy = (messageId) => {
    if (scrollcopy.current[messageId]) {
      scrollcopy.current[messageId].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="MessageMain">
      <div className="MessageUser">
        <p id="Titlesms">MES MESSAGES</p>
        <div className="filterUser">
          <input
            type="search"
            name=""
            id=""
            value={textsearch}
            placeholder="taper le nom de votre ami(e)..."
            onChange={handlechange}
          />
        </div>

        <div className="UserMain">
          {users && users.length > 0 ? (
            [...users]
              .sort(
                (a, b) => getLastMessageTime(b.id) - getLastMessageTime(a.id)
              )
              .map((p) => {
                const lastMessage =
                  conversations[p.id]?.[conversations[p.id]?.length - 1];
                const messageText = getMessageText(lastMessage);

                return (
                  <div
                    className={`userSelect ${
                      selectUser === p.id ? "active" : ""
                    }`}
                    key={p.id}
                    onClick={async () => {
                      handleselectionUser(p);
                      handletoggle(p.id);

                      // Marquer les messages comme lus UNIQUEMENT si nécessaire
                      if (unreadCounts[p.id] > 0) {
                        try {
                          await axios.put(
                            `http://localhost:5000/message/mark-as-read/${p.id}`,
                            {},
                            { withCredentials: true }
                          );

                          // Reset du compteur côté front
                          setUnreadCounts((prev) => ({
                            ...prev,
                            [p.id]: 0,
                          }));
                        } catch (error) {
                          console.error("Erreur mark-as-read :", error);
                        }
                      }
                    }}
                  >
                    <img src={p.image} alt="" />

                    <div className="userSelectText">
                      <p>{p.name}</p>
                      <span>
                        {!lastMessage
                          ? "Aucun message"
                          : messageText.length > 28
                          ? `${messageText.slice(0, 28)}...`
                          : messageText}
                      </span>
                    </div>

                    {unreadCounts[p.id] > 0 ? (
                      <div className="numbermessage">
                        <span>{unreadCounts[p.id]}</span>
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </div>
                );
              })
          ) : (
            <p style={{ textAlign: "center" }}>Aucun ami pour le moment</p>
          )}
        </div>
      </div>

      {selectUserName ? (
        <div className="MessageWritting">
          {selectUserName && (
            <div className="MessageWrittingHeader">
              <div className="ImageSmsHeader">
                <img src={selectUserName.image} alt="" />
                <span
                  className={
                    onlineUsers[selectUserName.id] ? "online" : "offline"
                  }
                ></span>
              </div>
              <p>{selectUserName.name}</p>
            </div>
          )}

          <div
            className="MessageWrittingContainer"
            style={{
              backgroundImage: choicebk ? `url(${choicebk})` : `none`,
              backgroundColor: choicebk ? "transparent" : "white",
            }}
          >
            {currentMessages.map((p) => {
              const messageText = getMessageText(p);
              const isCurrentUser = p.senderId === user?.iduser;

              return (
                <div className="" key={p.id}>
                  {isCurrentUser ? (
                    // Message de l'utilisateur courant
                    <div className="UserMessage">
                      <div
                        className="UserMessageText"
                        onClick={() => handlerightclick(p.id)}
                      >
                        {p.replyTo && (
                          <div
                            className="UserMessageCopy"
                            onClick={() => handlescrollCopy(p.replyTo.id)}
                          >
                            {/* Affiche "lui" si le message répondu vient de l'autre utilisateur, "vous" si c'est le current user */}
                            <p>
                              {p.replyTo.senderId === user?.iduser
                                ? "vous"
                                : "lui"}
                            </p>

                            {/* Pour les messages texte */}
                            {p.replyTo.messageType === "text" &&
                              p.replyTo.content && (
                                <span>
                                  {p.replyTo.content.length > 50
                                    ? `${p.replyTo.content.slice(0, 50)}...`
                                    : p.replyTo.content}
                                </span>
                              )}

                            {/* Pour les images */}
                            {p.replyTo.fileType?.startsWith("image/") &&
                              p.replyTo.fileUrl && (
                                <img
                                  src={`http://localhost:5000${p.replyTo.fileUrl}`}
                                  alt=""
                                />
                              )}

                            {/* Pour tous les autres fichiers (vidéos, PDF, etc.) */}
                            {p.replyTo.fileUrl &&
                              !p.replyTo.fileType?.startsWith("image/") && (
                                <div className="iconefichier">
                                  <img
                                    src={getFileIcon(
                                      p.replyTo.fileType,
                                      p.replyTo.fileUrl
                                    )}
                                    alt=""
                                  />
                                  <span>
                                    {p.replyTo.fileName?.length > 30
                                      ? `${p.replyTo.fileName.slice(0, 30)}...`
                                      : p.replyTo.fileName}
                                    {p.replyTo.fileSize &&
                                      ` (${formatFileSize(
                                        p.replyTo.fileSize
                                      )})`}
                                  </span>
                                </div>
                              )}
                          </div>
                        )}

                        <div
                          id="textPrincipal"
                          ref={(el) => (scrollcopy.current[p.id] = el)}
                        >
                          {p.fileType?.startsWith("image/") && p.fileUrl && (
                            <div className="image-preview">
                              <img
                                src={`http://localhost:5000${p.fileUrl}`}
                                alt=""
                                id="textprincipalimg"
                              />
                            </div>
                          )}
                          {p.fileUrl && !p.fileType?.startsWith("image/") && (
                            <div
                              className="iconefichier"
                              onClick={() => handleOpenDialog(p)}
                            >
                              <img
                                src={getFileIcon(p.fileType, p.fileUrl)}
                                alt=""
                              />
                              <span>
                                {p.fileName?.length > 35
                                  ? `${p.fileName.slice(0, 35)}...`
                                  : p.fileName}{" "}
                                {p.fileSize ? formatFileSize(p.fileSize) : ""}
                              </span>
                            </div>
                          )}

                          {messageText && p.messageType === "text" && (
                            <>
                              {showfulltext || messageText.length <= 2000
                                ? messageText
                                : messageText.slice(0, 2000)}
                              {messageText.length > 2000 && (
                                <span
                                  id="readmore"
                                  onClick={() => setshowfulltext(!showfulltext)}
                                >
                                  {showfulltext
                                    ? " voir moins"
                                    : " ... lire la suite"}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p id="hoursms">{p.datesms}</p>
                      </div>

                      {viewOption === p.id && (
                        <div className="optionDetailSms" ref={refhide}>
                          <p onClick={() => handlecopy(p)}>répondre message</p>
                          {!p.isDeleted && (
                            <p onClick={() => handledelete(p.id)}>
                              supprimer message
                            </p>
                          )}
                          {p.fileUrl && !p.isDeleted && (
                            <p onClick={() => handleOpenDialog(p)}>
                              voir média
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Message de l'autre utilisateur
                    <div className="UserMessageAway" key={p.id}>
                      <div
                        className="UserMessageAwayText"
                        onClick={() => handlerightclick(p.id)}
                      >
                        {p.replyTo && (
                          <div
                            className="UserMessageCopy"
                            onClick={() => handlescrollCopy(p.replyTo.id)}
                          >
                            {/* Affiche "lui" si le message répondu vient de l'autre utilisateur, "vous" si c'est le current user */}
                            <p>
                              {p.replyTo.senderId === user?.iduser
                                ? "vous"
                                : "lui"}
                            </p>

                            {/* Pour les messages texte */}
                            {p.replyTo.messageType === "text" &&
                              p.replyTo.content && (
                                <span>
                                  {p.replyTo.content.length > 50
                                    ? `${p.replyTo.content.slice(0, 50)}...`
                                    : p.replyTo.content}
                                </span>
                              )}

                            {/* Pour les images */}
                            {p.replyTo.fileType?.startsWith("image/") &&
                              p.replyTo.fileUrl && (
                                <img
                                  src={`http://localhost:5000${p.replyTo.fileUrl}`}
                                  alt=""
                                />
                              )}

                            {/* Pour tous les autres fichiers (vidéos, PDF, etc.) */}
                            {p.replyTo.fileUrl &&
                              !p.replyTo.fileType?.startsWith("image/") && (
                                <div className="iconefichier">
                                  <img
                                    src={getFileIcon(
                                      p.replyTo.fileType,
                                      p.replyTo.fileUrl
                                    )}
                                    alt=""
                                  />
                                  <span>
                                    {p.replyTo.fileName?.length > 30
                                      ? `${p.replyTo.fileName.slice(0, 30)}...`
                                      : p.replyTo.fileName}
                                    {p.replyTo.fileSize &&
                                      ` (${formatFileSize(
                                        p.replyTo.fileSize
                                      )})`}
                                  </span>
                                </div>
                              )}
                          </div>
                        )}

                        <div
                          id="textPrincipal"
                          ref={(el) => (scrollcopy.current[p.id] = el)}
                        >
                          {p.fileType?.startsWith("image/") && p.fileUrl && (
                            <div className="image-preview">
                              <img
                                src={`http://localhost:5000${p.fileUrl}`}
                                alt=""
                                id="textprincipalimg"
                              />
                            </div>
                          )}
                          {p.fileUrl && !p.fileType?.startsWith("image/") && (
                            <div
                              className="iconefichier"
                              onClick={() => handleOpenDialog(p)}
                            >
                              <img
                                src={getFileIcon(p.fileType, p.fileUrl)}
                                alt=""
                              />
                              <span>
                                {p.fileName?.length > 35
                                  ? `${p.fileName.slice(0, 35)}...`
                                  : p.fileName}{" "}
                                {p.fileSize ? formatFileSize(p.fileSize) : ""}
                              </span>
                            </div>
                          )}

                          {messageText && p.messageType === "text" && (
                            <>
                              {showfulltext || messageText.length <= 2000
                                ? messageText
                                : messageText.slice(0, 2000)}
                              {messageText.length > 2000 && (
                                <span
                                  id="readmore"
                                  onClick={() => setshowfulltext(!showfulltext)}
                                >
                                  {showfulltext
                                    ? " voir moins"
                                    : " ... lire la suite"}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p id="hoursms">{p.datesms}</p>
                      </div>

                      {viewOption === p.id && (
                        <div className="optionDetailSms" ref={refhide}>
                          <p onClick={() => handlecopy(p)}>répondre message</p>
                          {!p.isDeleted && (
                            <p onClick={() => handledelete(p.id)}>
                              supprimer message
                            </p>
                          )}
                          {p.fileUrl && !p.isDeleted && (
                            <p onClick={() => handleOpenDialog(p)}>
                              voir média
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="" ref={refslider}></div>
          </div>

          {messageToReply && (
            <div className="ResponseSMS">
              {/* Pour les messages texte */}
              {messageToReply.messageType === "text" &&
                messageToReply.content && (
                  <div className="ResponseSMSText">
                    <p>
                      {getMessageText(messageToReply).length > 80
                        ? getMessageText(messageToReply).slice(0, 80) + "..."
                        : getMessageText(messageToReply)}
                    </p>
                    <button onClick={() => setMessageToReply(null)}>X</button>
                  </div>
                )}

              {/* Pour les fichiers (images, vidéos, PDF, etc.) */}
              {messageToReply.fileUrl && (
                <div className="ResponseSMSImage">
                  <span>
                    {messageToReply.fileName?.length > 20
                      ? messageToReply.fileName.slice(0, 20) + "..."
                      : messageToReply.fileName || "Fichier"}
                  </span>
                  <img
                    src={
                      messageToReply.fileType?.startsWith("image/")
                        ? `http://localhost:5000${messageToReply.fileUrl}` // Pour les images, afficher l'image
                        : getFileIcon(messageToReply.fileType) // Pour les autres, afficher l'icône
                    }
                    alt=""
                  />
                  <button onClick={() => setMessageToReply(null)}>X</button>
                </div>
              )}
            </div>
          )}

          <div className="MessageWrittingHome">
            <div className="MessageWrittingHomeLeft">
              <div className="SiderbarTop" ref={refpicker}>
                <div className="SiderbarTopOption">
                  <div className="iconeemoji">
                    {showEmojiPicker && (
                      <Emojis handleEmojiSelect={handleEmojiSelect} />
                    )}
                  </div>
                  <img src={img1} alt="" onClick={handleicone} />
                </div>
                <p id="texthover">icône</p>
              </div>

              <div className="SiderbarTop">
                <div className="SiderbarTopOption">
                  <input
                    type="file"
                    name="picturesmsuser"
                    id=""
                    style={{ display: "none" }}
                    onChange={handleupdate}
                    ref={ref}
                    accept="image/*"
                  />
                  <img src={img2} alt="" onClick={handlechangePhoto} />
                </div>
                <p id="texthover">photos</p>
              </div>

              <div className="SiderbarTop">
                <div className="SiderbarTopOption">
                  <input
                    ref={refmedia}
                    type="file"
                    name="mediasms"
                    id=""
                    onChange={handleupdate}
                    accept="
                      image/*,
                      video/*,
                      application/pdf,
                      text/plain,
                      text/csv,
                      application/json, 
                      application/msword,
                      application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                      application/vnd.ms-excel,
                      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                      application/vnd.oasis.opendocument.text
                    "
                    style={{ display: "none" }}
                    multiple
                  ></input>
                  <img src={img4} alt="" onClick={handlechangeMedia} />
                </div>
                <p id="texthover">médias</p>
              </div>
            </div>

            <div className="MessageWrittingHomeCenter">
              <textarea
                id=""
                value={valuesms}
                onChange={handleupdating}
                spellCheck="true"
                placeholder="Tapez votre message..."
              ></textarea>
            </div>

            <div className="MessageWrittingHomeRight">
              <div className="SiderbarTop">
                <div className="SiderbarTopOption">
                  <img src={img3} alt="" onClick={handlesendsms} />
                </div>
                <p id="texthover">Envoyer</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="noSelection">
          <p>
            Hello {user?.username || ""}, veuillez choisir un ami pour débuter
            la conversation.
          </p>
        </div>
      )}

      {open10 && selectedmedia && (
        <Dialog open={open10} onClose={handleClose} className="customdialog">
          <DialogContent>
            <DialogContentText className="dialogtext">
              {selectedmedia.fileType?.startsWith("image/") && (
                <img
                  src={`http://localhost:5000${selectedmedia.fileUrl}`}
                  alt=""
                />
              )}
              {selectedmedia.fileType?.startsWith("video/") && (
                <video
                  src={`http://localhost:5000${selectedmedia.fileUrl}`}
                  controls
                  width={"100%"}
                />
              )}
              {selectedmedia.fileType?.startsWith("audio/") && (
                <audio controls width={"100%"}>
                  <source
                    src={`http://localhost:5000${selectedmedia.fileUrl}`}
                    type={selectedmedia.fileType}
                  />
                </audio>
              )}
              {selectedmedia.fileType === "application/pdf" && (
                <div className="pdf-container">
                  <iframe
                    src={`http://localhost:5000${selectedmedia.fileUrl}`}
                    className="pdf-iframe"
                    title={selectedmedia.fileName}
                  ></iframe>
                </div>
              )}
              {(selectedmedia.fileType?.startsWith("text/") ||
                selectedmedia.fileType?.startsWith("application/msword")) && (
                <div className="pdf-container">
                  <iframe
                    src={`http://localhost:5000${selectedmedia.fileUrl}`}
                    className="pdf-iframe"
                    title={selectedmedia.fileName}
                  ></iframe>
                </div>
              )}
              {!selectedmedia.fileType?.startsWith("image/") &&
                !selectedmedia.fileType?.startsWith("video/") &&
                !selectedmedia.fileType?.startsWith("audio/") &&
                selectedmedia.fileType !== "application/pdf" &&
                !selectedmedia.fileType?.startsWith("text/") &&
                !selectedmedia.fileType?.startsWith("application/msword") && (
                  <img src={getFileIcon(selectedmedia.fileType)} alt="" />
                )}
              <p>
                Nom du fichier :
                <span style={{ fontWeight: "bold" }}>
                  {selectedmedia.fileName}{" "}
                </span>
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="optionbtn">
            <Button onClick={handleClose} className="retourbtn">
              Retour
            </Button>
            <Button
              autoFocus
              className="acceptbtn"
              onClick={() =>
                handledownload(selectedmedia.fileUrl, selectedmedia.fileName)
              }
            >
              télécharger
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Message;
