/**
 * Composant Modale (Conteneur Présentationnel)
 * 
 * Ce composant gère uniquement l'affichage visuel de la fenêtre modale.
 * La page ou le composant parent conserve la responsabilité du formulaire,
 * de la logique métier et de l'état d'ouverture (estOuverte).
 * 
 * @param {Object} props
 * @param {boolean} props.estOuverte - Contrôle la visibilité de la modale
 * @param {Function} props.onFermer - Fonction de rappel (callback) pour fermer la modale
 * @param {string} props.titre - Titre affiché dans l'en-tête de la modale
 * @param {React.ReactNode} props.children - Contenu/Formulaire injecté à l'intérieur
 */

export const Modale = ({ estOuverte, onFermer, titre, children }) => {
  // --- CONDITION DE RENDU ---
  // Si la modale n'est pas marquée comme ouverte, on ne rend rien dans le DOM
  if (!estOuverte) return null;

  return (
    /* --- SUPERPOSITION / OVERLAY (Arrière-plan assombri) --- */
    <div 
      role="presentation" 
      onClick={onFermer} // Ferme la modale au clic sur le fond extérieur
      style={{ 
        position: "fixed", 
        inset: 0, 
        display: "grid", 
        placeItems: "center", 
        padding: "20px", 
        background: "rgba(15, 23, 42, 0.55)" 
      }}
    >
      {/* --- FENÊTRE MODALE (Boîte de dialogue) --- */}
      <section 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="titre-modale" 
        // Empêche le clic à l'intérieur de la modale de se propager vers l'overlay (évite la fermeture intempestive)
        onClick={(event) => event.stopPropagation()} 
        style={{ 
          width: "min(100%, 520px)", 
          padding: "24px", 
          borderRadius: "8px", 
          background: "var(--surface)" 
        }}
      >

        {/* --- EN-TÊTE DE LA MODALE --- */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          
          {/* Titre dynamique rattaché à aria-labelledby */}
          <h2 id="titre-modale" style={{ margin: 0 }}>
            {titre}
          </h2>

          {/* Bouton de fermeture */}
          <button 
            className="button button-secondary button-compact" 
            type="button" 
            onClick={onFermer} 
            aria-label="Fermer la fenêtre"
          >
            Fermer
          </button>

        </div>

        {/* --- CORPS DE LA MODALE (Contenu injecté) --- */}
        {children}

      </section>
    </div>
  );
};