import React from "react";
import { useAuth } from "../pages/AuthContextUser";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ProtectedRouteUser = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Veuillez vous connecter pour continuer.", {
        toastId: "auth-error",
      });
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="loading-container">
        <div>Vérification de la session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRouteUser;
