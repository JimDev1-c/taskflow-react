// API des projets : ce module isole les lectures HTTP de la couche d'affichage.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Retourne uniquement les projets appartenant a l'utilisateur connecte.
export const getProjetsParUtilisateur = async (utilisateurId) => {
  const reponse = await fetch(`${API_URL}/projets?utilisateurId=${utilisateurId}`);
  if (!reponse.ok) throw new Error("Impossible de charger les projets.");
  return reponse.json();
};
