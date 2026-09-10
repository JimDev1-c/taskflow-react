import { useState, useEffect } from "react";
import {
  getTachesParProjet,
  ajouterTache,
  modifierTache,
  changerStatutTache,
  supprimerTache,
} from "../api/taches";

/**
 * Hook personnalisé : useTaches
 * 
 * Centralise toute la logique liée aux tâches d'un projet spécifique :
 * - Chargement et rafraîchissement des tâches depuis l'API
 * - Opérations CRUD (Créer, Éditer, Changer statut, Supprimer)
 * - Gestion du filtrage (recherche, statut, priorité) et du tri dynamique
 * 
 * @param {number|string} projetId - Identifiant du projet parent
 */
export const useTaches = (projetId) => {

  // --- ÉTATS PRINCIPAUX (Données & Requêtes) ---
  const [taches, setTaches] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // --- ÉTATS DE FILTRAGE ET TRI ---
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtrePriorite, setFiltrePriorite] = useState("toutes");
  const [tri, setTri] = useState("echeance");


  // --- CHARGEMENT DES DONNÉES ---
  /**
   * Récupère la liste des tâches associées au projet depuis l'API.
   */
  
  const chargerTaches = async () => {
    if (!projetId) return;

    try {
      setChargement(true);
      setErreur(null);
      const donnees = await getTachesParProjet(projetId);
      setTaches(donnees);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  // Déclenche le chargement initial ou le rechargement si le projetId change

  useEffect(() => {
    chargerTaches();
  }, [projetId]);


  // --- ACTIONS CRUD (MUTATIONS) ---

  /**
   * Crée une nouvelle tâche et rafraîchit la liste.
   */

  const creer = async (nouvelleTache) => {
    await ajouterTache({
      ...nouvelleTache,
      projetId: Number(projetId),
      creeLe: new Date().toISOString().split("T")[0],
      modifieLe: new Date().toISOString().split("T")[0],
    });
    chargerTaches();
  };

  /**
   * Met à jour les informations d'une tâche existante.
   */

  const editer = async (id, modifications) => {
    await modifierTache(id, {
      ...modifications,
      modifieLe: new Date().toISOString().split("T")[0],
    });
    chargerTaches();
  };

  /**
   * Modifie uniquement le statut d'une tâche (ex: "A faire" -> "Terminé").
   */
  const changerStatut = async (id, nouveauStatut) => {
    await changerStatutTache(id, nouveauStatut);
    chargerTaches();
  };

  /**
   * Supprime définitivement une tâche.
   */
  const supprimer = async (id) => {
    await supprimerTache(id);
    chargerTaches();
  };


  // --- TRAITEMENT EN MÉMOIRE : FILTRAGE & TRI ---
  // Calcule dynamiquement les tâches à afficher en fonction des critères sélectionnés

  const tachesFiltrees = taches
    .filter((t) => {
      const matchTitre = t.titre.toLowerCase().includes(recherche.toLowerCase());
      const matchStatut = filtreStatut === "tous" || t.statut === filtreStatut;
      const matchPriorite = filtrePriorite === "toutes" || t.priorite === filtrePriorite;

      return matchTitre && matchStatut && matchPriorite;
    })
    .sort((a, b) => {
      if (tri === "echeance") return new Date(a.echeance) - new Date(b.echeance);
      return new Date(a.creeLe) - new Date(b.creeLe);
    });


  // --- VALEURS & FONCTIONS EXPOSÉES ---
  return {
    // Données calculées et états
    taches: tachesFiltrees,
    totalTachesBrutes: taches.length,
    chargement,
    erreur,

    // Contrôleurs des filtres
    recherche,
    setRecherche,
    filtreStatut,
    setFiltreStatut,
    filtrePriorite,
    setFiltrePriorite,
    tri,
    setTri,

    // Méthodes métier
    creer,
    editer,
    changerStatut,
    supprimer,
    rafraichir: chargerTaches,
  };
};