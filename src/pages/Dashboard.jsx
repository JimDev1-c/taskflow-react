import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProjetsParUtilisateur } from "../api/projets";
import { getToutesLesTaches } from "../api/taches";
import { calculerStatsGlobales, calculerStatsProjet } from "../utils/statistiques";

/**
 * Composant Dashboard (Tableau de bord)
 * 
 * Vue principale affichant la synthèse de l'activité de l'utilisateur :
 * - Cartes d'indicateurs clés (KPIs : total projets, tâches, statuts, progression)
 * - Barres de progression de l'avancement par projet
 * - Liste des tâches prioritaires et urgentes à traiter
 */
export const Dashboard = () => {

  // --- ÉTATS & CONTEXTES ---
  const { utilisateur } = useContext(AuthContext);

  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);


  // --- CHARGEMENT DES DONNÉES DU DASHBOARD ---
  useEffect(() => {
    const chargerDonneesDashboard = async () => {
      if (!utilisateur) return;

      try {
        setChargement(true);
        setErreur(null);

        // Récupération simultanée des projets de l'utilisateur et de l'ensemble des tâches
        const [donneesProjets, donneesTaches] = await Promise.all([
          getProjetsParUtilisateur(utilisateur.id),
          getToutesLesTaches(),
        ]);

        // Filtrer les tâches appartenant uniquement aux projets de l'utilisateur
        const idsProjetsUser = donneesProjets.map((p) => p.id);
        const tachesUtilisateur = donneesTaches.filter((t) =>
          idsProjetsUser.includes(Number(t.projetId))
        );

        setProjets(donneesProjets);
        setTaches(tachesUtilisateur);

      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    chargerDonneesDashboard();
  }, [utilisateur]);


  // --- ÉTATS D'AFFICHAGE (Chargement & Erreur) ---
  if (chargement) return <p>Chargement du tableau de bord...</p>;
  if (erreur) return <p style={{ color: "var(--danger)" }}>Erreur : {erreur}</p>;


  // --- CALCUL DES STATISTIQUES GLOBALES ---
  const stats = calculerStatsGlobales(projets, taches);


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

      {/* --- EN-TÊTE DU DASHBOARD --- */}
      <div className="dashboard-heading">
        <div>
          <h2 style={{ margin: "0 0 5px 0" }}>
            Ravi de vous revoir, {utilisateur?.prenom || utilisateur?.nom || "Utilisateur"} 👋
          </h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Voici un aperçu de vos projets et de l'avancement de vos tâches.
          </p>
        </div>

        <Link className="dashboard-button" to="/projets">
          Voir mes projets <span aria-hidden="true">→</span>
        </Link>
      </div>


      {/* --- SECTION 1 : CARTES D'INDICATEURS (KPIs) --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
        }}
      >
        <CarteStat title="Total Projets" value={stats.totalProjets} color="#2d7c82" />
        <CarteStat title="Total Tâches" value={stats.totalTaches} color="#e08a4a" />
        <CarteStat title="À faire" value={stats.aFaire} color="#7a8c8d" />
        <CarteStat title="En cours" value={stats.enCours} color="#d98252" />
        <CarteStat title="Terminées" value={stats.terminees} color="#3b9b78" />
        <CarteStat title="Progression Globale" value={`${stats.pourcentageGlobal}%`} color="#e26652" />
      </div>


      {/* --- SECTION 2 : AVANCEMENT DES PROJETS & URGENCES --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>

        {/* Bloc 2.1 : Progression projet par projet */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Avancement des Projets</h3>

          {projets.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Aucun projet disponible.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {projets.map((projet) => {
                const tachesDuProjet = taches.filter((t) => Number(t.projetId) === projet.id);
                const { total, pourcentage } = calculerStatsProjet(tachesDuProjet);

                return (
                  <div key={projet.id}>
                    
                    {/* Nom du projet et ratio de progression */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
                      <Link to={`/projets/${projet.id}`} style={{ textDecoration: "none", color: "var(--text)", fontWeight: "bold" }}>
                        {projet.nom}
                      </Link>
                      <span style={{ color: "var(--muted)" }}>{pourcentage}% ({total} tâches)</span>
                    </div>

                    {/* Barre de progression visuelle */}
                    <div style={{ width: "100%", background: "var(--track)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pourcentage}%`,
                          background: projet.couleur || "#2d7c82",
                          height: "100%",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>


        {/* Bloc 2.2 : Liste des Tâches Urgentes / Prioritaires */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Tâches Prioritaires / Urgentes</h3>

          {stats.tachesUrgentes.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Aucune tâche urgente à traiter.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {stats.tachesUrgentes.map((tache) => (
                <li
                  key={tache.id}
                  style={{
                    padding: "10px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Détails de la tâche */}
                  <div>
                    <strong style={{ display: "block", fontSize: "14px" }}>{tache.titre}</strong>
                    <small style={{ color: "var(--muted)" }}>Échéance : {tache.echeance}</small>
                  </div>

                  {/* Badge de priorité */}
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: "#FFF",
                      background: tache.priorite === "haute" ? "#c44f5a" : tache.priorite === "moyenne" ? "#d98252" : "#7a8c8d",
                    }}
                  >
                    {tache.priorite}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
};


/**
 * Composant Interne : CarteStat
 * Rendu réutilisable d'une carte d'indicateur KPI
 */

const CarteStat = ({ title, value, color }) => (
  <div
    style={{
      background: "var(--surface)",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderTop: `4px solid ${color}`,
    }}
  >
    <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: "bold" }}>
      {title}
    </span>
    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0 0 0", color: "var(--text)" }}>
      {value}
    </p>
  </div>
);