import { Outlet } from "react-router-dom";
import { BarreLaterale } from "./BarreLaterale";

/**
 * Composant Layout (Gabarit principal)
 * 
 * Structure de base (App Shell) partagée par toutes les pages protégées.
 * Il maintient la navigation latérale fixe et injecte le contenu de la route
 * enfant active à la place du composant <Outlet />.
 */
export const Layout = () => {
  return (
    <div className="app-shell">

      {/* --- SIDEBAR : Navigation fixe --- */}
      <BarreLaterale />

      {/* --- CONTENU PRINCIPAL : Zone dynamique selon la route --- */}
      <main className="app-main">
        {/* React Router injecte ici le composant correspondant à l'URL courante */}
        <Outlet />
      </main>

    </div>
  );
};