import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/background.png";
import img2 from "../assets/couleur.png";
import img3 from "../assets/images.png";
import img4 from "../assets/media.png";
import img5 from "../assets/texte.png";
import img from "../assets/ami.png";
import Button from "../containers/Button";
import "../styles/status.css";
import backimg1 from "../assets/background/arbre.jpg";
import backimg2 from "../assets/background/bateau.jpg";
import backimg3 from "../assets/background/bleu.jpeg";
import backimg4 from "../assets/background/neige.jpg";
import backimg5 from "../assets/background/roche.jpg";
import backimg6 from "../assets/background/sunset.jpeg";
import backimg7 from "../assets/background/water.jpg";
import backimg8 from "../assets/background/board.jpeg";
import backimg9 from "../assets/background/cascade.jpg";
import backimg10 from "../assets/background/galaxie.jpeg";
import backimg11 from "../assets/background/plus.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../pages/AuthContextUser";
import { getSocket } from "../pages/AuthContextUser";
import { useStatus } from "./StatusContext";

const Statuts = () => {
  const couleur = [
    { id: 1, name: "black" },
    { id: 2, name: "white" },
    { id: 3, name: "red" },
    { id: 4, name: "green" },
    { id: 5, name: "blue" },
    { id: 6, name: "yellow" },
    { id: 7, name: "orange" },
    { id: 8, name: "pink" },
  ];
  const background = [
    { id: 1, img: backimg1, name: "arbre" },
    { id: 2, img: backimg2, name: "bateau" },
    { id: 3, img: backimg3, name: "bleu" },
    { id: 4, img: backimg4, name: "neige" },
    { id: 5, img: backimg5, name: "roche" },
    { id: 6, img: backimg6, name: "sunset" },
    { id: 7, img: backimg7, name: "water" },
    { id: 8, img: backimg8, name: "board" },
    { id: 9, img: backimg9, name: "cascade" },
    { id: 10, img: backimg10, name: "galaxie" },
    { id: 11, img: backimg11, name: "ajouter" },
  ];
  const [statutsColor, setstatutsColor] = useState(couleur);
  const [statutsBackground, setstatutsBackground] = useState(background);
  const [selectbackground, setselectbackground] = useState(null);
  const [selectcolor, setselectcolor] = useState(null);
  const [users, setusers] = useState([]);
  const [SelectionOpt1, setSelectionOpt1] = useState(false);
  const [SelectionOpt2, setSelectionOpt2] = useState(false);
  const [smstext, setsmstext] = useState("");
  const [viewtext, setviewtext] = useState(true);
  const [viewcolor, setviewcolor] = useState(false);
  const [viewbackground, setviewbackground] = useState(false);
  const [viewtextarea, setviewtextarea] = useState(false);
  const [viewmediarea, setviewmediarea] = useState(false);
  const [viewphotoarea, setviewphotoarea] = useState(false);
  const [viewphoto, setviewphoto] = useState(true);
  const [viewmedia, setviewmedia] = useState(true);
  const [previmgstatut, setprevimgstatut] = useState(null);
  const [prevmediastatut, setprevmediastatut] = useState(null);
  const [mediatype, setmediatype] = useState(null);
  const [statutvisible, setstatutvisible] = useState(false);
  const [namebutton, setnamebutton] = useState("Créer un statut");
  const [open10, setOpen10] = useState(false);
  const [open11, setOpen11] = useState(false);
  const [open12, setOpen12] = useState(false);
  const [selectedmedia, setSelectedmedia] = useState(null);
  const { user } = useAuth();
  const focus = useRef(null);
  const refstatutphoto = useRef(null);
  const refstatutmedia = useRef(null);
  const [stepper, setstepper] = useState(0);
  const [valuetimer, setvaluetime] = useState(10);
  const [statusStep, setStatusStep] = useState([]);
  const [statusPublish, setStatusPublish] = useState([]);
  const imagebk = useRef(null);
  const currentTime = statusStep[stepper]?.time || valuetimer;
  const MAX_STATUS_TIME = 30;
  // durée réelle du media sélectionné (audio/vidéo)
  const [mediaDuration, setMediaDuration] = useState(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const [friendStatuses, setFriendStatuses] = useState([]);
  const [openFriend, setOpenFriend] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);
  const [newStatusUsers, setNewStatusUsers] = useState([]);
  const [statusViews, setStatusViews] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);
  const publishedItems = statusPublish[0]?.items || [];
  const { setHasUnseenStatus } = useStatus();

  const openFriendStatus = (status) => {
    setstepper(0);
    setActiveStatus(status);
    setOpenFriend(true);
    setNewStatusUsers((prev) => prev.filter((id) => id !== status.user.iduser));
  };
  const closeFriendStatus = () => {
    setOpenFriend(false);
    loadStatuses(); // sécurité
  };

  useEffect(() => {
    if (!friendStatuses || friendStatuses.length === 0) {
      setHasUnseenStatus(false);
      return;
    }

    const now = new Date();

    const hasUnseen = friendStatuses.some((status) => {
      // statut expiré → ignoré
      if (status.expiresAt && new Date(status.expiresAt) <= now) {
        return false;
      }

      // au moins un item non vu
      return status.items.some((item) => !item.viewed);
    });
    console.log("hasUnseen:", hasUnseen, friendStatuses);
    setHasUnseenStatus(hasUnseen);
  }, [friendStatuses]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.iduser) return;

    socket.emit("join_user_room", user.iduser);

    return () => {
      socket.emit("leave_user_room", user.iduser);
    };
  }, [user?.iduser]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.iduser) return;

    socket.emit("join_user_room", user.iduser);

    const handleNewStatus = ({ userId }) => {
      console.log("📢 Nouveau statut de:", userId);

      // Forcer le rechargement immédiat
      loadStatuses();

      // Mettre à jour newStatusUsers pour la notification visuelle
      setNewStatusUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );

      // Forcer le recalcul des statuts non vus
      setTimeout(() => {
        loadStatuses();
      }, 500);
    };

    const handleDeletedStatus = () => {
      console.log("🗑️ Statut supprimé détecté");
      loadStatuses();
    };

    const handleViewedStatus = ({ statusItemId, viewerId }) => {
      console.log("👁️ Statut vu par:", viewerId);
      // Mettre à jour localement pour réactivité
      if (viewerId !== user.iduser) {
        loadStatuses();
      }
    };

    socket.on("status:new", handleNewStatus);
    socket.on("status:deleted", handleDeletedStatus);
    socket.on("status:viewed", handleViewedStatus);

    return () => {
      socket.off("status:new", handleNewStatus);
      socket.off("status:deleted", handleDeletedStatus);
      socket.off("status:viewed", handleViewedStatus);
      socket.emit("leave_user_room", user.iduser);
    };
  }, [user?.iduser]); // IMPORTANT: dépendre de user.iduser

  const loadStatuses = async () => {
    const res = await axios.get("http://localhost:5000/status/active", {
      withCredentials: true,
    });

    setAllStatuses(res.data); // NOUVEL ÉTAT
  };

  /* useEffect(() => {
    if (!user?.iduser || allStatuses.length === 0) return;

    // 🔹 1️⃣ Grouper TOUS les statuts par utilisateur
    const groupedStatuses = Object.values(
      allStatuses.reduce((acc, status) => {
        const userId = status.user.iduser;

        if (!acc[userId]) {
          acc[userId] = {
            user: status.user,
            items: [],
          };
        }

        acc[userId].items.push(...status.items);
        return acc;
      }, {})
    );

    // 🔹 2️⃣ MON statut (1 seul bloc)
    const myStatus = groupedStatuses.filter(
      (s) => s.user.iduser === user.iduser
    );

    // 🔹 3️⃣ STATUTS DE MES AMIS
    const friendsStatus = groupedStatuses.filter(
      (s) => s.user.iduser !== user.iduser
    );

    // 🔹 4️⃣ Mise à jour des states
    setStatusPublish(myStatus); // ce que ton JSX "Mes statuts" attend
    setFriendStatuses(friendsStatus);
  }, [user, allStatuses]);*/

  // Dans l'effet qui met à jour les statuts
  useEffect(() => {
    if (!user?.iduser || allStatuses.length === 0) return;

    // 🔹 1️⃣ Grouper TOUS les statuts par utilisateur
    const groupedStatuses = Object.values(
      allStatuses.reduce((acc, status) => {
        const userId = status.user.iduser;

        if (!acc[userId]) {
          acc[userId] = {
            user: status.user,
            items: [],
          };
        }

        acc[userId].items.push(...status.items);
        return acc;
      }, {})
    );

    // 🔹 2️⃣ MON statut (1 seul bloc)
    const myStatus = groupedStatuses.filter(
      (s) => s.user.iduser === user.iduser
    );

    // 🔹 3️⃣ STATUTS DE MES AMIS
    const friendsStatus = groupedStatuses.filter(
      (s) => s.user.iduser !== user.iduser
    );

    // 🔹 4️⃣ Mise à jour des states
    setStatusPublish(myStatus); // ce que ton JSX "Mes statuts" attend
    setFriendStatuses(friendsStatus);
  }, [user, allStatuses]);
  useEffect(() => {
    if (!openFriend || !activeStatus) return;

    const item = activeStatus.items[stepper];
    if (!item) return;

    const isPlayable =
      item.mediaType?.startsWith("video/") ||
      item.mediaType?.startsWith("audio/");

    // 👉 IMAGE / TEXTE / PDF → durée enregistrée
    if (!isPlayable) {
      setProgress(0);

      const duration = (item.duration || 10) * 1000;
      const start = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / duration) * 100, 100);

        setProgress(percent);

        if (percent >= 100) {
          clearInterval(interval);
          setstepper((prev) =>
            prev < activeStatus.items.length - 1 ? prev + 1 : prev
          );
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [stepper, openFriend, activeStatus]);

  useEffect(() => {
    loadStatuses();
  }, []);
  // Dans l'effet qui marque comme vu
  useEffect(() => {
    if (!activeStatus || !openFriend) return;

    const item = activeStatus.items[stepper];
    if (!item) return;

    // Si déjà vu, ne rien faire
    if (item.viewed) return;

    console.log("Marquer comme vu:", item.id);

    // 1. Mettre à jour localement IMMÉDIATEMENT
    setFriendStatuses((prev) =>
      prev.map((status) => {
        if (status.user.iduser === activeStatus.user.iduser) {
          return {
            ...status,
            items: status.items.map((it) =>
              it.id === item.id ? { ...it, viewed: true } : it
            ),
          };
        }
        return status;
      })
    );

    // 2. Envoyer au serveur
    axios
      .post(
        `http://localhost:5000/status-item-view/${item.id}`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        console.log("✅ Item marqué comme vu sur le serveur");
      })
      .catch((err) => {
        console.error("❌ Erreur marquage vu:", err);
      });
  }, [stepper, activeStatus, openFriend]); // Ajouter openFriend
  const getViews = async (itemId) => {
    const res = await axios.get(
      `http://localhost:5000/status-item-view/${itemId}`,
      { withCredentials: true }
    );
    return res.data;
  };

  const grouped = friendStatuses;

  // Dans Statuts.jsx, ajoutez un useEffect pour charger les vues
  useEffect(() => {
    if (!open12 || !publishedItems[stepper]?.id) return;

    const loadViews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/status-item-view/${publishedItems[stepper].id}`,
          { withCredentials: true }
        );
        console.log("Vues chargées:", res.data);
        setStatusViews(res.data);
      } catch (err) {
        console.error("Erreur chargement vues:", err);
      }
    };

    loadViews();
  }, [stepper, open12, publishedItems]);

  const addStepsToStatus = () => {
    const newSteps = [];

    if (smstext.trim() !== "") {
      newSteps.push({
        type: "text",
        value: smstext,
        color: selectcolor,
        background: selectbackground,
        time: valuetimer,
      });
    }

    if (selectbackground && smstext.trim() === "") {
      newSteps.push({
        type: "background",
        value: selectbackground,
        time: valuetimer,
      });
    }

    if (newSteps.length === 0 && statusStep.length === 0) return;

    setStatusStep((prev) => [...prev, ...newSteps]);
    setstepper(0);
    setOpen10(true);
  };
  const handleFriendTimeUpdate = (e) => {
    const item = activeStatus.items[stepper];
    if (!item) return;

    const percent = (e.target.currentTime / e.target.duration) * 100;

    setProgress(Math.min(100, percent));

    if (e.target.ended) {
      setstepper((prev) =>
        prev < activeStatus.items.length - 1 ? prev + 1 : prev
      );
    }
  };

  const renderStep = (step) => {
    if (!step) return null;

    switch (step.type) {
      case "text":
        return (
          <div
            style={{
              backgroundImage: step.background
                ? `url(${step.background})`
                : step.backgroundUrl
                ? `url(http://localhost:5000${step.backgroundUrl})`
                : "none",
              color: step.color || "black",
              width: "100%",
              minHeight: "450px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <p>{step.value}</p>
          </div>
        );
      case "background":
        return (
          <div
            style={{
              backgroundImage: step.value ? `url(${step.value})` : `none`,
              width: "100%",
              minHeight: "450px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        );
      case "image":
        return (
          <div className="headerStatusImg">
            <img
              src={
                step.mediaUrl
                  ? `http://localhost:5000${step.mediaUrl}`
                  : step.value
              }
              alt=""
            />
          </div>
        );
      case "media":
        return (
          <div className="headerStatusImg">
            {step.mediatype?.startsWith("image/") && (
              <img
                src={
                  step.mediaUrl
                    ? `http://localhost:5000${step.mediaUrl}`
                    : step.value
                }
                alt=""
              />
            )}
            {step.mediatype?.startsWith("video/") && (
              <video
                key={`${step.value}-${stepper}`} // Important: changer key à chaque segment
                ref={videoRef}
                src={
                  step.mediaUrl
                    ? `http://localhost:5000${step.mediaUrl}`
                    : step.value
                }
                autoPlay
                controls
                width={"100%"}
                height={"500px"}
                playsInline
                preload="auto"
                onLoadedMetadata={(e) => {
                  // Démarre au début du segment
                  if (!openFriend && step.startTime !== undefined) {
                    e.target.currentTime = step.startTime;
                  }
                }}
                onTimeUpdate={
                  openFriend ? handleFriendTimeUpdate : handleTimeUpdate
                }
                onEnded={() => {
                  // Passer au segment suivant quand la vidéo se termine
                  if (stepper < statusStep.length - 1) {
                    setstepper((prev) => prev + 1);
                  }
                }}
              />
            )}
            {step.mediatype?.startsWith("audio/") && (
              <audio
                key={`${step.value}-${step.startTime}`}
                controls
                autoPlay
                style={{ width: "100%" }}
                onLoadedMetadata={(e) => {
                  if (typeof step.startTime === "number") {
                    e.target.currentTime = step.startTime;
                  }
                }}
                onTimeUpdate={(e) => {
                  if (e.target.currentTime >= step.endTime) {
                    setstepper((prev) =>
                      prev < statusPublish.length - 1 ? prev + 1 : prev
                    );
                  }
                }}
              >
                <source
                  src={
                    step.mediaUrl
                      ? `http://localhost:5000${step.mediaUrl}`
                      : step.value
                  }
                />
              </audio>
            )}

            {step.mediatype === "application/pdf" && (
              <div className="pdf-containers">
                <iframe
                  src={
                    step.mediaUrl
                      ? `http://localhost:5000${step.mediaUrl}`
                      : step.value
                  }
                  className="pdf-iframes"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };
  useEffect(() => {
    if (open12 && statusPublish?.[0]?.items?.length > 0) {
      setstepper(0);
    }
  }, [open12, statusPublish]);
  const handleTimeUpdate = (e) => {
    const step = statusPublish[0]?.items[stepper];
    if (!step || step.startTime === undefined) return;

    const current = e.target.currentTime;
    const duration = step.endTime - step.startTime;

    const percent = ((current - step.startTime) / duration) * 100;

    setProgress(Math.min(100, Math.max(0, percent)));

    if (current >= step.endTime) {
      setstepper((prev) =>
        prev < statusPublish[0].items.length - 1 ? prev + 1 : prev
      );
    }
  };

  //charge les status en cas de rafraichissement
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
        setusers(friends);
      } catch (error) {
        console.error("Erreur de chargement des amis", error);
      }
    };

    loadFriendsAndConversations();
  }, [user?.iduser]);
  /* useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = "0%";
    }
  }, [stepper]);*/
  useEffect(() => {
    if (viewtextarea || selectbackground) {
      focus.current?.focus();
    }
  }, [viewtextarea, selectbackground]);
  useEffect(() => {
    if (smstext.trim() !== "") {
      setviewcolor(true);
    } else {
      setviewcolor(false);
      setSelectionOpt2(false);
    }
  }, [smstext]);
  const handlebackground = () => {
    setSelectionOpt1(true);
    setSelectionOpt2(false);
  };
  const handlecolor = () => {
    if (smstext.length < 1 && smstext.trim() === "") {
      alert("Veuillez entrer un message pour utiliser la couleur");
      return;
    }
    setSelectionOpt2(true);
    setSelectionOpt1(false);
  };
  const handlesms = () => {
    setSelectionOpt1(false);
    setSelectionOpt2(false);
    setviewtext(true);
    setviewtextarea(true);
    setviewbackground(true);
    setviewphotoarea(false);
    setviewmediarea(false);
  };
  const handleChangeSms = (e) => {
    setsmstext(e.target.value);
  };
  const handlechangephotostatut = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setprevimgstatut(preview);
    // Sauvegarder aussi l'objet File
    setStatusStep((prev) => [
      ...prev,
      {
        type: "image",
        value: preview,
        file: file,
        mediatype: file.type,
        time: valuetimer,
      },
    ]);
    setviewphotoarea(true);
  };

  const handlechangephoto = () => {
    setviewtextarea(false);
    setSelectionOpt1(false);
    setSelectionOpt2(false);
    setviewcolor(false);
    setviewbackground(false);
    setviewmediarea(false);
    setviewphotoarea(true);
    refstatutphoto.current.click();
  };
  const handlechangemedia = () => {
    setviewtextarea(false);
    setSelectionOpt1(false);
    setSelectionOpt2(false);
    setviewcolor(false);
    setviewbackground(false);
    setviewphotoarea(false);
    setviewmediarea(true);
    refstatutmedia.current.click();
  };
  const handlechangemediastatut = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setprevmediastatut(url);

    setmediatype(file.type);
    setSelectedmedia(file);
    setMediaDuration(null);
    setStatusStep((prev) => [
      ...prev,
      {
        type: "media",
        value: url,
        file: file,
        mediatype: file.type,
        time:
          mediaDuration && mediaDuration > 0
            ? Math.min(mediaDuration, MAX_STATUS_TIME)
            : valuetimer,
      },
    ]);
    setviewmediarea(true);
    // On ne calcule une durée que pour audio/vidéo
    if (file.type.startsWith("audio/")) {
      const a = document.createElement("audio");
      a.src = url;
      a.onloadedmetadata = () => setMediaDuration(a.duration || 0);
    }

    if (file.type.startsWith("video/")) {
      const v = document.createElement("video");
      v.src = url;
      v.onloadedmetadata = () => setMediaDuration(v.duration || 0);
    }
  };
  const handleviewstatut = () => {
    if (namebutton === "Créer un statut") {
      setstatutvisible(true);
    }
    if (namebutton === "visualiser le statut") {
      addStepsToStatus();
    }
  };
  useEffect(() => {
    if (
      smstext.trim().length > 0 ||
      selectbackground !== null ||
      previmgstatut !== null ||
      prevmediastatut !== null
    ) {
      setnamebutton("visualiser le statut");
    } else {
      setnamebutton("Créer un statut");
    }
  }, [smstext, selectbackground, previmgstatut, prevmediastatut]);
  const handleClose = () => {
    setOpen10(false);
    setstepper(0);
  };
  const handleClose1 = () => {
    setOpen11(false);
  };
  const handleClose3 = () => {
    setOpen12(false);
  };
  const handlechangetimer = (e) => {
    const val = parseInt(e.target.value);
    if (val >= 5 && val <= 30) {
      setStatusStep((prev) => {
        const update = [...prev];
        update[stepper] = {
          ...update[stepper],
          time: val,
        };
        return update;
      });
    }
  };
  const handlesavetime = () => {
    setStatusStep((prev) => {
      const update = [...prev];
      update[stepper] = {
        ...update[stepper],
        time: parseInt(currentTime),
      };
      return update;
    });
    setOpen11(false);
  };
  const handleDeleteStatus = () => {
    const newSteps = [...statusStep];
    if (stepper >= 0 && stepper < newSteps.length) {
      newSteps.splice(stepper, 1);
    }
    setStatusStep(newSteps);
    if (newSteps.length === 0) {
      setOpen10(false);
      setstepper(0);
    } else if (stepper >= newSteps.length) {
      setstepper(newSteps.length - 1);
    }
  };
  const handleDeleteStatusPublish = () => {
    const updated = [...publishedItems];
    updated.splice(stepper, 1);

    setStatusPublish([
      {
        ...statusPublish[0],
        items: updated,
      },
    ]);

    if (updated.length === 0) {
      setOpen12(false);
      setstepper(0);
    } else if (stepper >= updated.length) {
      setstepper(updated.length - 1);
    }
  };

  const createStatusOnServer = async (items) => {
    const formData = new FormData();

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    formData.append("expiresAt", expiresAt.toISOString());

    items.forEach((item, index) => {
      formData.append(`items[${index}][type]`, item.type);
      formData.append(`items[${index}][order]`, index);
      formData.append(`items[${index}][duration]`, item.time || 10);

      if (item.type === "text") {
        formData.append(`items[${index}][text]`, item.value);
        if (item.color) formData.append(`items[${index}][color]`, item.color);
        if (item.background)
          formData.append(`items[${index}][backgroundUrl]`, item.background);
      }

      if (item.type === "media" || item.type === "image") {
        if (item.file) {
          formData.append("media", item.file); // 👈 IMPORTANT
          formData.append(`items[${index}][mediatype]`, item.mediatype);
        }
      }
    });

    await axios.post("http://localhost:5000/status", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handlepublish = async () => {
    const published = [];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);

    // Préparer les items pour le serveur
    const itemsForServer = [];

    statusStep.forEach((step) => {
      if (
        step.type === "media" &&
        step.mediatype &&
        (step.mediatype.startsWith("audio/") ||
          step.mediatype.startsWith("video/")) &&
        mediaDuration > MAX_STATUS_TIME
      ) {
        const parts = splitMediaIntoStatuses({
          src: step.value,
          mediatype: step.mediatype,
          duration: mediaDuration,
        });

        parts.forEach((part) => {
          itemsForServer.push({
            type: "media",
            value: part.value,
            mediatype: part.mediatype,
            startTime: part.startTime,
            endTime: part.endTime,
            time: part.time,
          });

          published.push({
            ...part,
            createdAt: now,
            expiresAt: expiresAt,
            viewed: false,
          });
        });
      } else {
        itemsForServer.push(step);
        published.push({
          ...step,
          createdAt: now,
          expiresAt: expiresAt,
          viewed: false,
        });
      }
    });

    try {
      // 1. Envoyer au serveur
      await createStatusOnServer(itemsForServer);
      toast.success("Statut publié avec succès!");
      //recharger tous les statuts
      await loadStatuses();
      // 3. Réinitialiser
      setOpen10(false);
      setstepper(0);
      setStatusStep([]);
      setsmstext("");
      setselectbackground(null);
      setprevimgstatut(null);
      setprevmediastatut(null);
      setmediatype(null);
      setstatutvisible(false);
      setOpen12(false);

      // 4. Recharger les statuts
      loadStatuses();
    } catch (error) {
      console.error("Erreur publication:", error);
    }
  };

  // Effet pour supprimer les statuts expirés
  useEffect(() => {
    // Vérifier toutes les minutes
    const interval = setInterval(() => {
      const now = new Date();

      setStatusPublish((prev) => {
        const stillValid = prev.filter((statut) => {
          // Si pas de expiresAt, on garde (pour compatibilité)
          if (!statut.expiresAt) return true;

          // Vérifier si la date d'expiration est dépassée
          return new Date(statut.expiresAt) > now;
        });

        // Si certains statuts ont été supprimés
        if (stillValid.length !== prev.length) {
          console.log(
            `${prev.length - stillValid.length} statut(s) expiré(s) supprimé(s)`
          );
        }

        return stillValid;
      });
    }, 60000); // Vérifie toutes les minutes

    return () => clearInterval(interval);
  }, []);
  const viewedCount =
    statusPublish[0]?.items.filter((s) => s.viewed).length || 0;
  // Dans Statuts.jsx, modifiez la fonction getStatusBorder
  const getStatusBorder = (total, viewedCount = 0, isOwner = false) => {
    if (total === 0) return {};

    const gap = 5;
    const angle = 360 / total;
    let gradient = [];

    for (let i = 0; i < total; i++) {
      const start = i * angle;
      const end = start + angle - gap;

      let color;
      if (isOwner) {
        color = "green"; // Toujours vert pour le créateur
      } else {
        // Pour les amis : vu = vert, non-vu = gris
        color = i < viewedCount ? "#ccc" : "green";
      }

      gradient.push(
        `${color} ${start}deg ${end}deg`,
        `transparent ${end}deg ${start + angle}deg`
      );
    }

    return {
      background: `conic-gradient(${gradient.join(",")})`,
    };
  };
  const handlebk = (p) => {
    setselectbackground(p);
    if (p === backimg11) {
      imagebk.current.click();
    }
  };
  const handlechangebk = (e) => {
    const file = e.target.files[0];
    if (file) {
      setselectbackground(URL.createObjectURL(file));
    }
  };

  //decouper une video en status
  useEffect(() => {
    if (!open12) return;

    const item = statusPublish[0]?.items[stepper];
    if (!item) return;

    if (
      item.type === "media" &&
      (item.mediatype?.startsWith("video/") ||
        item.mediatype?.startsWith("audio/"))
    )
      return;

    setProgress(0);
    const duration = item.time * 1000;
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(interval);
        setstepper((prev) =>
          prev < statusPublish[0].items.length - 1 ? prev + 1 : prev
        );
      }
    }, 50);

    return () => clearInterval(interval);
  }, [stepper, open12]);
  useEffect(() => {
    setProgress(0);
  }, [stepper]);
  useEffect(() => {
    if (openFriend) {
      setProgress(0);
    }
  }, [stepper, openFriend]);

  const splitVideoIntoStatuses = (src, duration) => {
    const chunks = Math.ceil(duration / MAX_STATUS_TIME);

    return Array.from({ length: chunks }, (_, index) => {
      const start = index * MAX_STATUS_TIME;
      const end = Math.min(start + MAX_STATUS_TIME, duration);

      return {
        type: "video",
        src: src,
        startTime: start,
        endTime: end,
        time: end - start,
        viewed: false,
      };
    });
  };
  const handleAddVideo = (file) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const parts = splitVideoIntoStatuses(video.src, video.duration);
      setStatusPublish((prev) => [...prev, ...parts]);
    };
  };
  const splitMediaIntoStatuses = ({ src, mediatype, duration }) => {
    const chunks = Math.ceil(duration / MAX_STATUS_TIME);

    return Array.from({ length: chunks }, (_, index) => {
      const start = index * MAX_STATUS_TIME;
      const end = Math.min(start + MAX_STATUS_TIME, duration);

      return {
        type: "media",
        value: src,
        mediatype,
        startTime: start,
        endTime: end,
        time: end - start, // IMPORTANT: le timer du statut = la durée du morceau
        viewed: false,
      };
    });
  };
  const getUserPhoto = (photo) => {
    if (!photo) return img;
    if (photo.startsWith("http")) return photo;
    return `http://localhost:5000${photo}`;
  };
  const handleDownload = async () => {
    try {
      if (!openFriend || !activeStatus) {
        toast.error("Aucun statut d'ami sélectionné");
        return;
      }

      const item = activeStatus.items[stepper];
      console.log("Item à télécharger:", item);

      if (!item?.mediaUrl) {
        toast.error("Aucun fichier à télécharger");
        return;
      }

      // Extraire le nom de fichier
      let filename;
      if (item.mediaUrl.includes("/")) {
        filename = item.mediaUrl.split("/").pop();
      } else {
        filename = item.mediaUrl;
      }

      // URL directe vers le fichier
      const fileUrl = `http://localhost:5000/uploads/${filename}`;
      console.log("Téléchargement depuis:", fileUrl);

      // Méthode 1: Créer un lien et cliquer dessus
      const link = document.createElement("a");
      link.href = fileUrl;

      // Forcer le téléchargement avec un nom de fichier personnalisé
      const username = activeStatus.user?.username || "ami";
      const timestamp = new Date().toISOString().split("T")[0];
      const extension = filename.split(".").pop() || "file";
      link.download = `status_${username}_${timestamp}_${stepper}.${extension}`;

      // Ajouter au DOM et déclencher le téléchargement
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      toast.success("Téléchargement démarré!");
    } catch (error) {
      console.error("Erreur de téléchargement:", error);

      // Fallback: ouvrir dans un nouvel onglet
      const item = activeStatus?.items[stepper];
      if (item?.mediaUrl) {
        const filename = item.mediaUrl.includes("/")
          ? item.mediaUrl.split("/").pop()
          : item.mediaUrl;
        window.open(`http://localhost:5000/uploads/${filename}`, "_blank");
        toast.info("Ouverture dans un nouvel onglet...");
      } else {
        toast.error("Impossible de télécharger le fichier");
      }
    }
  };

  return (
    <div className="MessageMain">
      <div className="MessageUser">
        <p id="Titlesms" style={{ marginBottom: "20px" }}>
          STATUTS
        </p>
        <div className="UserMain">
          <div className="UserMain">
            {friendStatuses.map((status) => {
              const total = status.items?.length || 0;
              const viewed = status.items?.filter((i) => i.viewed).length || 0;
              return (
                <div
                  key={status.user.iduser}
                  className="userSelect"
                  onClick={() => openFriendStatus(status)}
                >
                  {/* Votre avatar d'ami avec statut */}
                  <div
                    className="status-avatar"
                    style={getStatusBorder(total, viewed)}
                  >
                    <img
                      src={getUserPhoto(status.user.userphoto)}
                      alt={status.user.username}
                    />
                  </div>
                  <div className="userSelectText">
                    <p>{status.user.username}</p>
                    <small>{status.items?.length || 0} statut(s)</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="UserMain" style={{ marginTop: "30px" }}>
          <p style={{ textAlign: "center" }}>Mes statuts</p>

          {statusPublish.length > 0 ? (
            // Afficher les statuts publiés
            <div
              className="userSelect"
              onClick={() => {
                setstepper(0);
                setOpen12(true);
              }}
            >
              <div className="status-avatar">
                <img src={getUserPhoto(user.userphoto)} alt="" />
              </div>
              <div className="userSelectText">
                <p>{user.username}</p>
                <small>{statusPublish[0]?.items.length} statut(s)</small>
              </div>
            </div>
          ) : (
            // Afficher un message si pas de statuts
            <p style={{ textAlign: "center", color: "#888" }}>
              Aucun statut publié
            </p>
          )}
        </div>
      </div>
      <div className="StatusWritting">
        <div className="btnstatus">
          <Button className="retourbtn" onClick={handleviewstatut}>
            {namebutton}
          </Button>
        </div>
        {statutvisible && (
          <div className="StatusMain">
            <div className="StatusChoice">
              {SelectionOpt1 &&
                statutsBackground.map((p) => (
                  <div className="SiderbarTops" key={p.id}>
                    <div className="SiderbarTopOption">
                      <span>
                        <img
                          src={p.img}
                          alt=""
                          onClick={() => handlebk(p.img)}
                        />
                      </span>
                    </div>
                    <p id="texthovers">{p.name}</p>
                    <input
                      type="file"
                      accept="image/*"
                      ref={imagebk}
                      onChange={handlechangebk}
                      name=""
                      id=""
                      style={{ display: "none" }}
                    />
                  </div>
                ))}
              {SelectionOpt2 &&
                statutsColor.map((p) => (
                  <div className="SiderbarTops" key={p.id}>
                    <div className="SiderbarTopOption">
                      <span
                        style={{ backgroundColor: `${p.name}` }}
                        onClick={() => setselectcolor(p.name)}
                      ></span>
                    </div>
                    <p id="texthovers">{p.name}</p>
                  </div>
                ))}
            </div>
            <div className="headerStatus">
              {viewtextarea && (
                <textarea
                  name=""
                  value={smstext}
                  onChange={handleChangeSms}
                  ref={focus}
                  spellCheck
                  style={{
                    backgroundImage: `url(${selectbackground})`,

                    color: `${selectcolor}`,
                  }}
                />
              )}
              {viewphotoarea && (
                <div className="headerStatusImg">
                  <img src={previmgstatut} alt="" />
                  <div className="headerStatusImgButton">
                    <Button
                      className="retourbtn"
                      onClick={() => refstatutphoto.current.click()}
                    >
                      Changer la photo
                    </Button>
                  </div>
                </div>
              )}
              {viewmediarea && prevmediastatut && (
                <div className="headerStatusImg">
                  {mediatype.startsWith("image/") && (
                    <img src={prevmediastatut} alt="" />
                  )}
                  {mediatype.startsWith("video/") && (
                    <video src={prevmediastatut} controls width={"100%"} />
                  )}
                  {mediatype.startsWith("audio/") && (
                    <audio controls width={"100%"}>
                      <source src={prevmediastatut} width={"100%"} />
                    </audio>
                  )}
                  {mediatype.startsWith("application/pdf") && (
                    <div className="pdf-containers">
                      <iframe
                        src={prevmediastatut}
                        className="pdf-iframes"
                      ></iframe>
                    </div>
                  )}
                  <div className="headerStatusImgButton">
                    <Button
                      className="retourbtn"
                      onClick={() => refstatutmedia.current.click()}
                    >
                      Changer le media
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="StartusButton">
              {viewbackground && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img1} alt="" onClick={handlebackground} />
                  </div>
                  <p id="texthovers">Ajouter fond d'ecran</p>
                </div>
              )}
              {viewcolor && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img2} alt="" onClick={handlecolor} />
                  </div>
                  <p id="texthovers">Ajouter couleur texte</p>
                </div>
              )}
            </div>
            <div className="StatusText">
              {viewtext && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img5} alt="" onClick={handlesms} />
                  </div>
                  <p id="texthovers">Ajouter texte</p>
                </div>
              )}
              {viewphoto && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img3} alt="" onClick={handlechangephoto} />
                  </div>
                  <input
                    type="file"
                    ref={refstatutphoto}
                    onChange={handlechangephotostatut}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <p id="texthovers">Ajouter photo</p>
                </div>
              )}
              {viewmedia && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img4} alt="" onClick={handlechangemedia} />
                  </div>
                  <input
                    type="file"
                    ref={refstatutmedia}
                    onChange={handlechangemediastatut}
                    style={{ display: "none" }}
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
                  />
                  <p id="texthovers">Ajouter média</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {open10 && (
        <Dialog
          open={open10}
          onClose={handleClose}
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: "800px",
              height: "auto",
              position: "relative",
            },
          }}
        >
          <DialogContent
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            {renderStep(statusStep[stepper])}
          </DialogContent>

          {/* Navigation buttons - PREV/NEXT */}
          <DialogActions className="optionbtns">
            <Button
              disabled={stepper === 0}
              onClick={() => setstepper((prev) => prev - 1)}
              className="retourbtn"
              style={{
                opacity: stepper === 0 ? 0 : 1,
                cursor: stepper === 0 ? "default" : "pointer",
              }}
            >
              preview
            </Button>

            {stepper < statusStep.length - 1 ? ( // Affiche NEXT seulement si pas au dernier
              <Button
                autoFocus
                className="acceptbtn"
                onClick={() => setstepper((prev) => prev + 1)}
              >
                next
              </Button>
            ) : null}
          </DialogActions>

          {/* Action buttons - OPTIONS/DELETE/PUBLISH */}
          <DialogActions className="optionbtn">
            <Button onClick={() => setOpen11(true)} className="retourbtn">
              Option
            </Button>
            <Button onClick={handleDeleteStatus} className="rejectbtn">
              Supprimer
            </Button>
            {stepper === statusStep.length - 1 && ( // Publier seulement au dernier
              <Button autoFocus className="acceptbtn" onClick={handlepublish}>
                Publier
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {open11 && (
        <Dialog open={open11} onClose={handleClose1}>
          <DialogContent
            sx={{
              width: "100%",
              height: "100%",
              textAlign: "center",
            }}
          >
            <p>temps de ce statut</p>
            <p>veuillez entrer un temps compris entre 5 et 30</p>
            <input
              type="number"
              value={statusStep[stepper]?.time || 10}
              autoFocus
              name=""
              id=""
              min={5}
              max={30}
              onChange={handlechangetimer}
            />
          </DialogContent>
          <DialogActions className="optionbtn">
            <Button onClick={handleClose1} className="retourbtn">
              Fermer
            </Button>
            <Button autoFocus className="acceptbtn" onClick={handlesavetime}>
              Valider
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {open12 && (
        <Dialog
          open={open12}
          onClose={handleClose3}
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: "800px",
              height: "100%",
              position: "relative",
              overflowY: "auto",
            },
          }}
        >
          <DialogContent
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {publishedItems[stepper] && renderStep(publishedItems[stepper])}
          </DialogContent>
          <DialogActions className="optionbtns">
            <Button
              disabled={stepper === 0}
              onClick={() => setstepper((prev) => prev - 1)}
              className="retourbtn"
              style={{
                opacity: stepper === 0 ? 0 : 1,
                cursor: stepper === 0 ? "default" : "pointer",
              }}
            >
              preview
            </Button>
            {stepper < publishedItems.length - 1 && (
              <Button
                autoFocus
                className="acceptbtn"
                disabled={stepper >= statusPublish[0]?.items.length - 1}
                onClick={() => setstepper((prev) => prev + 1)}
                style={{
                  opacity:
                    stepper === statusPublish[0]?.items.length - 1 ? 0 : 1,
                  cursor:
                    stepper >= statusPublish[0]?.items.length - 1
                      ? "default"
                      : "pointer",
                }}
              >
                next
              </Button>
            )}
          </DialogActions>

          <DialogActions className="optionbtntimer">
            {statusPublish[0]?.items.map((s, index) => (
              <span
                key={index}
                className={`progress-seg ${
                  index < stepper ? "done" : index === stepper ? "current" : ""
                }`}
                style={{ flexGrow: 1 }}
                onClick={() => setstepper(index)}
              >
                <i
                  className="progress-fill"
                  style={{
                    width:
                      index < stepper
                        ? "100%"
                        : index === stepper
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </span>
            ))}
          </DialogActions>
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Vu par ({statusViews.length})
            </p>

            {statusViews.length === 0 ? (
              <small>Aucune vue pour le moment</small>
            ) : (
              statusViews.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "5px",
                  }}
                >
                  <img
                    src={getUserPhoto(v.viewer?.userphoto)}
                    alt={v.viewer?.username}
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%" }}
                  />
                  <span>{v.viewer?.username}</span>
                </div>
              ))
            )}
          </div>
          <DialogActions className="optionbtn">
            <Button onClick={() => setOpen12(false)} className="retourbtn">
              retour
            </Button>
            <Button onClick={handleDeleteStatusPublish} className="rejectbtn">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {openFriend && activeStatus && (
        <Dialog
          open={openFriend}
          onClose={closeFriendStatus}
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: "800px",
              height: "auto",
              maxHeight: "800px",
              position: "relative",
            },
          }}
        >
          <DialogContent
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderStep(activeStatus.items[stepper])}
          </DialogContent>
          <DialogActions className="optionbtns">
            <Button
              disabled={stepper === 0}
              onClick={() => setstepper((prev) => prev - 1)}
              className="retourbtn"
              style={{
                opacity: stepper === 0 ? 0 : 1,
                cursor: stepper === 0 ? "default" : "pointer",
              }}
            >
              preview
            </Button>
            {stepper < activeStatus.items.length - 1 && (
              <Button
                autoFocus
                className="acceptbtn"
                disabled={stepper >= activeStatus.items.length - 1}
                onClick={() => setstepper((prev) => prev + 1)}
                style={{
                  opacity: stepper === activeStatus.items.length - 1 ? 0 : 1,
                  cursor:
                    stepper >= activeStatus.items.length - 1
                      ? "default"
                      : "pointer",
                }}
              >
                next
              </Button>
            )}
          </DialogActions>
          <DialogActions className="optionbtntimer">
            {activeStatus?.items.map((s, index) => (
              <span
                key={index}
                className={`progress-seg ${
                  index < stepper ? "done" : index === stepper ? "current" : ""
                }`}
                style={{ flexGrow: 1 }}
                onClick={() => setstepper(index)}
              >
                <i
                  className="progress-fill"
                  style={{
                    width:
                      index < stepper
                        ? "100%"
                        : index === stepper
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </span>
            ))}
          </DialogActions>
          <DialogActions className="optionbtn">
            <Button onClick={() => setOpen12(false)} className="retourbtn">
              retour
            </Button>
            {activeStatus.items[stepper]?.mediaUrl && (
              <Button onClick={handleDownload} className="rejectbtn">
                Télécharger
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Statuts;
