import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const RoutePrivee = ({ children }) => {
  const { utilisateur } = useContext(AuthContext);

  // Sans utilisateur en session, aucune page privee ne doit etre rendue.
  if (!utilisateur) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
};