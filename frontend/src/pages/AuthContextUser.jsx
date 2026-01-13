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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProviderUser = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const verifyToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/check-token", {
        withCredentials: true,
      });

      if (res.data?.valid) {
        setuser(res.data.user);
      } else {
        setuser(null);
      }
    } catch (error) {
      setuser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (!user?.iduser) return;

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
        query: { userId: user.iduser },
      });
    }
  }, [user?.iduser]);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/user/login", {
      useremail: email,
      userpassword: password,
    });

    setuser(res.data);
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
      {children}
    </AuthContextUser.Provider>
  );
};

export const getSocket = () => socketRef.current;
