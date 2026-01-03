import React from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ConfirmAccount = () => {
  const hasValidated = useRef(false);

  const { token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token || hasValidated.current) return;

    hasValidated.current = true;

    const validate = async () => {
      try {
        await axios.get(`http://localhost:5000/user/validate/${token}`);
        toast.success("Compte activé avec succès !");
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        const msg = error.response?.data?.message;

        if (msg === "compte deja validé") {
          toast.info("Compte déjà activé, vous pouvez vous connecter");
          navigate("/");
        } else {
          toast.error("Lien invalide ou expiré");
        }
      }
    };

    validate();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Validation en cours...</h2>
      <p>veuillez vérifier votre boite mail</p>
      <p>Veuillez patienter</p>
    </div>
  );
};

export default ConfirmAccount;
