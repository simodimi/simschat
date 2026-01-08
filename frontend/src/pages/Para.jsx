import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../pages/AuthContextUser.jsx";

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
  const { user, setuser, logout } = useAuth();
  const [disabling, setdisabling] = useState(false);
  const dating = Date.now() + "" + Math.random().toString(36).substring(2, 9);
  const [changepicture, setchangepicture] = useState({
    id: dating,
    photoUser: null,
    nameUser: `${user.username}`,
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
    const { name, value, files } = e.target;

    if (name === "photoUser") {
      const file = files[0];
      if (file) {
        setchangepicture((prev) => ({
          ...prev,
          photoUser: file, // ← vrai fichier
        }));
        setpicture(URL.createObjectURL(file));
      }
    } else {
      setchangepicture((prev) => ({
        ...prev,
        [name]: value,
      }));
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
    setdisabling(true);
    setTimeout(() => {
      reftexte.current?.focus();
    }, 0);
  };

  const handlesavepicture = () => {
    if (reftexte.current) {
      setchangepicture({ ...changepicture, nameUser: reftexte.current.value });
      toast.success(`nom modifié ${reftexte.current.value}`);
      setdisabling(false);
    }
  };
  const handlesavepassword = async () => {
    const pass = changepicture.newpasswordUser;
    const check = {
      longueur: pass.length >= 8,
      chiffre: /\d/.test(pass),
      maj: /[A-Z]/.test(pass),
      min: /[a-z]/.test(pass),
      symbole: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    if (!Object.values(check).every((p) => p)) {
      toast.error(
        "le mot de passe ne respecte pas toutes les conditions,8 caractères,1 majuscule,1 minuscule,1 chiffre,1 symbole"
      );
      return;
    }
    if (!changepicture.newpasswordUser || !changepicture.passwordUser) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success("Mot de passe modifié avec succès");
    /*  try {
      await axios.put(
        `http://localhost:5000/user/${user.iduser}/password`,
        {
          currentPassword: changepicture.passwordUser,
          newPassword: changepicture.newpasswordUser,
        },
        { withCredentials: true }
      );

      toast.success("Mot de passe modifié avec succès");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du changement de mot de passe"
      );
    }*/
  };
  const handlesubmit1 = async (e) => {
    e.preventDefault();
    try {
      if (changepicture.newpasswordUser) {
        const pass = changepicture.newpasswordUser;
        const check = {
          longueur: pass.length >= 8,
          chiffre: /\d/.test(pass),
          maj: /[A-Z]/.test(pass),
          min: /[a-z]/.test(pass),
          symbole: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
        };
        if (!Object.values(check).every((p) => p)) {
          toast.error(
            "le mot de passe ne respecte pas toutes les conditions,8 caractères,1 majuscule,1 minuscule,1 chiffre,1 symbole"
          );
          return;
        }
        await axios.put(
          `http://localhost:5000/user/${user.iduser}/password`,
          {
            currentPassword: changepicture.passwordUser,
            newPassword: changepicture.newpasswordUser,
          },
          { withCredentials: true }
        );

        toast.success("Mot de passe modifié avec succès");
      }
      const formData = new FormData();
      if (changepicture.photoUser) {
        formData.append("userphoto", changepicture.photoUser);
      }
      if (changepicture.nameUser) {
        formData.append("username", changepicture.nameUser);
      }
      const res = await axios.put(
        `http://localhost:5000/user/${user.iduser}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setuser((prev) => ({ ...prev, ...res.data.user }));
      toast.success("Profil mis à jour avec succès");
      handlenavigate();
      setchangepicture({
        passwordUser: "",
        newpasswordUser: "",
      });
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  /*const handlesubmitbk = (e) => {
    e.preventDefault();
    setchangepicturebk({ ...changepicturebk, photoUserbk: picturebk });
    setchoicebk(picturebk);
    handlenavigate();
  };*/
  const handlesubmitbk = async (e) => {
    e.preventDefault();

    if (!refphotobk.current.files[0]) {
      toast.error("Aucune image sélectionnée");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("background", refphotobk.current.files[0]);

      const res = await axios.put(
        `http://localhost:5000/user/${user.iduser}/background`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setchoicebk(res.data.background_image);
      toast.success("Fond d'écran sauvegardé");
      handlenavigate();
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(err);
    }
  };
  useEffect(() => {
    if (user?.background_image) {
      setchoicebk(user.background_image);
    }
  }, [user]);
  const handledefaultbk = async () => {
    await axios.delete(`http://localhost:5000/user/${user.iduser}/background`, {
      withCredentials: true,
    });
    setchoicebk(null);
  };
  const handlelogin = () => {
    logout();
    handlenavigate("/");
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlenight = () => {
    setnight(!night);
  };
  const handledelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/user/${user.iduser}`, {
        withCredentials: true,
      });
      await logout();
      handlenavigate("/");
    } catch (error) {
      console.error(error);
    }
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
          {para0 && <p>hello {user.username},tu vas bien 😎</p>}
          {para1 && <p onClick={handlepara1}>Changer votre profil?</p>}
          {para2 && <p onClick={handlepara2}>vous voulez vous deconnecter</p>}
          {para3 && <p onClick={handlepara3}>supprimer votre compte</p>}
          {para4 && <p onClick={handlepara4}>En savoir plus sur sim'sChat</p>}
          {para5 && (
            <p onClick={handlepara5}>Changer background des messages</p>
          )}
        </div>
        {paraopt1 && (
          <form onSubmit={handlesubmit1}>
            <div className="paraChangePicture">
              <div className="headerChangePicture">
                <p>Changer votre photo de profil</p>
                <div className="changePicturepara" onClick={handlenewpicture}>
                  <span>cliquer pour ajouter une photo</span>
                  <img src={plus} alt="" />
                  {changepicture.photoUser && (
                    <div
                      className="newpicture"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {picture ? (
                        <img src={picture} alt="" />
                      ) : (
                        <img src={`${user.userphoto}`} alt="" />
                      )}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={refphoto}
                  name="photoUser"
                  onChange={handleChangePicture}
                  style={{ display: "none" }}
                />
                {changepicture.photoUser?.length > 0 && (
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
                  disabled={!disabling}
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
                <p>mot de passe actuel</p>
                <input
                  type="password"
                  maxLength={50}
                  value={changepicture.passwordUser}
                  name="passwordUser"
                  id="textpicture"
                  onChange={handleChangePicture}
                />
                <p>nouveau mot de passe</p>
                <input
                  type="password"
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
                      {picturebk ? (
                        <img src={picturebk} alt="" />
                      ) : (
                        <img src={`${user.background_image}`} alt="" />
                      )}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={refphotobk}
                  name="background"
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
            <Button autoFocus className="rejectbtn" onClick={handledelete}>
              confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Para;
