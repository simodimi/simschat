import React, { useState } from "react";
import Button from "../containers/Button";
import "../styles/connexion.css";
import img from "../assets/logochat.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../pages/AuthContextUser";

const Connexion = () => {
  const navige = useNavigate();
  const { login, user } = useAuth();
  const [userData, setuserData] = useState({
    useremail: "",
    userpassword: "",
  });
  const [error, seterror] = useState("");
  const handleChangeUser = (e) => {
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!userData.useremail || !userData.userpassword) {
      seterror("Veuillez remplir tous les champs");
      return;
    }
    try {
      await login(userData.useremail, userData.userpassword);
      navige("/message");
      seterror("");
      setuserData({ useremail: "", userpassword: "" });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Erreur de connexion";
      seterror(errorMessage);
    }
  };
  return (
    <div className="headerConnect">
      <div className="MainConnect">
        <p
          id="erreur"
          style={{ color: error === "Connexion reussie" ? "green" : "red" }}
        >
          {error}{" "}
        </p>
        <div className="mainConnectLogo">
          <img src={img} alt="" />
          <h4>
            Connexion <span>sim'sChat</span>
          </h4>
        </div>

        <form onSubmit={handlesubmit}>
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
          <div className="btnConnect">
            <Button className="retourbtn" type="submit">
              Connexion
            </Button>
          </div>
        </form>
        <div className="linkconnexion">
          <p>
            vous n'avez pas de compte ?{" "}
            <Link to="/inscription">veuillez vous s'inscrire</Link>{" "}
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

export default Connexion;
