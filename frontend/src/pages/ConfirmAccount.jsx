import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ConfirmAccount = () => {
  const { token } = useParams(); //recuperer le token de l'url
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  useEffect(() => {
    const confirm = async () => {
      try {
        await axios.post(`http://localhost:5000/auth/confirm/${token}`);
        //rediriger vers la page de connexion
        setTimeout(() => {
          navigate("/message", { replace: true });
        }, 1500);
      } catch (error) {
        setError("lien expire");
      }
    };

    confirm();
  }, [token, navigate]);
  if (error) {
    return <div>{error}</div>;
  }
  return <div>Confirmationdu compte en cours...</div>;
};

export default ConfirmAccount;
