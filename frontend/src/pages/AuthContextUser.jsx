import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

let socketRef = { current: null };

const AuthContextUser = createContext();

export const useAuth = () => {
  const context = useContext(AuthContextUser);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProviderUser");
  }
  return context;
};

export const AuthProviderUser = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  //charger l'user depuis la BDD
  const fetchMe = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/me", {
        withCredentials: true,
      });

      setuser(res.data); // user complet(photo etc) depuis la BDD
    } catch (err) {
      setuser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (!user?.iduser) return;

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
        query: { userId: user.iduser },
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.iduser]);

  const login = async (email, password) => {
    const res = await axios.post(
      "http://localhost:5000/user/login",
      {
        useremail: email,
        userpassword: password,
      },
      { withCredentials: true }
    );

    setuser(res.data); // ✅ user BDD direct
    toast.success(`Connexion réussie ${res.data.username}`);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/user/logout",
        {},
        { withCredentials: true }
      );
    } finally {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setuser(null);
      navigate("/");
    }
  };

  return (
    <AuthContextUser.Provider
      value={{
        user,
        setuser,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContextUser.Provider>
  );
};

export const getSocket = () => socketRef.current;
