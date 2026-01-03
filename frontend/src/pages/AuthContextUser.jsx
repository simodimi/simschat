import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContextUser = createContext();
export const useAuth = () => {
  const context = useContext(AuthContextUser);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProviderUser = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Config axios pour envoyer les cookies (httpOnly)
  axios.defaults.withCredentials = true;

  // Vérifie la session sur le backend
  const verifyToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/check-token", {
        withCredentials: true,
      });
      if (res.data?.valid) setuser(res.data.user);
      else setuser(null);
    } catch (error) {
      console.error("Erreur de vérification du token", error);
      setuser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // Connexion → backend place le cookie httpOnly
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        useremail: email,
        userpassword: password,
      });

      setuser(res.data);
      toast.success(`Connexion réussie ${res.data.username}`);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Erreur de connexion";
      toast.error(msg);
      throw error;
    }
  };

  // Déconnexion → suppression du cookie serveur
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/user/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erreur de logout", error);
    } finally {
      setuser(null);
      navigate("/");
    }
  };

  return (
    <AuthContextUser.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContextUser.Provider>
  );
};
