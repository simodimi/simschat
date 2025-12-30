import React, { use, useState } from "react";
import img from "../assets/ami.png";
import "../styles/ami.css";
import Button from "../containers/Button.jsx";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useNavigate } from "react-router-dom";
const Ami = ({ setadduser, setclickuser }) => {
  const user = [];
  const userst = [
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
  const newuser = [
    { id: 1, name: "pouyas", image: img, text: "salut", date: "10/10/2022" },
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
  ];
  const [textsearch, settextsearch] = useState("");
  const [textsearching, settextsearching] = useState("");
  const [users, setusers] = useState(user);
  const [usering, setusering] = useState([]);
  const [newusers, setnewusers] = useState(newuser);
  const [selectUser, setselectUser] = useState(null);
  const [newselectUser, setnewselectUser] = useState(null);
  const [selectUsering, setselectUsering] = useState(null);
  const [showprofile, setshowprofile] = useState(null);
  const [showoptionuserAway, setshowoptionuserAway] = useState(false);
  const [btnask, setbtnask] = useState([]);
  const [open, setOpen] = useState(false);
  const [uservalidate, setuservalidate] = useState([]);
  const navigate = useNavigate();
  const handleChangeFilter = (e) => {
    const valeur = e.target.value;
    settextsearch(valeur);
    if (valeur.length > 0 && valeur.trim() !== "") {
      const filter = users.filter((p) =>
        p.name.toLowerCase().includes(valeur.toLowerCase())
      );
      setusers(filter);
    } else {
      setusers(user);
    }
  };
  const handleChangeFiltering = (e) => {
    const valeur = e.target.value;
    settextsearching(valeur);
    if (valeur.length > 0 && valeur.trim() !== "") {
      const filter = newuser.filter((p) =>
        p.name.toLowerCase().includes(valeur.toLowerCase())
      );
      setnewusers(filter);
    } else {
      setnewusers(user);
    }
  };
  const handleselectuser = (p) => {
    setselectUser(p);
  };
  const handletoggle = (p) => {
    setshowprofile(p);
  };
  const handleselectusering = (p) => {
    setselectUsering(p);
  };
  const handledelete = (id) => {
    const data = usering.filter((p) => p.id !== id);
    setusering(data);
    setbtnask((prev) => prev.filter((item) => item !== id));
  };
  const handlenewselectuser = (p) => {
    setnewselectUser(p);
  };
  const handlecancel = (id) => {
    setbtnask((prev) => prev.filter((item) => item !== id));
  };
  const handlechoice = (id) => {
    setbtnask((prev) => [...prev, id]);
  };
  const handlechoices = (p) => {
    setusering((prev) =>
      prev.some((u) => u.id === p.id)
        ? prev.filter((u) => u.id !== p.id)
        : [...prev, p]
    );
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handledeleteuser = (id) => {
    const data = users.filter((p) => p.id !== id);
    setusers(data);
    setOpen(false);
    setshowprofile(null);
    setshowoptionuserAway(false);
    // Retirer de tous les états
    setuservalidate((prev) => prev.filter((u) => u !== id));
    setbtnask((prev) => prev.filter((item) => item !== id));
    // Retirer de la liste des nouvelles demandes si présent
    setusering((prev) => prev.filter((u) => u.id !== id));
    // Retirer de la liste d'amis globale
    setadduser((prev) => prev.filter((u) => u.id !== id));
  };

  const handlevalidate = (p) => {
    setusers((prev) => [...prev, p]);
    setusering((prev) => prev.filter((u) => u.id !== p.id));
    setuservalidate((prev) => [...prev, p.id]);
    setbtnask((prev) => prev.filter((item) => item !== p.id));
    setadduser((prev) => {
      if (!prev) return [p]; // Si prev est null/undefined, retourner un tableau avec p
      if (prev.some((user) => user.id === p.id)) return prev; // Éviter les doublons
      return [...prev, p];
    });
  };
  const handlesendsms = (id) => {
    setclickuser(id);
    navigate("/message");
  };
  return (
    <div className="MessageMain">
      <div className="MessageUser">
        <p id="Titlesms">MES AMI(E)S</p>
        <div className="filterUser">
          <input
            type="search"
            value={textsearch}
            name=""
            id=""
            placeholder="taper le nom de votre ami(e)..."
            onChange={handleChangeFilter}
          />
        </div>
        <div className="UserMain">
          {users.length > 0 ? (
            <>
              {" "}
              {users.map((p) => (
                <div
                  className={`userSelect ${
                    selectUser === p.id ? "active" : ""
                  }`}
                  onClick={() => {
                    handleselectuser(p.id);
                    handletoggle(p);
                  }}
                  key={p.id}
                >
                  <img src={p.image} alt="" />
                  <div className="userSelectText">
                    <p>{p.name}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {" "}
              <p style={{ textAlign: "center" }}>
                vous n'avez aucun ami(e)
              </p>{" "}
            </>
          )}
        </div>
      </div>

      <div className="MessageWritting">
        {showprofile ? (
          <div className="UserAwayDescription">
            <div className="MessageWrittingHeaders">
              <div className="UserAwayDescriptionHeader">
                <div className="ImageSmsHeader">
                  <img src={showprofile.image} alt="" />
                  <span></span>
                </div>
                <div className="UserAwayDescriptionHeaderName">
                  <p>{showprofile.name}</p>
                  <div className="SiderbarTops">
                    <div className="SiderbarTopOption">
                      <img
                        src={img}
                        alt=""
                        onClick={() => handlesendsms(showprofile.id)}
                      />
                    </div>
                    <p id="texthovers">Envoyer un message</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setshowoptionuserAway(!showoptionuserAway)}
                className="retourbtn"
              >
                {showoptionuserAway ? "replier" : "deplier"}
              </Button>
            </div>
            {showoptionuserAway && showprofile && (
              <div className="optionSentence">
                <p>
                  vous êtes ami(e)s avec {showprofile.name} depuis : mercredi 12
                  janvier 2022
                </p>
                <p>
                  dernier échange avec {showprofile.name}:mercredi 12 janvier
                  2022
                </p>
                <p>liste des medias échangés avec {showprofile.name}</p>
                <p onClick={() => setOpen(true)}>
                  supprimer {showprofile.name} de votre liste d'ami(e)s
                </p>
              </div>
            )}
          </div>
        ) : (
          <p id="searchAmity">allons à la recherche d'amitié 🌟</p>
        )}
        <div className="Amity">
          {usering.length > 0 && (
            <div className="AmityReceive">
              <p id="headerReceive">Demandes d'amitié en attente</p>
              <div className="UserMain">
                {usering.map((p) => (
                  <div
                    className={`userSelects ${
                      selectUsering === p.id ? "active" : ""
                    }`}
                    onClick={() => {
                      handleselectusering(p.id);
                    }}
                    key={p.id}
                  >
                    <div className="AmityReceiveUser">
                      <img src={p.image} alt="" />
                      <p>{p.name}</p>
                    </div>
                    <p>vous avez reçu une demande d'amitié</p>
                    <div className="AmityReceiveButton">
                      <Button
                        className="acceptbtn"
                        onClick={() => handlevalidate(p)}
                      >
                        valider
                      </Button>
                      <Button
                        className="rejectbtn"
                        onClick={() => handledelete(p.id)}
                      >
                        refuser
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="Amitysend">
            <p id="headerReceive">allons y rechercher des ami(e)s</p>
            <div className="filterUser">
              <input
                type="search"
                value={textsearching}
                name=""
                id=""
                placeholder="taper le nom d'une personne ..."
                onChange={handleChangeFiltering}
                style={{ height: "100px", width: "50%" }}
              />
            </div>
            <div className="UserMain">
              {newusers.map((p) => (
                <div
                  className={`userSelects ${
                    newselectUser === p.id ? "active" : ""
                  }`}
                  onClick={() => {
                    handlenewselectuser(p.id);
                  }}
                  key={p.id}
                >
                  <div className="AmityReceiveUser">
                    <img src={p.image} alt="" />
                    <p>{p.name}</p>
                  </div>
                  <p>envoyer une invitation d'amitié +</p>
                  {users.some((u) => u.id === p.id) ? (
                    <div className="AmityReceiveButton">
                      <Button className="retourbtn">vous êtes ami(e)s</Button>
                    </div>
                  ) : (
                    <div className="AmityReceiveButton">
                      {!btnask.includes(p.id) ? (
                        <Button
                          className="acceptbtn"
                          onClick={() => {
                            handlechoice(p.id);
                            handlechoices(p);
                          }}
                        >
                          envoyer demande d'amitié
                        </Button>
                      ) : (
                        <div className="AmityReceiveButton">
                          <Button className="retourbtn">
                            en attente de validation ...
                          </Button>
                          <Button
                            className="rejectbtn"
                            onClick={() => handlecancel(p.id)}
                          >
                            annuler demande d'amitié
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {open && showprofile && (
        <Dialog open={open} onClose={handleClose} className="customdialog">
          <DialogContent>
            <DialogContentText className="dialogtext">
              <p>voulez vous vraiment supprimer votre ami(e)s</p>
            </DialogContentText>
          </DialogContent>
          <DialogContent>
            <DialogContentText className="dialogtext">
              <img src={showprofile.image} alt="" />
              <p>{showprofile.name}</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="optionbtn">
            <Button onClick={handleClose} className="retourbtn">
              Retour
            </Button>
            <Button
              autoFocus
              className="rejectbtn"
              onClick={() => handledeleteuser(showprofile.id)}
            >
              confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Ami;
