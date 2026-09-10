// ============================================================================
// COMPOSANT : Projets
// Rôle : Page privée permettant d'afficher l'ensemble des projets de l'utilisateur.
// Contient la gestion des états asynchrones (chargement, succès, erreur)
// et l'annulation des requêtes HTTP obsolètes.
// ============================================================================

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProjetsParUtilisateur } from "../api/projets";
import { CarteProjet } from "../components/CarteProjet";

export const Projets = () => {
    // ------------------------------------------------------------------------
    // 1. EXTRACTION DU CONTEXTE D'AUTHENTIFICATION
    // Récupération des données globales de l'utilisateur actuellement connecté.
    // ------------------------------------------------------------------------
    const { utilisateur } = useContext(AuthContext);

    // ------------------------------------------------------------------------
    // 2. ÉTATS LOCAUX (REACT STATE)
    // - projets : Stocke la liste finale récupérée depuis l'API backend.
    // - chargement : Indicateur visuel pour l'expérience utilisateur (Loader/Spinner).
    // - erreur : Stocke le message d'erreur si l'appel réseau échoue.
    // ------------------------------------------------------------------------
    const [projets, setProjets] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    // ------------------------------------------------------------------------
    // 3. EFFET DE BORD (USEEFFECT) : CHARGEMENT ASYNCHRONE DES DONNÉES
    // S'exécute au montage du composant ou dès que 'utilisateur.id' change.
    // ------------------------------------------------------------------------
    useEffect(() => {
        // Flag de sécurité : évite de mettre à jour l'état si le composant est démonté
        let estMonte = true;

        // Contrôleur JS natif pour annuler la requête HTTP si le composant est démonté avant la fin
        const controller = new AbortController();

        const chargerProjets = async () => {
            // Guard clause : On s'assure d'avoir un identifiant utilisateur valide
            if (!utilisateur?.id) return;

            try {
                // Initialisation des états avant le lancement de la promesse
                setChargement(true);
                setErreur(null);

                // Appel à la couche d'abstraction API (dossier ../api)
                const donnees = await getProjetsParUtilisateur(utilisateur.id, { signal: controller.signal });
                
                // Mise à jour de l'état uniquement si le composant est toujours affiché
                if (estMonte) {
                    setProjets(donnees || []);
                }
            } catch (err) {
                // Gestion des erreurs : On ignore l'annulation explicite (AbortError)
                if (estMonte && err.name !== "AbortError") {
                    setErreur(err.message || "Impossible de charger vos projets.");
                }
            } finally {
                // La phase de chargement prend fin dans tous les cas
                if (estMonte) {
                    setChargement(false);
                }
            }
        };

        chargerProjets();

        // CLEANUP FUNCTION : S'exécute au démontage du composant
        return () => {
            estMonte = false;
            controller.abort(); // Interrompt la requête réseau en cours
        };
    }, [utilisateur?.id]); // Dépendance : Se déclenche de nouveau si l'ID utilisateur change

    // ------------------------------------------------------------------------
    // 4. RENDU JSX (INTERFACE UTILISATEUR)
    // Utilité : Structure sémantique avec rendu conditionnel selon l'état réseau.
    // ------------------------------------------------------------------------
    return (
        <section className="projets-page">
            {/* EN-TÊTE DE LA PAGE */}
            <header className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div>
                    <p className="eyebrow">Organisation</p>
                    <h1>Mes projets</h1>
                    <p>Retrouvez vos espaces de travail en un coup d'œil.</p>
                </div>
                {/* Action principale : Navigation vers la création d'un projet */}
                <Link to="/projets/nouveau" className="button button-primary">
                    <span aria-hidden="true">+</span> Nouveau projet
                </Link>
            </header>

            {/* CAS 1 : ÉTAT DE CHARGEMENT */}
            {chargement && (
                <div className="empty-state">Chargement de vos projets en cours...</div>
            )}

            {/* CAS 2 : ÉTAT D'ERREUR (Sémantique 'role="alert"' pour l'accessibilité) */}
            {erreur && (
                <div className="empty-state error-state" role="alert" style={{ color: "var(--danger)" }}>
                    Erreur : {erreur}
                </div>
            )}

            {/* CAS 3 : LISTE VIDE (Succès mais aucun projet retourné) */}
            {!chargement && !erreur && projets.length === 0 && (
                <div className="empty-state" style={{ textAlign: "center", padding: "3rem", background: "var(--surface)", borderRadius: "8px" }}>
                    <p>Aucun projet n'est disponible pour le moment.</p>
                    <p style={{ marginTop: "10px", color: "var(--muted)" }}>
                        Commencez par créer votre premier projet pour organiser vos tâches.
                    </p>
                </div>
            )}

            {/* CAS 4 : AFFICHAGE DES DONNÉES (Rendu de la grille de composants) */}
            {!chargement && !erreur && projets.length > 0 && (
                <div className="project-grid">
                    {/* Itération sur la liste avec attribution de la clé unique mandatory 'key' */}
                    {projets.map((projet) => (
                        <CarteProjet key={projet.id} projet={projet} />
                    ))}
                </div>
            )}

            {/* PIED DE PAGE ET NAVIGATION SECONDAIRE */}
            <footer style={{ marginTop: "2rem" }}>
                <Link to="/dashboard" className="button button-secondary">
                    <span aria-hidden="true">←</span> Retour au tableau de bord
                </Link>
            </footer>
        </section>
    );
};