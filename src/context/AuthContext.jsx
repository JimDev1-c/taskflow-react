import { createContext, useCallback, useMemo, useState } from "react";
import { connecterUtilisateur, inscrireUtilisateur } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // La session est restauree avant le premier rendu depuis le stockage du navigateur.
  const [utilisateur, setUtilisateur] = useState(() => {
    const userStocke = localStorage.getItem("taskflow_user");
    if (!userStocke) return null;

    try {
      return JSON.parse(userStocke);
    } catch {
      localStorage.removeItem("taskflow_user");
      return null;
    }
  });
  const chargement = false;

  // Ces actions modifient a la fois l'etat React et la session persistante.
  const connexion = useCallback(async (email, motDePasse) => {
    const user = await connecterUtilisateur(email, motDePasse);
    setUtilisateur(user);
    localStorage.setItem("taskflow_user", JSON.stringify(user));
  }, []);

  const inscription = useCallback(async (donnees) => {
    const user = await inscrireUtilisateur(donnees);
    setUtilisateur(user);
    localStorage.setItem("taskflow_user", JSON.stringify(user));
  }, []);

  const deconnexion = useCallback(() => {
    setUtilisateur(null);
    localStorage.removeItem("taskflow_user");
  }, []);

  // Une valeur stable evite de rerendre inutilement les consommateurs du contexte.
  const valeur = useMemo(
    () => ({ utilisateur, connexion, inscription, deconnexion, chargement }),
    [utilisateur, connexion, inscription, deconnexion, chargement]
  );

  return (
    <AuthContext.Provider value={valeur}>
      {!chargement && children}
    </AuthContext.Provider>
  );
};