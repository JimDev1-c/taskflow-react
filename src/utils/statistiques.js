/**
 * Fonctions utilitaires réservées aux calculs du tableau de bord.
 */

/**
 * Calcule les statistiques d'un projet individuel (pour les cartes de projets).
 * 
 * @param {Array<Object>} tachesProjet - Liste des tâches associées à un projet spécifique.
 * @return {Object} Un objet contenant le nombre total de tâches et le pourcentage d'avancement.
 */

export const calculerStatsProjet = (tachesProjet = []) => {
  const total = tachesProjet.length;

  // Gestion des projets sans tâche pour éviter la division par zéro
  if (total === 0) {
    return { total: 0, pourcentage: 0 };
  }

  // Comtage des tâches finalisées
  const terminees = tachesProjet.filter((t) => t.statut === "terminee").length;
  
  // Calcul du pourcentage d'avancement arrondi
  const pourcentage = Math.round((terminees / total) * 100);

  return { total, pourcentage };
};

/**
 * Calcule l'ensemble des métriques d'avancement pour le Tableau de Bord global.
 * 
 * @param {Array<Object>} projets - Liste de tous les projets enregistrés.
 * @param {Array<Object>} toutesLesTaches - Liste globale de toutes les tâches.
 * @return {Object} Un objet regroupant le récapitulatif des projets, des tâches par statut et les urgences.
 */
export const calculerStatsGlobales = (projets = [], toutesLesTaches = []) => {
  // Totaux globaux
  const totalProjets = projets.length;
  const totalTaches = toutesLesTaches.length;

  // Ventilation des tâches selon leur statut
  const aFaire = toutesLesTaches.filter((t) => t.statut === "a_faire").length;
  const enCours = toutesLesTaches.filter((t) => t.statut === "en_cours").length;
  const terminees = toutesLesTaches.filter((t) => t.statut === "terminee").length;

  // Calcul du taux d'achèvement global avec sécurité contre la division par zéro (prévention du NaN)
  const pourcentageGlobal = totalTaches > 0
    ? Math.round((terminees / totalTaches) * 100)
    : 0;

  // Sélection et tri des 5 prochaines tâches non terminées par date d'échéance la plus proche
  const tachesUrgentes = [...toutesLesTaches]
    .filter((t) => t.statut !== "terminee")
    .sort((a, b) => new Date(a.echeance) - new Date(b.echeance))
    .slice(0, 5);

  return {
    totalProjets,
    totalTaches,
    aFaire,
    enCours,
    terminees,
    pourcentageGlobal,
    tachesUrgentes,
  };
};