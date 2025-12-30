import React, { useRef, useState } from "react";
import Button from "../containers/Button";
import "../styles/connexion.css";
import img from "../assets/logochat.png";
import pict from "../assets/pict.webp";
import { Link, useNavigate } from "react-router-dom";
const Inscription = () => {
  const navige = useNavigate();
  const [userData, setuserData] = useState({
    username: "",
    useremail: "",
    userpassword: "",
    userconfirmpassword: "",
    userphoto: null,
  });
  const refphoto = useRef(null);
  const [picture, setpicture] = useState(null);
  const [error, seterror] = useState("");
  const [errorcdt, seterrorcdt] = useState(null);
  const handleselectpicture = () => {
    refphoto.current.click();
  };
  const [verify, setverify] = useState([
    { id: "1", texte: "au moins 8 caracteres" },
    { id: "2", texte: "au moins 1 chiffre" },
    { id: "3", texte: "au moins 1 majuscule" },
    { id: "4", texte: "au moins 1 minuscule" },
    { id: "5", texte: "au moins 1 symbole" },
  ]);
  const handleChangeUser = (e) => {
    const { name, value, files } = e.target;
    setuserData({ ...userData, [name]: value });

    if (name === "userphoto") {
      const file = files[0];
      if (file) {
        setuserData((prev) => ({ ...prev, userphoto: file }));
        setpicture(URL.createObjectURL(file));
      } else {
        setuserData((prev) => ({ ...prev, [name]: value }));
      }
    }
    if (name === "userpassword") {
      seterrorcdt(value.trim().length > 0);
    }
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    if (
      !userData.username ||
      !userData.userpassword ||
      !userData.useremail ||
      !userData.userconfirmpassword
    ) {
      seterror("Veuillez remplir tous les champs");
      return;
    }
    if (userData.userpassword !== userData.userconfirmpassword) {
      seterror("Les mots de passe ne correspondent pas");
      return;
    }
    const pass = userData.userpassword;
    const check = {
      longueur: pass.length >= 8,
      chiffre: /\d/.test(pass),
      maj: /[A-Z]/.test(pass),
      min: /[a-z]/.test(pass),
      symbole: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    if (!Object.values(check).every((p) => p)) {
      seterror("le mot de passe ne respecte pas toutes les conditions");
      return;
    }

    seterror("Inscription reussie");
    console.log(userData);
    navige("/message");

    setpicture(null);
    setuserData({
      username: "",
      userpassword: "",
      useremail: "",
      userphoto: null,
      userconfirmpassword: "",
    });
  };
  const checkpassword = (password) => {
    const dimi = userData.userpassword;
    if (password.id === "1") {
      return dimi.trim().length >= 8;
    }
    if (password.id === "2") {
      return /\d/.test(dimi);
    }
    if (password.id === "3") {
      return /[A-Z]/.test(dimi);
    }
    if (password.id === "4") {
      return /[a-z]/.test(dimi);
    }
    if (password.id === "5") {
      return /[!@#$%^&*(),.?":{}|<>]/.test(dimi);
    } else {
      return false;
    }
  };
  return (
    <div className="headerConnect">
      <div className="MainConnect">
        <p
          id="erreur"
          style={{ color: error === "Inscription reussie" ? "green" : "red" }}
        >
          {error}{" "}
        </p>
        <div className="mainConnectLogo">
          <img src={img} alt="" />
          <h4>
            Inscription <span>sim'sChat</span>
          </h4>
        </div>

        <form onSubmit={handlesubmit}>
          <div className="MainConnectTitle">
            <img src={picture || pict} alt="" onClick={handleselectpicture} />

            <input
              type="file"
              name="userphoto"
              onChange={handleChangeUser}
              ref={refphoto}
              style={{ display: "none" }}
            />
          </div>
          <div className="MainConnectTitle">
            <p>Nom d'utilisateur</p>
            <input
              type="text"
              name="username"
              value={userData.username}
              placeholder="entrer votre nom"
              onChange={handleChangeUser}
            />
          </div>
          <div className="MainConnectTitle">
            <p>Email d'utilisateur</p>
            <input
              type="email"
              name="useremail"
              value={userData.useremail}
              placeholder="entrer votre email"
              onChange={handleChangeUser}
            />
          </div>

          <div className="MainConnectTitle">
            <p>Mot de passe d'utilisateur</p>
            <input
              type="password"
              name="userpassword"
              value={userData.userpassword}
              onChange={handleChangeUser}
              placeholder="entrer votre mot de passe"
            />
          </div>
          <div className="MainConnectTitle">
            <p> Confirmer mot de passe d'utilisateur</p>
            <input
              type="password"
              name="userconfirmpassword"
              value={userData.userconfirmpassword}
              onChange={handleChangeUser}
              placeholder="confirmer votre mot de passe"
            />
          </div>
          {errorcdt && (
            <div className="MainConnectTitle">
              <p> conditions mot de passe :</p>
              {verify.map((p) => (
                <div
                  className=""
                  key={p.id}
                  style={{
                    display: "flex",
                    gap: "10px",
                    color: checkpassword(p) ? "green" : "red",
                  }}
                >
                  <span>{checkpassword(p) ? "✅" : "❌"} </span>
                  <p>{p.texte}</p>
                </div>
              ))}
            </div>
          )}
          <div className="btnConnect">
            <Button className="retourbtn" type="submit">
              Inscription
            </Button>
          </div>
        </form>
        <div className="linkconnexion">
          <p>
            vous avez un compte ? <Link to="/">veuillez vous connecter</Link>{" "}
          </p>

          <p>
            vous avez oubliez votre mot de passe ?{" "}
            <Link to="/forgetpassword">
              vous avez oubliez votre mot de passe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
