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
const Message = () => {
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
    { id: 5, name: "pouya", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 6,
      name: "dimitri",
      image: img,
      text: "bonjour dimitri,tu vas bien?",
      date: "10/12/2022",
    },
    { id: 7, name: "pouya", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 8,
      name: "dimitri",
      image: img,
      text: "bonjour dimitri,tu vas bien?",
      date: "10/12/2022",
    },
    { id: 9, name: "pouya", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 10,
      name: "dimitri",
      image: img,
      text: "bonjour dimitri,tu vas bien?",
      date: "10/12/2022",
    },
    { id: 11, name: "pouya", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 12,
      name: "dimitri",
      image: img,
      text: "bonjour dimitri,tu vas bien?",
      date: "10/12/2022",
    },
    { id: 13, name: "pouya", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 14,
      name: "dimitri",
      image: img,
      text: "bonjour dimitri,tu vas bien?",
      date: "10/12/2022",
    },
  ];
  const [open10, setOpen10] = useState(false);
  const [textsearch, settextsearch] = useState("");
  const [users, setusers] = useState(user);
  const [test, settext] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagemedia, setimagemedia] = useState(null);
  const [valuesms, setvaluesms] = useState("");
  const [textesms, settextesms] = useState("");
  const [showfulltext, setshowfulltext] = useState(false);
  const [selectedmedia, setSelectedmedia] = useState(null);
  const [showsablier, setshowsablier] = useState(false);
  //progression de l'envoie du sms
  const [uploadingMessages, setUploadingMessages] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadSpeeds, setUploadSpeeds] = useState({});
  const local = new Date().toISOString(); //heure gmt
  const datelocal = new Date(local);
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
  const [usertableau, setusertableau] = useState([]);
  const ref = useRef(null);
  const refmedia = useRef(null);
  const refpicker = useRef(null);
  const uploadTimersRef = useRef({});
  const handlechangeMedia = (e) => {
    refmedia.current.click();
  };
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
  //nettoyer les timers lors du démontage du composant
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
  };

  const handlechange = (e) => {
    const value = e.target.value;
    settextsearch(value);
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
          simulateFileUpload(file, messageId);
          const reader = new FileReader();
          reader.onloadend = () => {
            const data = reader.result;
            const newSms = {
              id: messageId,
              username: "",
              picturesmsuser: data,
              textsms: "",
              datesms: `${hours}:${minutes}`,
              mediasms: "",
              isUploading: true,
            };
            console.log(newSms);
            setusertableau([...usertableau, newSms]);
            // Activer le sablier et initialiser la progression
            setUploadingMessages((prev) => ({ ...prev, [messageId]: true }));
            setUploadProgress((prev) => ({ ...prev, [messageId]: 0 }));
          };
          reader.readAsDataURL(file);
        } else {
          alert("la taille de l'image ne doit pas dépasser 5 Mo");
        }
      }
    }
    if (e.target.name === "mediasms") {
      const files = Array.from(e.target.files);
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
            ].includes(file.type)
          ) {
            fileIcon = fichier;
          } else {
            fileIcon = save;
          }
          const messageId =
            Date.now() + "-" + Math.random().toString(36).substring(2, 9);
          simulateFileUpload(file, messageId);
          const reader = new FileReader();
          reader.onloadend = () => {
            const data = reader.result;
            const newSms = {
              id: messageId,
              username: "",
              picturesmsuser: "",
              textsms: "",
              datesms: `${hours}:${minutes}`,
              mediasms: data,
              medianame: file.name,
              mediatype: file.type,
              mediasize: file.size,
              mediaicon: fileIcon,
              isUploading: true, //indicateur d'upload en cours
            };
            newtab.push(newSms); //ajoutons newsms dans un nouveau tableau
            if (newtab.length === files.length) {
              console.log(newSms);
              setusertableau([...usertableau, ...newtab]);
              // Activer le sablier et initialiser la progression
              setUploadingMessages((prev) => ({ ...prev, [messageId]: true }));
              setUploadProgress((prev) => ({ ...prev, [messageId]: 0 }));
            }
          };
          reader.readAsDataURL(file);
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
      };
      setusertableau([...usertableau, newSms]);
      setvaluesms("");
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {users.map((p) => (
            <div className="userSelect" key={p.id}>
              <img src={p.image} alt="" />
              <div className="userSelectText">
                <p>{p.name}</p>
                <p>
                  {p.text.length > 28
                    ? `${p.text.slice(0, 28) + "..."}`
                    : p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="MessageWritting">
        <div className="MessageWrittingHeader">
          <div className="ImageSmsHeader">
            <img src={img} alt="" />
            <span></span>
          </div>
          <p>dimitri</p>
        </div>
        <div className="MessageWrittingContainer">
          {usertableau.map((p) => (
            <div className="UserMessage" key={p.id}>
              <div className="UserMessageText">
                <p id="textPrincipal">
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

          {/* <div className="UserMessage">
            <div className="UserMessageText">
              <div className="UserMessageCopy">
                <p>Pouya / vous</p>
                <span>bonjour dimitri tu vas bien moi oui</span>
              </div>
              <p id="textPrincipal">bonjour monsieur ,test 1</p>
              <p id="hoursms">18:00</p>
            </div>
            <div className="UserMessageChargement">
              <img src={sablier} alt="" />
            </div>
          </div>
          <div className="UserMessageAway">
            <div className="UserMessageChargementAway">
              <img src={sablier} alt="" />
            </div>
            <div className="UserMessageAwayText">
              <div className="UserMessageCopy">
                <p>Pouya / vous</p>
                <span>bonjour dimitri tu vas bien moi oui</span>
              </div>
              <p id="textPrincipal">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
                obcaecati, excepturi harum cumque, quas laudantium dolorum
                voluptatem vitae porro voluptatum dolore labore odit at, officia
                reiciendis laboriosam quaerat placeat assumenda?{" "}
              </p>
              <p id="hoursms">18:00</p>
            </div>
          </div>
          <div className="UserMessageAway">
            <div className="UserMessageChargementAway">
              <img src={sablier} alt="" />
            </div>
            <div className="UserMessageAwayText">
              <div className="UserMessageCopy">
                <p>Pouya / vous</p>
                <span>bonjour dimitri tu vas bien moi oui</span>
              </div>
              <p id="textPrincipal">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
                obcaecati, excepturi harum cumque, quas laudantium dolorum
                voluptatem vitae porro voluptatum dolore labore odit at, officia
                reiciendis laboriosam quaerat placeat assumenda? Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Alias, sint omnis
                delectus dicta, officiis reprehenderit iste aut repellendus
                molestias iusto illo possimus atque adipisci libero eligendi
                natus. Esse, ducimus tempora? Lorem ipsum, dolor sit amet
                consectetur adipisicing elit. Suscipit ipsam mollitia magni
                voluptates omnis id, minus nesciunt quae porro et qui reiciendis
                at voluptas temporibus! Exercitationem molestiae ex ipsa
                perferendis. Lorem ipsum, dolor sit amet consectetur adipisicing
                elit. Beatae obcaecati, excepturi harum cumque, quas laudantium
                dolorum voluptatem vitae porro voluptatum dolore labore odit at,
                officia reiciendis laboriosam quaerat placeat assumenda? Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Alias, sint
                omnis delectus dicta, officiis reprehenderit iste aut
                repellendus molestias iusto illo possimus atque adipisci libero
                eligendi natus. Esse, ducimus tempora? Lorem ipsum, dolor sit
                amet consectetur adipisicing elit. Suscipit ipsam mollitia magni
                voluptates omnis id, minus nesciunt quae porro et qui reiciendis
                at voluptas temporibus! Exercitationem molestiae ex ipsa
                perferendis.
              </p>
              <p id="hoursms">18:00</p>
            </div>
          </div>
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
        <div className="ResponseSMS">
          {/*<p>vous allez bien monsieur?</p>*/}
          <img src={img} alt="" />
          <button>X</button>
        </div>
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
      {open10 && selectedmedia && (
        <Dialog open={open10} onClose={handleClose} className="customdialog">
          <DialogContent>
            <DialogContentText className="dialogtext">
              {selectedmedia.mediatype.startsWith("image/") && (
                <img src={selectedmedia.mediasms} alt="" />
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
