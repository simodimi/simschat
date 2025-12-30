import React, { useEffect, useRef, useState } from "react";
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

const Statuts = () => {
  const user = [
    { id: 1, name: "User1", image: img, text: "salut", date: "10/10/2022" },
    {
      id: 2,
      name: "User2",
      image: img,
      text: "bonjour dimitri,tu vas bien mon petit?",
      date: "10/12/2022",
    },
    { id: 3, name: "User3", image: img, text: "salut", date: "10/10/2022" },
  ];
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
  const [users, setusers] = useState(user);
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
  const progressRef = useRef(null);

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

    if (previmgstatut) {
      newSteps.push({
        type: "image",
        value: previmgstatut,
        time: valuetimer,
      });
    }

    // ✅ MEDIA : TOUJOURS ENTIER en visualisation
    if (prevmediastatut) {
      newSteps.push({
        type: "media",
        value: prevmediastatut,
        mediatype,
        time:
          mediaDuration && mediaDuration > 0
            ? Math.min(mediaDuration, MAX_STATUS_TIME)
            : valuetimer,
        fullPreview: true, // 🧠 flag important
      });
    }

    if (newSteps.length === 0) return;

    setStatusStep(newSteps);
    setstepper(0);
    setOpen10(true);
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
                : `none`,
              color: step.color ? step.color : "black",
              width: "100%",
              minHeight: "450px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
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
            <img src={step.value} alt="" />
          </div>
        );
      case "media":
        return (
          <div className="headerStatusImg">
            {step.mediatype && step.mediatype.startsWith("image/") && (
              <img src={step.value} alt="" />
            )}
            {step.mediatype && step.mediatype.startsWith("video/") && (
              <video
                key={`${step.value}-${stepper}`} // Important: changer key à chaque segment
                ref={videoRef}
                src={step.value}
                autoPlay
                controls
                width={"100%"}
                height={"500px"}
                playsInline
                preload="auto"
                onLoadedMetadata={(e) => {
                  // Démarre au début du segment
                  if (step.startTime !== undefined) {
                    e.target.currentTime = step.startTime;
                  }
                }}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {
                  // Passer au segment suivant quand la vidéo se termine
                  if (stepper < statusPublish.length - 1) {
                    setstepper((prev) => prev + 1);
                  }
                }}
              />
            )}
            {step.mediatype && step.mediatype.startsWith("audio/") && (
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
                <source src={step.value} width={"100%"} />
              </audio>
            )}
            {step.mediatype && step.mediatype.startsWith("application/pdf") && (
              <div className="pdf-containers">
                <iframe src={step.value} className="pdf-iframes"></iframe>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  const handleTimeUpdate = (e) => {
    const step = statusPublish[stepper];
    if (!step || !progressRef.current) return;

    if (step.startTime === undefined || step.endTime === undefined) return;

    const current = e.target.currentTime;
    const duration = step.endTime - step.startTime;

    const progress = (current - step.startTime) / duration;

    progressRef.current.style.width = `${Math.min(
      100,
      Math.max(0, progress * 100)
    )}%`;

    if (current >= step.endTime) {
      setstepper((prev) => (prev < statusPublish.length - 1 ? prev + 1 : prev));
    }
  };
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = "0%";
    }
  }, [stepper]);
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
    if (!file) {
      return;
    }
    if (file) {
      setprevimgstatut(URL.createObjectURL(file));
      setviewphotoarea(true);
    }
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
    setviewmediarea(true);
    setmediatype(file.type);
    setSelectedmedia(file);
    setMediaDuration(null);

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
    /* setStatusStep([]);
    setsmstext("");
    setselectbackground(null);
    setprevimgstatut(null);
    setprevmediastatut(null);
    setmediatype(null);
    setnamebutton("Créer un statut");
    setSelectionOpt1(false);
    setSelectionOpt2(false);
    setviewtext(false);
    setviewtextarea(false);
    setviewcolor(false);
    setviewbackground(false);
    setviewphotoarea(false);
    setviewmediarea(false);
    setstatutvisible(false);*/
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
    const newSteps = [...statusPublish];
    if (stepper >= 0 && stepper < newSteps.length) {
      newSteps.splice(stepper, 1);
    }
    setStatusPublish(newSteps);
    if (newSteps.length === 0) {
      setOpen12(false);
      setstepper(0);
    } else if (stepper >= newSteps.length) {
      setstepper(newSteps.length - 1);
    }
  };
  const handlepublish = () => {
    const published = [];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);
    statusStep.forEach((step) => {
      if (
        step.type === "media" &&
        step.mediatype &&
        (step.mediatype.startsWith("audio/") ||
          step.mediatype.startsWith("video/")) &&
        mediaDuration > MAX_STATUS_TIME
      ) {
        // ✅ DÉCOUPE UNIQUEMENT ICI
        const parts = splitMediaIntoStatuses({
          src: step.value,
          mediatype: step.mediatype,
          duration: mediaDuration,
        });
        // Ajouter expiration à chaque segment
        const partsWithExpiry = parts.map((part) => ({
          ...part,
          createdAt: now,
          expiresAt: expiresAt,
          viewed: false,
        }));

        published.push(...partsWithExpiry);
      } else {
        published.push({
          ...step,
          createdAt: now,
          expiresAt: expiresAt,
          viewed: false,
        });
      }
    });

    setStatusPublish((prev) => [...prev, ...published]);

    // reset
    setOpen10(false);
    setstepper(0);
    setStatusStep([]);
    setsmstext("");
    setselectbackground(null);
    setprevimgstatut(null);
    setprevmediastatut(null);
    setmediatype(null);
    setstatutvisible(false);
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
  const viewedCount = statusPublish.filter((s) => s.viewed).length;
  const getStatusBorder = (total, viewedCount = 0) => {
    if (total === 0) return {};

    const gap = 5; // taille de l’écart en degrés
    const angle = 360 / total;
    let gradient = [];

    for (let i = 0; i < total; i++) {
      const start = i * angle;
      const end = start + angle - gap;

      const color = i < viewedCount ? "#ccc" : "green";

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

  useEffect(() => {
    if (!open12) return;
    if (!statusPublish[stepper]) return;

    const markSeen = setTimeout(() => {
      setStatusPublish((prev) =>
        prev.map((s, i) => (i === stepper ? { ...s, viewed: true } : s))
      );
    }, 1000);

    return () => clearTimeout(markSeen);
  }, [stepper, open12]);
  useEffect(() => {
    if (!open12) return;

    const step = statusPublish[stepper];
    if (!step) return;

    // PAS de timer pour audio / vidéo
    if (
      step.type === "media" &&
      (step.mediatype?.startsWith("video/") ||
        step.mediatype?.startsWith("audio/"))
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setstepper((prev) => (prev < statusPublish.length - 1 ? prev + 1 : prev));
    }, step.time * 1000);

    return () => clearTimeout(timer);
  }, [stepper, open12, statusPublish]);

  //decouper une video en status
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
  return (
    <div className="MessageMain">
      <div className="MessageUser">
        <p id="Titlesms" style={{ marginBottom: "20px" }}>
          STATUTS
        </p>
        <div className="UserMain">
          {users.map((p) => (
            <div className={"userSelect"}>
              <img src={p.image} alt="" />
              <div className="userSelectText">
                <p>{p.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="UserMain" style={{ marginTop: "30px" }}>
          <p style={{ textAlign: "center" }}>Mes statuts</p>

          {statusPublish.length > 0 ? (
            // Afficher les statuts publiés
            <div
              className="userSelect"
              onClick={() => {
                const firstUnviewed = statusPublish.findIndex((s) => !s.viewed);
                setstepper(firstUnviewed !== -1 ? firstUnviewed : 0);
                setOpen12(true);
              }}
            >
              <div
                className="status-avatar"
                style={getStatusBorder(statusPublish.length, viewedCount)}
              >
                <img src={img} alt="" />
              </div>
              <div className="userSelectText">
                <p>dimitri</p>
                <small>{statusPublish.length} statut(s)</small>
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
                    <img src={img} alt="" onClick={handlebackground} />
                  </div>
                  <p id="texthovers">Ajouter fond d'ecran</p>
                </div>
              )}
              {viewcolor && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img} alt="" onClick={handlecolor} />
                  </div>
                  <p id="texthovers">Ajouter couleur texte</p>
                </div>
              )}
            </div>
            <div className="StatusText">
              {viewtext && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img} alt="" onClick={handlesms} />
                  </div>
                  <p id="texthovers">Ajouter texte</p>
                </div>
              )}
              {viewphoto && (
                <div className="SiderbarTops">
                  <div className="SiderbarTopOption">
                    <img src={img} alt="" onClick={handlechangephoto} />
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
                    <img src={img} alt="" onClick={handlechangemedia} />
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
              height: "auto",
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
            {renderStep(statusPublish[stepper])}
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
            {stepper < statusPublish.length - 1 && (
              <Button
                autoFocus
                className="acceptbtn"
                disabled={stepper >= statusPublish.length - 1}
                onClick={() => setstepper((prev) => prev + 1)}
                style={{
                  opacity: stepper === statusPublish.length - 1 ? 0 : 1,
                  cursor:
                    stepper >= statusPublish.length - 1 ? "default" : "pointer",
                }}
              >
                next
              </Button>
            )}
          </DialogActions>

          <DialogActions className="optionbtntimer">
            {statusPublish.map((s, index) => {
              // Calculer la durée réelle pour l'animation
              const segmentDuration =
                s.endTime && s.startTime ? s.endTime - s.startTime : s.time;

              return (
                <span
                  key={index}
                  className={`progress-seg ${
                    index < stepper
                      ? "done"
                      : index === stepper
                      ? "current"
                      : ""
                  }`}
                  style={{ flexGrow: 1 }}
                  onClick={() => {
                    setstepper(index);
                    // Pour les vidéos : repositionner au début du segment
                    if (videoRef.current && s.startTime !== undefined) {
                      videoRef.current.currentTime = s.startTime;
                    }
                  }}
                >
                  <i
                    className="progress-fill"
                    ref={index === stepper ? progressRef : null}
                    style={{
                      width: index < stepper ? "100%" : "0%",
                    }}
                  />
                </span>
              );
            })}
          </DialogActions>

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
    </div>
  );
};

export default Statuts;
