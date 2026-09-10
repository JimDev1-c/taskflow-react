import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Application State Contexts
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Root Component
import App from "./App";

// Static Assets
import layersIcon from "./assets/layers.png";

/**
 * Mettre à jour dynamiquement le favicon via le bundled asset de Vite.
 * Permet au bundler d'injecter le hash du fichier en production.
 */
const injectFavicon = () => {
  const faviconNode = document.querySelector('link[rel="icon"]');
  if (faviconNode) {
    faviconNode.type = "image/png";
    faviconNode.href = layersIcon;
  }
};

injectFavicon();

/**
 * Point d'entrée principal (Bootstrapper) de l'application React Client.
 * 
 * Hiérarchie des Context Providers :
 * 1. React.StrictMode : Active les avertissements stricts en mode développement.
 * 2. BrowserRouter    : Fournit l'API d'historique de navigation HTML5.
 * 3. ThemeProvider    : Injecte la configuration visuelle (Dark/Light mode).
 * 4. AuthProvider     : Maintient le contexte de session de l'utilisateur.
 * 
 * Note d'architecture : `AuthProvider` est placé à l'intérieur de `ThemeProvider`
 * pour permettre une éventuelle consommation de thèmes au sein de l'authentification.
 */
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}