import React from "react";
import { useAuth } from "../pages/AuthContextUser";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ProtectedRouteUser = ({ children }) => {
  const { isAuthenticated, loading, verifyToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Re-vérifier le token à chaque navigation protégée

    verifyToken();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="loading-container">
        <div>Vérification de la session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour continuer.", {
      toastId: "auth-error", //evite les doublons
    });
    // Rediriger vers la page de connexion

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRouteUser;
