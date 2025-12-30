import React, { useRef, useState } from "react";
import "../styles/parametre.css";
import { useNavigate } from "react-router-dom";
import Button from "../containers/Button.jsx";
import plus from "../assets/background/plus.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import on from "../assets/onlight.jpg";
import off from "../assets/offlight.jpg";
import Box from "@mui/material/Box";

const Para = ({ setchoicebk }) => {
  const refphoto = useRef(null);
  const refphotobk = useRef(null);
  const [para0, setpara0] = useState(true);
  const [para1, setpara1] = useState(true);
  const [para2, setpara2] = useState(true);
  const [para3, setpara3] = useState(true);
  const [para4, setpara4] = useState(true);
  const [para5, setpara5] = useState(true);
  const [para6, setpara6] = useState(true);
  const [paraopt1, setparaopt1] = useState(false);
  const [paraopt2, setparaopt2] = useState(false);
  const [paraopt3, setparaopt3] = useState(false);
  const [paraopt4, setparaopt4] = useState(false);
  const [paraopt5, setparaopt5] = useState(false);
  const [paraopt6, setparaopt6] = useState(false);
  const dating = Date.now() + "" + Math.random().toString(36).substring(2, 9);
  const [changepicture, setchangepicture] = useState({
    id: dating,
    photoUser: "",
    nameUser: "dimitri",
    passwordUser: "",
    newpasswordUser: "",
  });
  const [picture, setpicture] = useState(null);
  const [picturebk, setpicturebk] = useState(null);
  const [changepicturebk, setchangepicturebk] = useState("");
  const reftexte = useRef(null);
  const [open, setOpen] = useState(false);
  const [night, setnight] = useState(false);
  const handlenavigate = () => {
    setpara1(true);
    setparaopt1(false);
    setparaopt2(false);
    setparaopt3(false);
    setparaopt4(false);
    setparaopt5(false);
    setparaopt6(false);
    setpara0(true);
    setpara2(true);
    setpara3(true);
    setpara4(true);
    setpara5(true);
    setpara6(true);
  };
  const handlepara1 = () => {
    setpara1(true);
    setparaopt1(true);
    setparaopt2(false);
    setparaopt3(false);
    setparaopt4(false);
    setparaopt5(false);
    setparaopt6(false);
    setpara0(false);
    setpara2(false);
    setpara3(false);
    setpara4(false);
    setpara5(false);
    setpara6(false);
  };
  const handlepara2 = () => {
    setpara1(false);
    setparaopt1(false);
    setparaopt2(true);
    setparaopt3(false);
    setparaopt4(false);
    setparaopt5(false);
    setparaopt6(false);
    setpara0(false);
    setpara2(true);
    setpara3(false);
    setpara4(false);
    setpara5(false);
    setpara6(false);
  };
  const handlepara3 = () => {
    setpara1(false);
    setparaopt1(false);
    setparaopt2(false);
    setparaopt3(true);
    setparaopt4(false);
    setparaopt5(false);
    setparaopt6(false);
    setpara0(false);
    setpara2(false);
    setpara3(true);
    setpara4(false);
    setpara5(false);
    setpara6(false);
  };
  const handlepara4 = () => {
    setpara1(false);
    setparaopt1(false);
    setparaopt2(false);
    setparaopt3(false);
    setparaopt4(true);
    setparaopt5(false);
    setparaopt6(false);
    setpara0(false);
    setpara2(false);
    setpara3(false);
    setpara4(true);
    setpara5(false);
    setpara6(false);
  };
  const handlepara5 = () => {
    setpara1(false);
    setparaopt1(false);
    setparaopt2(false);
    setparaopt3(false);
    setparaopt4(false);
    setparaopt5(true);
    setparaopt6(false);
    setpara0(false);
    setpara2(false);
    setpara3(false);
    setpara4(false);
    setpara5(true);
    setpara6(false);
  };
  const handlepara6 = () => {
    setpara1(false);
    setparaopt1(false);
    setparaopt2(false);
    setparaopt3(false);
    setparaopt4(false);
    setparaopt5(false);
    setparaopt6(true);
    setpara0(false);
    setpara2(false);
    setpara3(false);
    setpara4(false);
    setpara5(false);
    setpara6(true);
  };
  const handlenewpicture = () => {
    refphoto.current.click();
  };
  const handlenewpicturebk = () => {
    refphotobk.current.click();
  };
  const handleChangePicture = (e) => {
    const { name, value } = e.target;
    setchangepicture({ ...changepicture, [name]: value });
    //image
    if (name === "photoUser") {
      const file = e.target.files[0];
      if (file) {
        setpicture(URL.createObjectURL(file));
      }
    }
  };
  const handleChangePicturebk = (e) => {
    //image

    const file = e.target.files[0];
    if (file) {
      setchangepicturebk(file.name);
      setpicturebk(URL.createObjectURL(file));
    }
  };
  const handledeletepicture = () => {
    setpicture(null);
    setchangepicture({ ...changepicture, photoUser: "" });
  };
  const handledeletepicturebk = () => {
    setpicturebk(null);
    setchangepicturebk("");
  };
  const handlemodifyname = () => {
    reftexte.current.focus();
  };
  const handlesavepicture = () => {
    if (reftexte.current) {
      setchangepicture({ ...changepicture, nameUser: reftexte.current.value });
      alert(changepicture.nameUser);
    }
  };
  const handlesavepassword = () => {
    setchangepicture({
      ...changepicture,
      passwordUser: changepicture.passwordUser,
      newpasswordUser: changepicture.newpasswordUser,
    });
  };
  const handlesubmit1 = (e) => {
    e.preventDefault();
    setchangepicture({
      ...changepicture,
      photoUser: picture,
      nameUser: reftexte.current.value,
      passwordUser: changepicture.passwordUser,
      newpasswordUser: changepicture.newpasswordUser,
    });
    console.log(changepicture);
    handlenavigate();
  };
  const handlesubmitbk = (e) => {
    e.preventDefault();
    setchangepicturebk({ ...changepicturebk, photoUserbk: picturebk });
    setchoicebk(picturebk);
    handlenavigate();
  };
  const handledefaultbk = () => {
    setchoicebk(null);
  };
  const handlelogin = () => {
    alert("vous voulez vous deconnecter");
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlenight = () => {
    setnight(!night);
  };
  return (
    <div className="headerpara">
      {!para0 && (
        <div className="btnretour">
          <Button className="retourbtn" onClick={handlenavigate}>
            retour
          </Button>
        </div>
      )}
      <div className="headerparachoice">
        <div className="parachoice">
          {para0 && <p>hello dimitri,tu vas bien 😎</p>}
          {para1 && <p onClick={handlepara1}>Changer votre profil?</p>}
          {para2 && <p onClick={handlepara2}>vous voulez vous deconnecter</p>}
          {para3 && <p onClick={handlepara3}>supprimer votre compte</p>}
          {para4 && <p onClick={handlepara4}>En savoir plus sur sim'sChat</p>}
          {para5 && (
            <p onClick={handlepara5}>Changer background des messages</p>
          )}
          {!para6 && <p onClick={handlepara6}>activer mode sombre</p>}
        </div>
        {paraopt1 && (
          <form onSubmit={handlesubmit1}>
            <div className="paraChangePicture">
              <div className="headerChangePicture">
                <p>Changer votre photo de profil</p>
                <div className="changePicturepara" onClick={handlenewpicture}>
                  <span>cliquer pour ajouter une photo</span>
                  <img src={plus} alt="" />
                  {changepicture.photoUser.length > 0 && (
                    <div
                      className="newpicture"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={picture} alt="" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={refphoto}
                  name="photoUser"
                  value={changepicture.photoUser}
                  onChange={handleChangePicture}
                  style={{ display: "none" }}
                />
                {changepicture.photoUser.length > 0 && (
                  <div className="pictureparabtn">
                    <Button className="retourbtn" onClick={handlenewpicture}>
                      changer la photo
                    </Button>
                    <Button className="rejectbtn" onClick={handledeletepicture}>
                      supprimer la photo
                    </Button>
                  </div>
                )}
              </div>
              <div className="headerChangePicture">
                <p>modifier votre nom</p>
                <input
                  type="text"
                  maxLength={40}
                  value={changepicture.nameUser}
                  name="nameUser"
                  id="textpicture"
                  ref={reftexte}
                  onChange={handleChangePicture}
                />
                {changepicture.nameUser.length > 0 && (
                  <div className="pictureparabtn">
                    <Button className="retourbtn" onClick={handlemodifyname}>
                      modifier le nom
                    </Button>
                    <Button className="acceptbtn" onClick={handlesavepicture}>
                      valider
                    </Button>
                  </div>
                )}
              </div>
              <div className="headerChangePicture">
                <p>modifier votre mot de passe</p>
                <p>mot de passe actuelle</p>
                <input
                  type="text"
                  maxLength={50}
                  value={changepicture.passwordUser}
                  name="passwordUser"
                  id="textpicture"
                  onChange={handleChangePicture}
                />
                <p>nouveau mot de passe</p>
                <input
                  type="text"
                  maxLength={50}
                  value={changepicture.newpasswordUser}
                  name="newpasswordUser"
                  id="textpicture"
                  onChange={handleChangePicture}
                />
                <div className="pictureparabtn">
                  <Button className="acceptbtn" onClick={handlesavepassword}>
                    valider
                  </Button>
                </div>
              </div>
              <div className="">
                <Button type="submit" className="acceptbtn">
                  Sauvergarder
                </Button>
              </div>
            </div>
          </form>
        )}
        {paraopt2 && (
          <div className="paraChangePicture">
            <div className="headerChangePicture">
              <p> Dimitri,vous voulez vous deconnecter?</p>
              <div className="pictureparabtn">
                <Button className="retourbtn" onClick={handlenavigate}>
                  non
                </Button>
                <Button className="rejectbtn" onClick={handlelogin}>
                  oui
                </Button>
              </div>
            </div>
          </div>
        )}
        {paraopt3 && (
          <div className="paraChangePicture">
            <div className="headerChangePicture">
              <p> Dimitri,vous voulez supprimer votre compte?</p>
              <div className="pictureparabtn">
                <Button className="retourbtn" onClick={handlenavigate}>
                  non
                </Button>
                <Button className="rejectbtn" onClick={() => setOpen(true)}>
                  oui
                </Button>
              </div>
            </div>
          </div>
        )}
        {paraopt4 && (
          <div className="paraChangePicture">
            <div className="headerChangePicture">
              <p>
                Sim'sChat : Bien plus qu'une simple application de messagerie
              </p>
              <p>
                {" "}
                Sim'sChat a été créé avec une ambition simple mais profonde :
                redéfinir la façon dont les gens communiquent en ligne. Nous
                croyons que chaque conversation mérite un espace sécurisé,
                intuitif et enrichissant. Plus qu'un simple outil de messagerie,
                Sim'sChat est un écosystème social complet où vos relations
                numériques prennent vie.
              </p>
              <p>Nos Fonctionnalités Phares</p>

              <p>
                <li>Chat Intelligent</li>
                <li>Messages en temps réel</li>
                <li>Discutez sans délai avec vos proches</li>
                <li>Multimédia enrichi: Photos, vidéos, fichiers</li>
                <li>
                  Retrouvez instantanément n'importe quel message, photo ou
                  fichier
                </li>
              </p>
            </div>
          </div>
        )}
        {paraopt5 && (
          <form onSubmit={handlesubmitbk}>
            <div className="paraChangePicture">
              <div className="headerChangePicture">
                <p>Changer votre fond d'ecran des messages</p>
                <div className="changePicturepara" onClick={handlenewpicturebk}>
                  <span>cliquer pour ajouter une photo</span>
                  <img src={plus} alt="" />
                  {changepicturebk && (
                    <div
                      className="newpicture"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={picturebk} alt="" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={refphotobk}
                  onChange={handleChangePicturebk}
                  style={{ display: "none" }}
                />
                {changepicturebk && (
                  <div className="pictureparabtn">
                    <Button className="retourbtn" onClick={handlenewpicturebk}>
                      changer la photo
                    </Button>
                    <Button
                      className="rejectbtn"
                      onClick={handledeletepicturebk}
                    >
                      supprimer la photo
                    </Button>
                  </div>
                )}
                <div className="pictureparabtn">
                  <Button className="retourbtn" onClick={handledefaultbk}>
                    par defaut
                  </Button>
                </div>
              </div>
              <div className="">
                <Button type="submit" className="acceptbtn">
                  Sauvergarder
                </Button>
              </div>
            </div>
          </form>
        )}
        {/*paraopt6 && (
          <form onSubmit={handlesubmitbk}>
            <div className="paraChangePicture">
              <div className="headerChangePicture">
                <p>Changer votre mode d'affichage</p>
                <div className="changePicturepara">
                  {night ? (
                    <img
                      src={off}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={on}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div className="pictureparabtn">
                  <Button className="retourbtn" onClick={handlenight}>
                    {night ? "passer en mode jour" : "passer en mode nuit"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )*/}
      </div>
      {open && (
        <Dialog open={open} onClose={handleClose} className="customdialog">
          <DialogContent>
            <DialogContentText className="dialogtext">
              <p>voulez vous vraiment supprimer votre compte 🥲</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="optionbtn">
            <Button onClick={handleClose} className="retourbtn">
              Retour
            </Button>
            <Button autoFocus className="rejectbtn" onClick={handlelogin}>
              confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Para;
