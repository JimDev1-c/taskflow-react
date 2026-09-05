import { Routes, Route, Navigate } from "react-router-dom";
import { RoutePrivee } from "./components/RoutePrivee";
import { Layout } from "./components/Layout";
import { Connexion } from "./pages/Connexion";

// Composants temporaires pour valider les routes
const Dashboard = () => <h1>Tableau de bord (Jour 6)</h1>;
const Projets = () => <h1>Liste des Projets (Jour 3)</h1>;
const NonTrouve = () => <h1>404 - Page non trouvée</h1>;

export function App() {
  return (
    <Routes>
      {/* Route accessible sans session utilisateur. */}
      <Route path="/connexion" element={<Connexion />} />
      
      {/* Toutes les routes enfants passent par la protection et le layout commun. */}
      <Route element={<RoutePrivee><Layout /></RoutePrivee>}>
        {/* La racine redirige vers l'espace de travail principal. */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projets" element={<Projets />} />
      </Route>

      {/* Toute URL inconnue arrive ici. */}
      <Route path="*" element={<NonTrouve />} />
    </Routes>
  );
}

export default App;