// Page réservée au détail d'un projet et aux tâches qui lui sont associées.

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTaches } from "../hooks/useTaches";
import { Modale } from "../components/Modale";

const VALEURS_PAR_DEFAUT = {
  titre: "",
  description: "",
  statut: "a_faire",
  priorite: "moyenne",
  echeance: new Date().toISOString().split("T")[0],
};

export const DetailProjet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    taches,
    totalTachesBrutes,
    chargement,
    erreur,
    recherche,
    setRecherche,
    filtreStatut,
    setFiltreStatut,
    filtrePriorite,
    setFiltrePriorite,
    tri,
    setTri,
    creer,
    editer,
    changerStatut,
    supprimer,
  } = useTaches(id);

  // Gestion du formulaire dans la Modale
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [tacheEnEdition, setTacheEnEdition] = useState(null);
  const [formulaire, setFormulaire] = useState(VALEURS_PAR_DEFAUT);

  const ouvrirCreation = () => {
    setTacheEnEdition(null);
    setFormulaire({
      ...VALEURS_PAR_DEFAUT,
      echeance: new Date().toISOString().split("T")[0],
    });
    setModaleOuverte(true);
  };

  const ouvrirEdition = (tache) => {
    setTacheEnEdition(tache);
    setFormulaire({
      titre: tache.titre || "",
      description: tache.description || "",
      statut: tache.statut || "a_faire",
      priorite: tache.priorite || "moyenne",
      echeance: tache.echeance || "",
    });
    setModaleOuverte(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulaire((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tacheEnEdition) {
        await editer(tacheEnEdition.id, formulaire);
      } else {
        await creer(formulaire);
      }
      setModaleOuverte(false);
    } catch (err) {
      alert(err.message || "Une erreur est survenue lors de l'enregistrement.");
    }
  };

  const handleSupprimer = (tacheId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      supprimer(tacheId);
    }
  };

  const handleChangerStatutRapide = (tache) => {
    const ordre = ["a_faire", "en_cours", "terminee"];
    const index = ordre.indexOf(tache.statut);
    if (index < ordre.length - 1) {
      changerStatut(tache.id, ordre[index + 1]);
    }
  };

  return (
    <div>
      <button
        className="button button-secondary"
        type="button"
        onClick={() => navigate("/projets")}
      >
        <span aria-hidden="true">←</span> Retour aux projets
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0" }}>
        <h2>Tâches du projet #{id}</h2>
        <button className="button button-primary" type="button" onClick={ouvrirCreation}>
          <span aria-hidden="true">+</span> Nouvelle tâche
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", background: "var(--surface)", padding: "15px", borderRadius: "8px" }}>
        <input
          type="search"
          placeholder="Rechercher une tâche..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          aria-label="Rechercher une tâche"
          style={{ flex: 1, minWidth: "200px", padding: "8px" }}
        />

        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} aria-label="Filtrer par statut" style={{ padding: "8px" }}>
          <option value="tous">Tous les statuts</option>
          <option value="a_faire">À faire</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminée</option>
        </select>

        <select value={filtrePriorite} onChange={(e) => setFiltrePriorite(e.target.value)} aria-label="Filtrer par priorité" style={{ padding: "8px" }}>
          <option value="toutes">Toutes les priorités</option>
          <option value="basse">Basse</option>
          <option value="moyenne">Moyenne</option>
          <option value="haute">Haute</option>
        </select>

        <select value={tri} onChange={(e) => setTri(e.target.value)} aria-label="Trier la liste" style={{ padding: "8px" }}>
          <option value="echeance">Trier par Échéance</option>
          <option value="creation">Trier par Date de création</option>
        </select>
      </div>

      {/* États de chargement, d'erreur et liste vide */}
      {chargement && <p>Chargement des tâches...</p>}
      {erreur && <p style={{ color: "var(--danger)" }}>Erreur : {erreur}</p>}

      {!chargement && !erreur && taches.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px", background: "var(--surface)", borderRadius: "8px" }}>
          <p style={{ color: "var(--muted)" }}>
            {totalTachesBrutes === 0
              ? "Aucune tâche dans ce projet pour le moment."
              : "Aucune tâche ne correspond à vos filtres de recherche."}
          </p>
        </div>
      )}

      {/* Tableau des Tâches */}
      {!chargement && taches.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface)", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "var(--surface-soft)", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Titre</th>
              <th style={{ padding: "12px" }}>Statut</th>
              <th style={{ padding: "12px" }}>Priorité</th>
              <th style={{ padding: "12px" }}>Échéance</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taches.map((tache) => (
              <tr key={tache.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px" }}>
                  <strong>{tache.titre}</strong>
                  {tache.description && (
                    <>
                      <br />
                      <small style={{ color: "var(--muted)" }}>{tache.description}</small>
                    </>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#FFF",
                      background:
                        tache.statut === "terminee"
                          ? "#3b9b78"
                          : tache.statut === "en_cours"
                          ? "#d98252"
                          : "#7a8c8d",
                    }}
                  >
                    {tache.statut.replace("_", " ")}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{tache.priorite}</td>
                <td style={{ padding: "12px" }}>
                  {tache.echeance ? new Date(tache.echeance).toLocaleDateString("fr-FR") : "-"}
                </td>
                <td style={{ padding: "12px", display: "flex", gap: "5px" }}>
                  {tache.statut !== "terminee" && (
                    <button
                      className="button button-compact button-secondary"
                      type="button"
                      onClick={() => handleChangerStatutRapide(tache)}
                      title="Passer au statut suivant"
                    >
                      Avancer <span aria-hidden="true">→</span>
                    </button>
                  )}
                  <button
                    className="button button-compact button-secondary"
                    type="button"
                    onClick={() => ouvrirEdition(tache)}
                  >
                    Modifier
                  </button>
                  <button
                    className="button button-compact button-danger"
                    type="button"
                    onClick={() => handleSupprimer(tache.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modale de création / modification */}
      <Modale
        estOuverte={modaleOuverte}
        onFermer={() => setModaleOuverte(false)}
        titre={tacheEnEdition ? "Modifier la tâche" : "Nouvelle tâche"}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            name="titre"
            placeholder="Titre de la tâche"
            value={formulaire.titre}
            onChange={handleChange}
            required
            style={{ padding: "8px" }}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formulaire.description}
            onChange={handleChange}
            rows={3}
            style={{ padding: "8px" }}
          />

          <select
            name="priorite"
            value={formulaire.priorite}
            onChange={handleChange}
            style={{ padding: "8px" }}
          >
            <option value="basse">Priorité Basse</option>
            <option value="moyenne">Priorité Moyenne</option>
            <option value="haute">Priorité Haute</option>
          </select>

          <input
            type="date"
            name="echeance"
            value={formulaire.echeance}
            onChange={handleChange}
            required
            style={{ padding: "8px" }}
          />

          <button className="button button-primary" type="submit">
            {tacheEnEdition ? "Enregistrer" : "Créer la tâche"}
          </button>
        </form>
      </Modale>
    </div>
  );
};