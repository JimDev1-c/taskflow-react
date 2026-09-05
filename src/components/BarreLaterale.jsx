import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const BarreLaterale = () => {
  const { deconnexion, utilisateur } = useContext(AuthContext);

  return (
    // La barre laterale est partagee par toutes les pages protegees.
    <aside style={{ width: "240px", padding: "20px", background: "#1E293B", color: "#FFF" }}>
      <h2>TaskFlow</h2>
      <p style={{ fontSize: "14px", color: "#94A3B8" }}>Bienvenue, {utilisateur?.nom}</p>
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "30px" }}>
        <NavLink to="/dashboard" style={{ color: "#FFF", textDecoration: "none" }}>Tableau de bord</NavLink>
        <NavLink to="/projets" style={{ color: "#FFF", textDecoration: "none" }}>Mes Projets</NavLink>
      </nav>
      <button onClick={deconnexion} style={{ marginTop: "50px", padding: "8px", background: "#EF4444", color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Déconnexion
      </button>
    </aside>
  );
};