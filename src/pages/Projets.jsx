import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ajouterProjet, getProjetsParUtilisateur, modifierProjet, supprimerProjet } from "../api/projets";
import { getToutesLesTaches, supprimerTache } from "../api/taches";
import { CarteProjet } from "../components/CarteProjet";
import { Modale } from "../components/Modale";
import { calculerStatsProjet } from "../utils/statistiques";

const PROJET_VIDE = { nom: "", description: "", couleur: "#2d7c82" };

export const Projets = () => {
  const { utilisateur } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [projetEnEdition, setProjetEnEdition] = useState(null);
  const [formulaire, setFormulaire] = useState(PROJET_VIDE);
  const [enregistrement, setEnregistrement] = useState(false);

  const chargerProjets = async (signal) => {
    if (!utilisateur?.id) return;
    setChargement(true);
    setErreur(null);
    try {
      const [donneesProjets, donneesTaches] = await Promise.all([
        getProjetsParUtilisateur(utilisateur.id, { signal }),
        getToutesLesTaches(),
      ]);
      setProjets(donneesProjets || []);
      const ids = new Set((donneesProjets || []).map((projet) => String(projet.id)));
      setTaches((donneesTaches || []).filter((tache) => ids.has(String(tache.projetId))));
    } catch (err) {
      if (err.name !== "AbortError") setErreur(err.message || "Impossible de charger vos projets.");
    } finally {
      if (!signal?.aborted) setChargement(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    chargerProjets(controller.signal);
    return () => controller.abort();
  }, [utilisateur?.id]);

  useEffect(() => {
    if (searchParams.get("nouveau") === "1") {
      setProjetEnEdition(null);
      setFormulaire(PROJET_VIDE);
      setModaleOuverte(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const ouvrirCreation = () => {
    setProjetEnEdition(null);
    setFormulaire(PROJET_VIDE);
    setModaleOuverte(true);
  };

  const ouvrirEdition = (projet) => {
    setProjetEnEdition(projet);
    setFormulaire({ nom: projet.nom, description: projet.description || "", couleur: projet.couleur || "#2d7c82" });
    setModaleOuverte(true);
  };

  const enregistrerProjet = async (event) => {
    event.preventDefault();
    setEnregistrement(true);
    setErreur(null);
    try {
      if (projetEnEdition) {
        await modifierProjet(projetEnEdition.id, formulaire);
      } else {
        await ajouterProjet({ ...formulaire, utilisateurId: utilisateur.id, creeLe: new Date().toISOString().slice(0, 10) });
      }
      setModaleOuverte(false);
      await chargerProjets();
    } catch (err) {
      setErreur(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setEnregistrement(false);
    }
  };

  const effacerProjet = async (projet) => {
    if (!window.confirm(`Supprimer « ${projet.nom} » et toutes ses tâches ? Cette action est irréversible.`)) return;
    try {
      const tachesDuProjet = taches.filter((tache) => String(tache.projetId) === String(projet.id));
      await Promise.all(tachesDuProjet.map((tache) => supprimerTache(tache.id)));
      await supprimerProjet(projet.id);
      await chargerProjets();
    } catch (err) {
      setErreur(err.message || "Impossible de supprimer le projet.");
    }
  };

  return (
    <section className="projets-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Organisation</p>
          <h1>Mes projets</h1>
          <p>{projets.length} projet{projets.length > 1 ? "s" : ""} — {taches.length} tâche{taches.length > 1 ? "s" : ""} au total</p>
        </div>
        <button className="button button-primary" type="button" onClick={ouvrirCreation}><span aria-hidden="true">+</span> Nouveau projet</button>
      </header>

      {chargement && <div className="empty-state">Chargement de vos projets en cours...</div>}
      {erreur && <div className="empty-state error-state" role="alert">Erreur : {erreur}</div>}
      {!chargement && !erreur && projets.length === 0 && (
        <div className="empty-state project-empty-state">
          <p>Aucun projet n'est disponible pour le moment.</p>
          <button className="button button-primary" type="button" onClick={ouvrirCreation}>Créer mon premier projet</button>
        </div>
      )}
      {!chargement && !erreur && projets.length > 0 && (
        <div className="project-grid">
          {projets.map((projet) => {
            const tachesDuProjet = taches.filter((tache) => String(tache.projetId) === String(projet.id));
            const { total, pourcentage } = calculerStatsProjet(tachesDuProjet);
            return <CarteProjet key={projet.id} projet={projet} totalTaches={total} pourcentage={pourcentage} onModifier={ouvrirEdition} onSupprimer={effacerProjet} />;
          })}
        </div>
      )}

      <footer className="page-footer"><Link to="/dashboard" className="button button-secondary"><span aria-hidden="true">←</span> Retour au tableau de bord</Link></footer>

      <Modale estOuverte={modaleOuverte} onFermer={() => setModaleOuverte(false)} titre={projetEnEdition ? "Modifier le projet" : "Nouveau projet"}>
        <form className="project-form" onSubmit={enregistrerProjet}>
          <label htmlFor="projet-nom">Nom du projet</label>
          <input id="projet-nom" value={formulaire.nom} onChange={(event) => setFormulaire((ancien) => ({ ...ancien, nom: event.target.value }))} required />
          <label htmlFor="projet-description">Description</label>
          <textarea id="projet-description" rows="4" value={formulaire.description} onChange={(event) => setFormulaire((ancien) => ({ ...ancien, description: event.target.value }))} />
          <label htmlFor="projet-couleur">Couleur</label>
          <input id="projet-couleur" type="color" value={formulaire.couleur} onChange={(event) => setFormulaire((ancien) => ({ ...ancien, couleur: event.target.value }))} />
          <button className="button button-primary" type="submit" disabled={enregistrement}>{enregistrement ? "Enregistrement..." : "Enregistrer le projet"}</button>
        </form>
      </Modale>
    </section>
  );
};
