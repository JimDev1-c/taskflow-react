import { Link } from "react-router-dom";

/**
 * Composant CarteProjet
 * 
 * Carte réutilisable permettant d'afficher l'aperçu d'un projet dans une grille ou liste.
 * Elle découple la logique d'affichage de la structure exacte des données reçues.
 * 
 * @param {Object} props - Les propriétés passées au composant
 * @param {Object} props.projet - L'objet contenant les informations du projet
 * @param {string} props.projet.id - Identifiant unique du projet pour la redirection
 * @param {string} props.projet.nom - Nom/Titre du projet
 * @param {string} [props.projet.description] - Courte description du projet
 * @param {string} [props.projet.couleur] - Code couleur (ex: Hex/RGB) pour personnaliser la bordure supérieure
 */

export const CarteProjet = ({ projet, totalTaches = 0, pourcentage = 0, onModifier, onSupprimer }) => {
  return (
    <article 
      className="project-card" 

      // Personnalisation dynamique de la bordure supérieure si une couleur est définie
      style={{ borderTopColor: projet.couleur || undefined }}
    >

      {/* Titre du projet */}
      <h2>{projet.nom}</h2>

      {/* Description du projet */}
      <p>{projet.description}</p>

      <div className="project-card-progress" aria-label={`${pourcentage}% des tâches terminées`}>
        <span>{totalTaches} tâche{totalTaches > 1 ? "s" : ""}</span>
        <strong>{pourcentage}%</strong>
      </div>
      <div className="project-card-track" aria-hidden="true">
        <span style={{ width: `${pourcentage}%`, backgroundColor: projet.couleur || "var(--accent)" }} />
      </div>

      <div className="project-card-actions">
        <Link className="button button-secondary button-compact" to={`/projets/${projet.id}`}>
          Ouvrir
        </Link>
        <button className="button button-secondary button-compact" type="button" onClick={() => onModifier(projet)}>
          Modifier
        </button>
        <button className="button button-danger button-compact" type="button" onClick={() => onSupprimer(projet)}>
          Supprimer
        </button>
      </div>

    </article>
  );
};
