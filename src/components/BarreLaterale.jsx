import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/**
 * Composant BarreLaterale (Sidebar)
 * Requis pour toutes les pages protégées de l'application.
 * Contient la navigation principale, l'affichage de l'utilisateur,
 * le sélecteur de thème et l'action de déconnexion.
 */
export const BarreLaterale = () => {
  // --- ÉTATS & CONTEXTES ---
  // Gestion de la session utilisateur (données + méthode de déconnexion)
  const { deconnexion, utilisateur } = useContext(AuthContext);

  // Gestion du thème visuel (clair / sombre)
  const { theme, basculerTheme } = useTheme();

  return (
    <aside className="sidebar">

      {/* --- EN-TÊTE : LOGO / MARQUE --- */}
      <div className="brand-lockup">
        <span className="brand-mark">T</span>TaskFlow
      </div>

      {/* --- SESSIONS : UTILISATEUR ACTIF --- */}
      <p className="sidebar-user">
        Bienvenue, {utilisateur?.nom}
      </p>

      {/* --- NAVIGATION PRINCIPALE --- */}
      <nav className="sidebar-nav" aria-label="Navigation principale">
        
        {/* Lien : Tableau de bord */}
        <NavLink 
          className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`} 
          to="/dashboard"
        >
          <span aria-hidden="true">◈</span> Tableau de bord
        </NavLink>

        {/* Lien : Liste des projets */}
        <NavLink 
          className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`} 
          to="/projets"
        >
          <span aria-hidden="true">▦</span> Mes projets
        </NavLink>

      </nav>

      {/* --- ACTIONS SECONDAIRES --- */}
      
      {/* Basculeur de thème (Light/Dark) */}
      <button 
        className="theme-toggle sidebar-theme-toggle" 
        type="button" 
        onClick={basculerTheme} 
        aria-label="Changer le theme de l'application"
      >
        {theme === "light" ? "Mode sombre" : "Mode clair"}
      </button>

      {/* Bouton de déconnexion */}
      <button 
        className="sidebar-logout" 
        type="button" 
        onClick={deconnexion}
      >
        Déconnexion
      </button>

    </aside>
  );
};