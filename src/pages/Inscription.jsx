// Page publique de création d'un compte utilisateur.
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const Inscription = () => {
    const { inscription } = useContext(AuthContext);
    const { theme, basculerTheme } = useTheme();
    const navigate = useNavigate();

    const [formulaire, setFormulaire] = useState({ nom: "", email: "", motDePasse: "" });
    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErreur("");

        // Validation rapide côté client
        if (formulaire.motDePasse.length < 6) {
            setErreur("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setChargement(true);

        try {
            await inscription(formulaire);
            navigate("/dashboard");
        } catch (err) {
            setErreur(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setChargement(false);
        }
    };

    const modifierChamp = (event) => {
        const { name, value } = event.target;
        setFormulaire((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <main className="auth-page">
            <section className="auth-intro auth-intro-register" aria-label="Présentation de TaskFlow">
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
                <div className="auth-intro-copy">
                    <p className="eyebrow">Un espace pour avancer</p>
                    <h1>Donnez à vos projets un cadre qui inspire confiance.</h1>
                    <p>Centralisez vos priorités, gardez le cap sur vos échéances et avancez sereinement, une étape après l'autre.</p>
                </div>
                <p className="auth-intro-footer">Clair pour commencer. Solide pour durer.</p>
            </section>

            <section className="auth-panel">
                <div className="auth-card">
                    <p className="eyebrow auth-form-eyebrow">Votre espace de travail</p>
                    <h1>Construisez votre espace de travail</h1>
                    <p className="auth-subtitle">
                        Créez votre compte et retrouvez vos projets, vos priorités et vos prochaines actions au même endroit.
                    </p>

                    {erreur && <p className="form-error" role="alert">{erreur}</p>}

                    <form className="auth-form" onSubmit={handleSubmit} aria-busy={chargement}>
                        <div className="field-group">
                            <label htmlFor="nom">Nom complet</label>
                            <input
                                id="nom"
                                name="nom"
                                type="text"
                                placeholder="Votre nom"
                                autoComplete="name"
                                value={formulaire.nom}
                                onChange={modifierChamp}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="email">Adresse e-mail</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="vous@exemple.com"
                                autoComplete="email"
                                value={formulaire.email}
                                onChange={modifierChamp}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="motDePasse">Mot de passe</label>
                            <input
                                id="motDePasse"
                                name="motDePasse"
                                type="password"
                                placeholder="Choisissez un mot de passe (min. 6 car.)"
                                autoComplete="new-password"
                                value={formulaire.motDePasse}
                                onChange={modifierChamp}
                                minLength={6}
                                required
                            />
                        </div>

                        <button 
                            className="primary-button" 
                            type="submit" 
                            disabled={chargement}
                        >
                            {chargement ? "Création en cours..." : "Créer mon compte"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};