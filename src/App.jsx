import { Routes, Route, Navigate } from "react-router-dom";

// Guards & Layouts
import { RoutePrivee } from "./components/RoutePrivee";
import { Layout } from "./components/Layout";

// Public Views
import { Connexion } from "./pages/Connexion";
import { Inscription } from "./pages/Inscription";

// Protected Views
import { Dashboard } from "./pages/Dashboard";
import { Projets } from "./pages/Projets";
import { DetailProjet } from "./pages/DetailProjet";

// Fallback Views
import { NonTrouve } from "./pages/NonTrouve";

// Global Stylesheet
import "./App.css";

/**
 * Composant racine définissant la carte de routage (Routing Tree) de l'application.
 * 
 * Architecture du routage :
 * - Public : Routes accessibles hors session utilisateur.
 * - Protégé : Routes restreintes nécessitant une authentification (`RoutePrivee`), 
 *   partageant la même structure visuelle globale (`Layout`).
 * - Fallback : Capture des routes non définies (404).
 * 
 * @component
 * @returns {JSX.Element} L'arbre d'itinéraires React Router.
 */
export function App() {
  return (
    <Routes>
      {/* ========================================== */}
      {/* 1. ROUTES PUBLIQUES                        */}
      {/* ========================================== */}
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />

      {/* ========================================== */}
      {/* 2. ENCLAVE PROTÉGÉE (Authentification requise) */}
      {/* ========================================== */}
      <Route
        element={
          <RoutePrivee>
            <Layout />
          </RoutePrivee>
        }
      >
        {/* Redirection explicite du chemin racine vers le tableau de bord */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Vues métier */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/projets/:id" element={<DetailProjet />} />
      </Route>

      {/* ========================================== */}
      {/* 3. GESTION DES ERREURS DE ROUTAGE          */}
      {/* ========================================== */}
      <Route path="*" element={<NonTrouve />} />
    </Routes>
  );
}

export default App;