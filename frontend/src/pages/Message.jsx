import React, { use, useEffect, useRef, useState } from "react";
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
import sablier from "../assets/sablier.png";
import Emojis from "../containers/Emojis.jsx";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "../containers/Button.jsx";
import imgbk from "../assets/background/neige.jpg";
const Message = ({ choicebk, adduser, clickuser }) => {
  const user = [
    { id: 1, name: "pouya", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 2,
      name: "dimitri",
      image: img,
      text: "bonjour dimitri,tu vas bien mon petit?",
      date: "10/12/2022",
    },
    { id: 3, name: "pouya", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 4,
      name: "dimitri",
      image: img,
      text: "bonjour dimitri,tu vas bien?",
      date: "10/12/2022",
    },
  ];
  const [open10, setOpen10] = useState(false);
  const [textsearch, settextsearch] = useState("");
  const [users, setusers] = useState(user);
  // const [test, settext] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  //const [imagemedia, setimagemedia] = useState(null);
  const [valuesms, setvaluesms] = useState("");
  //const [textesms, settextesms] = useState("");
  const [showfulltext, setshowfulltext] = useState(false);
  const [selectedmedia, setSelectedmedia] = useState(null);
  const [copymedia, setcopymedia] = useState(null);
  const [messageToReply, setMessageToReply] = useState(null);
  //const [showsablier, setshowsablier] = useState(false);
  const [selectUser, setselectUser] = useState(null);
  const [selectUserName, setselectUserName] = useState(null);
  const scrollcopy = useRef({});
  const [viewOption, setViewOption] = useState(null);
  const refhide = useRef(null);
  //progression de l'envoie du sms
  //const [uploadingMessages, setUploadingMessages] = useState({});
  //const [uploadProgress, setUploadProgress] = useState({});
  //const [uploadSpeeds, setUploadSpeeds] = useState({});
  const local = new Date().toISOString(); //heure gmt
  const datelocal = new Date(local); //convertir en heure local
  const hours = datelocal.getHours().toString().padStart(2, "0");
  const minutes = datelocal.getMinutes().toString().padStart(2, "0");
  const [UserHomeSms, setUserHomeSms] = useState({
    id: Date.now() + "-" + Math.random().toString(36).substring(2, 9),
    username: "",
    picturesmsuser: null,
    textsms: "",
    datesms: "",
    mediasms: null,
  });
  const [usertableau, setusertableau] = useState({});
  //recuperation des sms des user
  const currentMessages = usertableau[selectUser] || []; //on recupere les sms de l'user selectUser dans le tableau usertableau
  const ref = useRef(null);
  const refmedia = useRef(null);
  const refpicker = useRef(null);
  const refslider = useRef(null);
  // const uploadTimersRef = useRef({});
  const handlechangeMedia = (e) => {
    refmedia.current.click();
  };
  useEffect(() => {
    const handlecloseOption = (e) => {
      if (refhide.current && !refhide.current.contains(e.target)) {
        setViewOption(null);
      }
    };
    document.addEventListener("mousedown", handlecloseOption);
    return () => {
      document.removeEventListener("mousedown", handlecloseOption);
    };
  }, []);

  useEffect(() => {
    const handleoutside = (e) => {
      if (refpicker.current && !refpicker.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleoutside);
    return () => {
      document.removeEventListener("mousedown", handleoutside);
    };
  }, []);
  /* //nettoyer les timers lors du démontage du composant
  useEffect(() => {
    return () => {
      //transformations de l'objet en tableau
      Object.values(uploadTimersRef.current).forEach((timer) => {
        if (timer.clear) timer.clear(); //nettoyer le timer
      });
    };
  }, []);
  //gestion de la progression de l'envoie des sms
   const simulateFileUpload = (file, messageId) => {
    //calcul du temps d'uploads
    const tailleMo = (file.size / (1024 * 1024)).toFixed(2);
    //vitesse d'upload
    const vitesseMbps = 6; //0.5 + Math.random() * 1.5; //entre 0.5 et 2 Mbps
    const vitesseMoParSeconde = vitesseMbps * 0.125;
    const tempsTotalSecondes = tailleMo / vitesseMoParSeconde;
    //LE temps minimal est de 2secondes,math.max pour choisir le plus grand entre les deux
    const tempsTotalMs = Math.max(tempsTotalSecondes * 1000, 2000);
    //sauvergarder la vitesse pour l'affichage
    setUploadSpeeds((prev) => ({
      ...prev,
      [messageId]: `${vitesseMbps.toFixed(2)} Mbps`,
    }));
    let progress = 0;
    const interval = 100; // Mise à jour toutes les 100ms
    const increment = (interval / tempsTotalMs) * 100;
    const timer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        // Mettre à jour la progression à 100%
        setUploadProgress((prev) => ({ ...prev, [messageId]: 100 }));
        // Délai supplémentaire pour montrer le 100% avant de retirer le sablier
        setTimeout(() => {
          setUploadingMessages((prev) => ({ ...prev, [messageId]: false }));
          setUploadProgress((prev) => {
            const newProgress = { ...prev }; // copier l'objet prev
            delete newProgress[messageId]; //supprimer la progression du messageId
            return newProgress;
          });
          setUploadSpeeds((prev) => {
            const newSpeeds = { ...prev };
            delete newSpeeds[messageId];
            return newSpeeds;
          });
        }, 500);
      } else {
        setUploadProgress((prev) => ({ ...prev, [messageId]: progress }));
      }
    }, interval);

    // Sauvegarder le timer pour pouvoir le nettoyer
    uploadTimersRef.current[messageId] = { clear: () => clearInterval(timer) };

    return tempsTotalMs;
  };*/

  const handlechange = (e) => {
    const value = e.target.value;
    settextsearch(value); //mise a jour de la recherche
    if (value.length > 0 && value.trim() !== "") {
      const filter = users.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setusers(filter);
    } else {
      setusers(user);
    }
  };
  const handlechangePhoto = (e) => {
    ref.current.click();
  };
  const handleupdate = (e) => {
    setUserHomeSms({ ...UserHomeSms, [e.target.name]: e.target.value });
    if (e.target.name === "picturesmsuser") {
      const file = e.target.files[0];
      if (file) {
        if (file.size <= 5 * 1024 * 1024) {
          const messageId =
            Date.now() + "-" + Math.random().toString(36).substring(2, 9);
          //simulateFileUpload(file, messageId);
          const reader = URL.createObjectURL(file);
          const newSms = {
            id: messageId,
            username: "",
            picturesmsuser: reader,
            textsms: "",
            datesms: `${hours}:${minutes}`,
            mediasms: "",
            medianame: file.name,
            mediatype: file.type,
            mediasize: file.size,
            isUploading: true,
            time: Date.now(),
          };

          //mettre à jour usertableau en gardant tout ce qui était avant,puis pour chaque user ajouter les nouveaux sms(newsms) à ceux qui sont deja dans le tableau
          setusertableau((prev) => ({
            ...prev,
            [selectUser]: [...(prev[selectUser] || []), newSms],
          }));
          // Activer le sablier et initialiser la progression
          // setUploadingMessages((prev) => ({ ...prev, [messageId]: true);
          // setUploadProgress((prev) => ({ ...prev, [messageId]: 0 }));
        } else {
          alert("la taille de l'image ne doit pas dépasser 5 Mo");
        }
      }
    }
    if (e.target.name === "mediasms") {
      const files = Array.from(e.target.files); //transformer les fichiers en tableau
      if (!files) {
        return;
      }
      const newtab = [];
      files.forEach((file) => {
        if (file) {
          let fileIcon = save;
          if (file.type.startsWith("video/")) {
            fileIcon = video;
          } else if (file.type.startsWith("image/")) {
            fileIcon = image;
          } else if (file.type === "application/pdf") {
            fileIcon = pdf;
          } else if (file.type.startsWith("audio/")) {
            fileIcon = audio;
          } else if (file.type.startsWith("application/zip")) {
            fileIcon = save;
          } else if (
            [
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "text/plain",
              "text/csv",
              "application/json",
            ].includes(file.type) //verifier si le type de file est dans la liste
          ) {
            fileIcon = fichier;
          } else {
            fileIcon = save;
          }
          const messageId =
            Date.now() + "-" + Math.random().toString(36).substring(2, 9);
          //simulateFileUpload(file, messageId);
          const reader = URL.createObjectURL(file);
          const newSms = {
            id: messageId,
            username: "",
            picturesmsuser: "",
            textsms: "",
            datesms: `${hours}:${minutes}`,
            mediasms: reader,
            medianame: file.name,
            mediatype: file.type,
            mediasize: file.size,
            mediaicon: fileIcon,
            isUploading: true, //indicateur d'upload en cours
            time: Date.now(),
          };
          newtab.push(newSms); //ajoutons newsms dans newtab
          if (newtab.length === files.length) {
            //si tous les fichiers sont traités
            setusertableau((prev) => ({
              ...prev,
              [selectUser]: [...(prev[selectUser] || []), ...newtab],
            }));
            // Activer le sablier et initialiser la progression
            //setUploadingMessages((prev) => ({ ...prev, [messageId]: true }));
            //setUploadProgress((prev) => ({ ...prev, [messageId]: 0 }));
          }
        }
      });
    }
  };
  const handleEmojiSelect = (e) => {
    setvaluesms((prev) => prev + e.emoji);
  };
  const handleicone = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  //envoie des sms
  const handlesendsms = () => {
    if (!valuesms) {
      return;
    }
    if (valuesms.length > 0 && valuesms.trim() != "") {
      const newSms = {
        id: Date.now() + "-" + Math.random().toString(36).substring(2, 9),
        username: "",
        picturesmsuser: "",
        textsms: valuesms,
        datesms: `${hours}:${minutes}`,
        mediasms: "",
        time: Date.now(),
        replyTo: messageToReply
          ? {
              //On cree un objet de messageToReply avec des clès id,username etc
              id: messageToReply.id,
              username: messageToReply.username,
              picturesmsuser: messageToReply.picturesmsuser,
              textsms: messageToReply.textsms,
              mediaicon: messageToReply.mediaicon,
              mediaName: messageToReply.medianame,
              mediaType: messageToReply.mediatype,
              mediaSize: messageToReply.mediasize,
              mediasms: messageToReply.mediasms,
            }
          : null,
        mediacopy: "",
        isCopy: true,
      };

      setusertableau((prev) => ({
        ...prev,
        [selectUser]: [...(prev[selectUser] || []), newSms],
      }));
      setvaluesms("");
      setMessageToReply(null);
      setcopymedia(null);
      setShowEmojiPicker(false);
    }
  };
  const handleupdating = (e) => {
    setvaluesms(e.target.value);
  };
  //fonction de telechargement des fichiers
  const handledownload = (fileData, fileName) => {
    const link = document.createElement("a");
    link.href = fileData; //lien du fichier
    link.download = fileName; //nom du fichier
    document.body.appendChild(link); //ajouter le lien à la page
    link.click(); //click automatique sur le lien
    document.body.removeChild(link); //supprimer le lien de la page
    setOpen10(false);
  };
  const handleClose = () => {
    setOpen10(false);
  };
  const handleOpenDialog = (media) => {
    setSelectedmedia(media);
    setOpen10(true);
  };
  // Fonction pour formater la taille
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  //supprimer message
  const handledelete = (id) => {
    setusertableau((prev) => ({
      ...prev,
      [selectUser]: (prev[selectUser] || []).map((p) =>
        p.id === id
          ? {
              ...p,
              textsms: "message supprimé",
              mediasms: "",
              picturesmsuser: "",
              isDeleted: "true",
            }
          : p
      ),
    }));
  };
  //copier le message
  const handlecopy = (p) => {
    setcopymedia(p);
    setMessageToReply(p);
  };
  const handletoggle = (p) => {
    setselectUser(p);
  };
  const handleselectionUser = (p) => {
    setselectUserName(p);
  };
  //scroll vers le message copié
  const handlescrollCopy = (id) => {
    const scroll = scrollcopy.current[id];
    if (scroll) {
      scroll.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  useEffect(() => {
    localStorage.setItem("usertableau", JSON.stringify(usertableau));
  }, [usertableau]);
  /* useEffect(() => {
    const data = localStorage.getItem("usertableau");
    if (data) {
      setusertableau(JSON.parse(data));
    }
  }, []);*/
  useEffect(() => {
    const safeData = JSON.parse(JSON.stringify(usertableau));

    Object.keys(safeData).forEach((userId) => {
      safeData[userId] = safeData[userId].map((msg) => ({
        ...msg,
        mediasms: "",
        picturesmsuser: "",
      }));
    });

    localStorage.setItem("usertableau", JSON.stringify(safeData));
  }, [usertableau]);
  const handlerightclick = (id) => {
    setViewOption((prev) => (prev === id ? null : id));
  };
  useEffect(() => {
    if (refslider.current) {
      refslider.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [usertableau[selectUser]]);

  const getLastMessageTime = (userId) => {
    const messages = usertableau[userId];
    if (!messages || messages.length === 0) return 0;
    return messages[messages.length - 1].time || 0;
  };
  //cliquer sur ami et etre redirigé vers la page de message
  useEffect(() => {
    if (clickuser && adduser) {
      const found = adduser.find((user) => user.id === clickuser);
      if (found) {
        setselectUser(clickuser);
        setselectUserName(found);
        setusertableau((prev) => ({ ...prev, [clickuser]: [] }));
      }
    }
  }, [clickuser, adduser]);

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
          {adduser && adduser.length > 0 ? (
            [...adduser]
              .sort(
                (a, b) => getLastMessageTime(b.id) - getLastMessageTime(a.id)
              )
              .map((p) => (
                <div
                  className={`userSelect ${
                    selectUser === p.id ? "active" : ""
                  }`}
                  key={p.id}
                  onClick={() => {
                    handleselectionUser(p);
                    handletoggle(p.id);
                  }}
                >
                  <img src={p.image} alt="" />
                  <div className="userSelectText">
                    <p>{p.name}</p>
                    {usertableau[p.id] && usertableau[p.id].length > 0
                      ? (usertableau[p.id][usertableau[p.id].length - 1].textsms
                          .length > 28
                          ? `${usertableau[p.id][
                              usertableau[p.id].length - 1
                            ].textsms.slice(0, 28)}...`
                          : usertableau[p.id][usertableau[p.id].length - 1]
                              .textsms) ||
                        (usertableau[p.id][usertableau[p.id].length - 1]
                          .medianame.length > 28
                          ? `${usertableau[p.id][
                              usertableau[p.id].length - 1
                            ].medianame.slice(0, 28)}...`
                          : usertableau[p.id][usertableau[p.id].length - 1]
                              .medianame)
                      : "Aucun message"}
                  </div>
                </div>
              ))
          ) : (
            <p>Aucun ami pour le moment</p>
          )}
        </div>
      </div>
      {selectUserName ? (
        <div className="MessageWritting">
          {selectUserName && (
            <div className="MessageWrittingHeader">
              <div className="ImageSmsHeader">
                <img src={selectUserName.image} alt="" />
                <span></span>
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
            {currentMessages.map((p) => (
              <div className="UserMessage" key={p.id}>
                <div
                  className="UserMessageText"
                  onClick={() => handlerightclick(p.id)}
                >
                  {p.replyTo && (
                    <div
                      className="UserMessageCopy"
                      onClick={() => handlescrollCopy(p.replyTo.id)}
                    >
                      <p>Pouya / vous</p>
                      <span>
                        {p.replyTo.textsms.length > 50
                          ? `${p.replyTo.textsms.slice(0, 50)}...`
                          : `${p.replyTo.textsms}`}
                      </span>
                      <img src={p.replyTo.picturesmsuser} alt="" />
                      {p.replyTo.mediasms && (
                        <div className="iconefichier">
                          <img src={p.replyTo.mediaicon} alt="" />
                          <span>
                            {p.replyTo.mediaName?.length > 50
                              ? `${p.replyTo.mediaName.slice(0, 50)}...`
                              : `${p.replyTo.mediaName}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <p
                    id="textPrincipal"
                    ref={(el) => (scrollcopy.current[p.id] = el)}
                  >
                    {p.picturesmsuser && <img src={p.picturesmsuser} alt="" />}
                    {p.mediasms && (
                      <div
                        className="iconefichier"
                        onClick={() => handleOpenDialog(p)}
                      >
                        <img src={p.mediaicon} alt="" />
                        <span>
                          {p.medianame.length > 35
                            ? `${p.medianame.slice(0, 35)}...`
                            : p.medianame}{" "}
                          {(p.mediasize / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                    {showfulltext || p.textsms.length <= 2000
                      ? p.textsms
                      : p.textsms.slice(0, 2000)}
                    {p.textsms.length > 2000 && (
                      <span
                        id="readmore"
                        onClick={() => setshowfulltext(!showfulltext)}
                      >
                        {showfulltext ? " voir moins" : " ... lire la suite"}
                      </span>
                    )}
                  </p>
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
                    {p.mediatype && !p.isDeleted && (
                      <p onClick={() => handleOpenDialog(p)}>voir média</p>
                    )}
                  </div>
                )}

                {/*uploadingMessages[p.id] && (
                <div className="">
                  <div className="UserMessageChargement">
                    <img src={sablier} alt="" />
                  </div>
                  <div className="upload-progress-container">
                    <div className="progress-info">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${uploadProgress[p.id] || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-percentage">
                        {Math.round(uploadProgress[p.id] || 0)}%
                      </span>
                    </div>
                    <div className="upload-details">
                      <span className="file-size">
                        {formatFileSize(p.mediasize || 0)}
                      </span>
                      {uploadSpeeds[p.id] && (
                        <span className="upload-speed">
                          • {uploadSpeeds[p.id]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )*/}
              </div>
            ))}
            <div className="" ref={refslider}></div>
            {/* 
          <div className="UserMessageAway">
            <div className="UserMessageChargementAway">
              <img src={sablier} alt="" />
            </div>
            <div className="UserMessageAwayText">
              <div className="UserMessageCopy">
                <p>Pouya / vous</p>
                <span>bonjour dimitri tu vas bien moi oui</span>
              </div>
              <p id="textPrincipal">Lorem ipsum,</p>
              <p id="hoursms">18:00</p>
            </div>
          </div> */}
          </div>
          {copymedia && (
            <div className="ResponseSMS">
              {copymedia.textsms && (
                <div className="ResponseSMSText">
                  <p>
                    {copymedia.textsms.length > 200
                      ? copymedia.textsms.slice(0, 200) + "..."
                      : copymedia.textsms}
                  </p>
                  <button onClick={() => setcopymedia(null)}>X</button>
                </div>
              )}{" "}
              {(copymedia.picturesmsuser ||
                copymedia.mediasms ||
                copymedia.mediaicon) && (
                <div className="ResponseSMSImage">
                  <span>
                    {copymedia.medianame.length > 20
                      ? copymedia.medianame.slice(0, 20) + "..."
                      : copymedia.medianame}
                  </span>
                  <img
                    src={
                      copymedia.picturesmsuser ||
                      (copymedia.mediatype?.startsWith("image/")
                        ? copymedia.mediasms
                        : copymedia.mediaicon)
                    }
                    alt=""
                  />
                  <button onClick={() => setcopymedia(null)}>X</button>
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
                    value={UserHomeSms.picturesmsuser}
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
                    value={UserHomeSms.mediasms}
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
          <p>Hello,veuillez choisir un ami pour débuter la conversation.</p>
        </div>
      )}

      {open10 && selectedmedia && (
        <Dialog open={open10} onClose={handleClose} className="customdialog">
          <DialogContent>
            <DialogContentText className="dialogtext">
              {selectedmedia.mediatype.startsWith("image/") && (
                <img src={selectedmedia.mediasms} alt="" />
              )}
              {selectedmedia.picturesmsuser && (
                <img src={selectedmedia.picturesmsuser} alt="" />
              )}
              {selectedmedia.mediatype.startsWith("video/") && (
                <video src={selectedmedia.mediasms} controls width={"100%"} />
              )}
              {selectedmedia.mediatype.startsWith("audio/") && (
                <audio controls width={"100%"}>
                  <source src={selectedmedia.mediasms} width={"100%"} />
                </audio>
              )}
              {selectedmedia.mediatype.startsWith("application/pdf") && (
                <div className="pdf-container">
                  <iframe
                    src={selectedmedia.mediasms}
                    className="pdf-iframe"
                  ></iframe>
                </div>
              )}
              {selectedmedia.mediatype.startsWith("text/plain") && (
                <div className="pdf-container">
                  <iframe
                    src={selectedmedia.mediasms}
                    className="pdf-iframe"
                  ></iframe>
                </div>
              )}
              {selectedmedia.mediatype.startsWith("application/json") && (
                <img src={fichier} alt="" />
              )}
              {selectedmedia.mediatype.startsWith("application/msword") && (
                <div className="pdf-container">
                  <iframe
                    src={selectedmedia.mediasms}
                    className="pdf-iframe"
                  ></iframe>
                </div>
              )}
              {selectedmedia.mediatype.startsWith(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ) && <img src={fichier} alt="" />}
              {selectedmedia.mediatype.startsWith(
                "application/vnd.ms-excel"
              ) && <img src={fichier} alt="" />}
              {selectedmedia.mediatype.startsWith(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              ) && <img src={fichier} alt="" />}
              {selectedmedia.mediatype.startsWith(
                "application/vnd.oasis.opendocument.text"
              ) && <img src={fichier} alt="" />}
              <p>
                Nom du fichier :
                <span style={{ fontWeight: "bold" }}>
                  {selectedmedia.medianame}{" "}
                </span>{" "}
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
                handledownload(selectedmedia.mediasms, selectedmedia.medianame)
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
