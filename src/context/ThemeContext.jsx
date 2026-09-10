import { createContext, useContext, useEffect, useState } from "react";

// --- CRÉATION DU CONTEXTE ---
// Centralise l'état du thème visuel (clair / sombre) pour l'ensemble de l'application
const ThemeContext = createContext(null);

/**
 * Composant ThemeProvider
 * 
 * Enveloppe l'application ou un sous-arbre pour fournir le thème actif
 * et la fonction permettant de basculer d'un mode à l'autre.
 */

export const ThemeProvider = ({ children }) => {

  // --- ÉTAT : THÈME ACTIF ---
  // Valeur par défaut initialisée sur le mode clair ("light")
  
  const [theme, setTheme] = useState("light");

  // --- EFFET SECONDAIRE : APPLICATION DU THÈME SUR LE DOM ---
  // Met à jour l'attribut `data-theme` sur la balise <html> (document.documentElement)
  // à chaque changement de thème, permettant aux variables CSS globales de réagir.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // --- ACTION : BASCULEUR DE THÈME ---
  // Alterne dynamiquement entre "light" et "dark"
  const basculerTheme = () => {
    setTheme((themeActuel) => (themeActuel === "light" ? "dark" : "light"));
  };

  // --- RENDU DU PROVIDER ---
  return (
    <ThemeContext.Provider value={{ theme, basculerTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook personnalisé useTheme
 * 
 * Expose une interface simple d'accès au contexte du thème.
 * À utiliser dans n'importe quel composant enfant pour lire le thème ou le basculer.
 * 
 * @returns {{ theme: string, basculerTheme: Function }}
 */
export const useTheme = () => useContext(ThemeContext);