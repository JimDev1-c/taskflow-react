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

export const CarteProjet = ({ projet }) => {
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

      {/* Lien de redirection vers la page détaillée du projet */}
      <Link to={`/projets/${projet.id}`}>
        Ouvrir le projet
      </Link>

    </article>
  );
};