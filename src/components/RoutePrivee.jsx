import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Composant RoutePrivee (Higher-Order Component / Wrapper)
 * 
 * Sédimente et sécurise les accès aux routes privées de l'application.
 * Il vérifie la présence d'une session utilisateur active avant d'autoriser 
 * le rendu du contenu protégé (<Outlet /> ou composants enfants).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Le composant protégé à rendre si authentifié
 */

export const RoutePrivee = ({ children }) => {

  // --- ÉTAT D'AUTHENTIFICATION ---
  // Récupération de l'utilisateur courant depuis le contexte global

  const { utilisateur } = useContext(AuthContext);

  // --- VÉRIFICATION D'ACCÈS ---
  // Si aucun utilisateur n'est présent en session, interdiction d'accès.
  // Redirection immédiate vers la page de connexion ("/connexion").
  // L'option `replace` remplace la route actuelle dans l'historique pour éviter 
  // que l'utilisateur ne puisse revenir en arrière avec le bouton du navigateur.

  if (!utilisateur) {
    return <Navigate to="/connexion" replace />;
  }

  // --- AUTORISATION ---
  // L'utilisateur est authentifié, on affiche le contenu protégé
  
  return children;
};
