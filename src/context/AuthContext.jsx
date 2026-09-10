import { createContext, useCallback, useMemo, useState } from "react";
import { connecterUtilisateur, inscrireUtilisateur } from "../api/auth";

// --- CRÉATION DU CONTEXTE ---
// Permet de partager l'état d'authentification à travers toute l'application
export const AuthContext = createContext();

/**
 * Composant AuthProvider
 * 
 * Enveloppe l'application pour fournir l'état global de session,
 * gérer la persistance dans `localStorage` et exposer les méthodes d'authentification.
 */
export const AuthProvider = ({ children }) => {

  // --- ÉTAT : UTILISATEUR EN SESSION ---
  // Initialisation paresseuse (lazy state) : exécutée uniquement au premier rendu.
  // Elle tente de restaurer la session directement depuis le stockage local.
  const [utilisateur, setUtilisateur] = useState(() => {
    const userStocke = localStorage.getItem("taskflow_user");
    if (!userStocke) return null;

    try {
      return JSON.parse(userStocke);
    } catch {
      // En cas de corruption des données JSON dans le stockage local
      localStorage.removeItem("taskflow_user");
      return null;
    }
  });

  // Indicateur de chargement initial (extensible si vérification asynchrone requise)
  const chargement = false;


  // --- ACTIONS D'AUTHENTIFICATION ---

  /**
   * Connecte l'utilisateur via l'API, met à jour l'état et persiste en localStorage.
   */
  
  const connexion = useCallback(async (email, motDePasse) => {
    const user = await connecterUtilisateur(email, motDePasse);
    setUtilisateur(user);
    localStorage.setItem("taskflow_user", JSON.stringify(user));
  }, []);

  /**
   * Inscrit un nouvel utilisateur via l'API et l'auto-connecte immédiatement.
   */

  const inscription = useCallback(async (donnees) => {
    const user = await inscrireUtilisateur(donnees);
    setUtilisateur(user);
    localStorage.setItem("taskflow_user", JSON.stringify(user));
  }, []);

  /**
   * Réinitialise la session et supprime les clés enregistrées localement.
   */

  const deconnexion = useCallback(() => {
    setUtilisateur(null);
    localStorage.removeItem("taskflow_user");
  }, []);


  // --- MEMOÏSATION DU CONTEXTE ---
  // Stabilise la référence de l'objet fourni aux composants consommateurs 
  // afin d'éviter des rendus inutiles lors de mises à jour d'autres composants.

  const valeur = useMemo(
    () => ({ 
      utilisateur, 
      connexion, 
      inscription, 
      deconnexion, 
      chargement 
    }),
    [utilisateur, connexion, inscription, deconnexion, chargement]
  );


  // --- RENDU DU PROVIDER ---

  return (
    <AuthContext.Provider value={valeur}>
      {!chargement && children}
    </AuthContext.Provider>
  );
};