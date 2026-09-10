const API_URL = "http://localhost:3000";

// Récupérer les tâches d'un projet
export const getTachesParProjet = async (projetId) => {
  const reponse = await fetch(`${API_URL}/taches?projetId=${projetId}`);
  if (!reponse.ok) throw new Error("Impossible de charger les tâches du projet.");
  return reponse.json();
};

// Récupérer toutes les tâches (pour le Dashboard)
export const getToutesLesTaches = async () => {
  const reponse = await fetch(`${API_URL}/taches`);
  if (!reponse.ok) throw new Error("Impossible de charger l'ensemble des tâches.");
  return reponse.json();
};

// Créer une nouvelle tâche
export const ajouterTache = async (nouvelleTache) => {
  const reponse = await fetch(`${API_URL}/taches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nouvelleTache),
  });
  if (!reponse.ok) throw new Error("Erreur lors de la création de la tâche.");
  return reponse.json();
};

// Mettre à jour une tâche (titre, description, priorité, etc.)
export const modifierTache = async (id, modifications) => {
  const reponse = await fetch(`${API_URL}/taches/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(modifications),
  });
  if (!reponse.ok) throw new Error("Erreur lors de la mise à jour de la tâche.");
  return reponse.json();
};

// Changer uniquement le statut d'une tâche (PATCH rapide)
export const changerStatutTache = async (id, nouveauStatut) => {
  const reponse = await fetch(`${API_URL}/taches/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      statut: nouveauStatut,
      modifieLe: new Date().toISOString().split("T")[0],
    }),
  });
  if (!reponse.ok) throw new Error("Erreur lors du changement de statut.");
  return reponse.json();
};

// Supprimer une tâche
export const supprimerTache = async (id) => {
  const reponse = await fetch(`${API_URL}/taches/${id}`, {
    method: "DELETE",
  });
  if (!reponse.ok) throw new Error("Erreur lors de la suppression de la tâche.");
};