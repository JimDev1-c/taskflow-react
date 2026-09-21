// API des projets : ce module isole les lectures HTTP de la couche d'affichage.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Retourne uniquement les projets appartenant a l'utilisateur connecte.
export const getProjetsParUtilisateur = async (utilisateurId, options = {}) => {
  const reponse = await fetch(`${API_URL}/projets?utilisateurId=${utilisateurId}`, options);
  if (!reponse.ok) throw new Error("Impossible de charger les projets.");
  return reponse.json();
};

export const ajouterProjet = async (projet) => {
  const reponse = await fetch(`${API_URL}/projets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projet),
  });
  if (!reponse.ok) throw new Error("Impossible de créer le projet.");
  return reponse.json();
};

export const modifierProjet = async (id, modifications) => {
  const reponse = await fetch(`${API_URL}/projets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(modifications),
  });
  if (!reponse.ok) throw new Error("Impossible de modifier le projet.");
  return reponse.json();
};

export const supprimerProjet = async (id) => {
  const reponse = await fetch(`${API_URL}/projets/${id}`, { method: "DELETE" });
  if (!reponse.ok) throw new Error("Impossible de supprimer le projet.");
};
