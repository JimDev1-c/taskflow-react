import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/**
 * Page de Connexion
 * 
 * Permet aux utilisateurs existants de s'authentifier.
 * Présente une mise en page séparée en deux sections :
 * - Gauche : Présentation de la marque et basculeur de thème
 * - Droite : Formulaire d'authentification et gestion des erreurs
 */
export const Connexion = () => {

  // --- ÉTATS DU FORMULAIRE ---
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  // --- HOOKS & CONTEXTES ---
  const { connexion } = useContext(AuthContext);
  const { theme, basculerTheme } = useTheme();
  const navigate = useNavigate();


  // --- GESTION DE LA SOUMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      // Tente la connexion auprès de l'API
      await connexion(email, motDePasse);
      
      // Redirection vers le tableau de bord en cas de succès
      navigate("/dashboard");

    } catch (err) {
      // Gestion des erreurs réseau vs erreurs d'identifiants
      setErreur(
        err.message === "Failed to fetch"
          ? "Le serveur de connexion est indisponible. Lancez npm run api puis réessayez."
          : err.message
      );
    } finally {
      setChargement(false);
    }
  };


  return (
    <main className="auth-page">

      {/* --- PANNEAU GAUCHE : PRÉSENTATION & BRANDING --- */}
      <section className="auth-intro" aria-label="Présentation de TaskFlow">
        
        {/* En-tête avec Logo et Bouton de Thème */}
        <div className="auth-intro-topline">
          <div className="brand-lockup">
            <span className="brand-mark">T</span>TaskFlow
          </div>

          <button 
            className="theme-toggle" 
            type="button" 
            onClick={basculerTheme} 
            aria-label="Changer de thème"
          >
            {theme === "light" ? "Mode sombre" : "Mode clair"}
          </button>
        </div>

        {/* Accroche textuelle */}
        <div className="auth-intro-copy">
          <p className="eyebrow">Votre espace de travail</p>
          <h1>Transformez vos idées en progrès concret.</h1>
          <p>Organisez vos projets, suivez vos priorités et gardez votre équipe alignée au même endroit.</p>
        </div>

        <p className="auth-intro-footer">Simple, clair, efficace.</p>

      </section>


      {/* --- PANNEAU DROIT : FORMULAIRE DE CONNEXION --- */}
      <section className="auth-panel">
        <div className="auth-card">

          {/* Titre & Sous-titre du formulaire */}
          <h2>Bon retour parmi nous !</h2>
          <p className="auth-subtitle">Connectez-vous pour retrouver vos projets et vos tâches.</p>

          {/* Message d'erreur dynamique */}
          {erreur && (
            <p className="form-error" role="alert">
              {erreur}
            </p>
          )}

          {/* Formulaire principal */}
          <form className="auth-form" onSubmit={handleSubmit}>

            {/* Champ Email */}
            <div className="field-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="field-group">
              <label htmlFor="mot-de-passe">Mot de passe</label>
              <input
                id="mot-de-passe"
                type="password"
                placeholder="Votre mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Bouton de validation avec état de chargement */}
            <button className="primary-button" type="submit" disabled={chargement}>
              {chargement ? "Connexion en cours..." : "Se connecter"}
            </button>

          </form>

          {/* Lien de redirection vers la création de compte */}
          <p className="auth-switch">
            Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
          </p>

        </div>
      </section>

    </main>
  );
};