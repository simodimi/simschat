import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import img from "../assets/logochat.png";
import pict from "../assets/pict.webp";
import "../styles/connexion.css";
import { useState } from "react";
import Button from "../containers/Button";
import { Link, useNavigate } from "react-router-dom";

const Forgetpassword = () => {
  const steps = ["email", "valider code", "changer mot de passe"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [error, seterror] = useState("");
  const [errorcdt, seterrorcdt] = useState(null);
  const navige = useNavigate();
  const [userData, setuserData] = useState({
    usercode: "",
    useremail: "",
    userpassword: "",
  });
  const [verify, setverify] = useState([
    { id: "1", texte: "au moins 8 caracteres" },
    { id: "2", texte: "au moins 1 chiffre" },
    { id: "3", texte: "au moins 1 majuscule" },
    { id: "4", texte: "au moins 1 minuscule" },
    { id: "5", texte: "au moins 1 symbole" },
  ]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userData.useremail) {
        seterror("Veuillez remplir tous les champs");
        return;
      }
      if (!emailRegex.test(userData.useremail)) {
        seterror("Veuillez entrer une adresse email valide");
        return;
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      seterror("");
    }
    if (activeStep === 1) {
      if (!userData.usercode) {
        seterror("Veuillez remplir tous les champs");
        return;
      }
      if (userData.usercode.trim().length !== 6) {
        seterror("Veuillez entrer un code de 6 chiffres");
        return;
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      seterror("");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    seterror("");
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  const handlesubmit = (e) => {
    e.preventDefault();
  };
  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setuserData({ ...userData, [name]: value });

    if (name === "userpassword") {
      seterrorcdt(value.trim().length > 0);
    }
  };
  const checkpass = (p) => {
    const dimi = userData.userpassword;
    if (p.id === "1") {
      return dimi.trim().length >= 8;
    }
    if (p.id === "2") {
      return /\d/.test(dimi);
    }
    if (p.id === "3") {
      return /[A-Z]/.test(dimi);
    }
    if (p.id === "4") {
      return /[a-z]/.test(dimi);
    }
    if (p.id === "5") {
      return /[!@#$%^&*(),.?":{}|<>]/.test(dimi);
    } else {
      return false;
    }
  };
  const handleconfirm = () => {
    if (activeStep === 2) {
      if (!userData.userpassword) {
        seterror("Veuillez remplir tous les champs");
        return;
      }
      const pass = userData.userpassword;
      const check = {
        longueur: pass.trim().length >= 8,
        chiffre: /\d/.test(pass),
        maj: /[A-Z]/.test(pass),
        min: /[a-z]/.test(pass),
        symbole: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      };
      if (!Object.values(check).every((p) => p)) {
        seterror("le mot de passe ne respecte pas toutes les conditions");
        return;
      }
      console.log(userData);
      navige("/");
      setActiveStep(0);
      setuserData({});
      seterror("");
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
            Mot de passe oublié <span>sim'sChat</span>
          </h4>
        </div>

        <form onSubmit={handlesubmit}>
          <Box sx={{ width: "100%" }}>
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div>
              <React.Fragment>
                <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
                  {activeStep === 0 && (
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
                  )}
                  {activeStep === 1 && (
                    <div className="MainConnectTitle">
                      <p>Code de validation</p>
                      <span id="spantexte">
                        Veuillez consulter votre boite mail
                      </span>
                      <input
                        type="number"
                        max={6}
                        name="usercode"
                        value={userData.usercode}
                        placeholder="entrer le code de validation"
                        onChange={handleChangeUser}
                      />
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className="MainConnectTitle">
                      <p>Nouveau mot de passe</p>
                      <input
                        type="password"
                        name="userpassword"
                        value={userData.userpassword}
                        placeholder="entrer votre mot de passe"
                        onChange={handleChangeUser}
                      />
                      {errorcdt && (
                        <div className="MainConnectTitle">
                          <p> conditions mot de passe :</p>
                          {verify.map((p) => (
                            <div
                              className=""
                              key={p.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",

                                color: checkpass(p) ? "green" : "red",
                              }}
                            >
                              <span>{checkpass(p) ? "✅" : "❌"}</span>
                              <p>{p.texte}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="buttonstepper">
                    <Button
                      className="retourbtn"
                      style={{ display: activeStep === 0 ? "none" : "block" }}
                      onClick={handleBack}
                    >
                      Retour
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep === steps.length - 1 ? (
                      <Button
                        className="acceptbtn"
                        type="submit"
                        sx={{ mr: 1 }}
                        onClick={handleconfirm}
                      >
                        Confirmer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="acceptbtn"
                        sx={{ mr: 1 }}
                      >
                        Suivant
                      </Button>
                    )}
                  </div>
                </Box>
              </React.Fragment>
            </div>
            <div className="linkconnexion">
              <p>
                vous avez un compte ?{" "}
                <Link to="/">veuillez vous connecter</Link>{" "}
              </p>

              <p>
                vous n'avez pas de compte ?{" "}
                <Link to="/inscription">veuillez vous s'inscrire</Link>{" "}
              </p>
            </div>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default Forgetpassword;
