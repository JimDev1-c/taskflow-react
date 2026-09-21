import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProjetsParUtilisateur } from "../api/projets";
import { getToutesLesTaches } from "../api/taches";
import { calculerStatsGlobales, calculerStatsProjet } from "../utils/statistiques";

const libelleStatut = { a_faire: "À faire", en_cours: "En cours", terminee: "Terminée" };
const libellePriorite = { basse: "Basse", moyenne: "Moyenne", haute: "Haute" };

export const Dashboard = () => {
  const { utilisateur } = useContext(AuthContext);
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const charger = async () => {
      if (!utilisateur?.id) return;
      try {
        setChargement(true);
        const [donneesProjets, donneesTaches] = await Promise.all([getProjetsParUtilisateur(utilisateur.id), getToutesLesTaches()]);
        const ids = new Set(donneesProjets.map((projet) => String(projet.id)));
        setProjets(donneesProjets);
        setTaches(donneesTaches.filter((tache) => ids.has(String(tache.projetId))));
      } catch (err) {
        setErreur(err.message || "Impossible de charger le tableau de bord.");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [utilisateur?.id]);

  if (chargement) return <p>Chargement du tableau de bord...</p>;
  if (erreur) return <p role="alert" style={{ color: "var(--danger)" }}>Erreur : {erreur}</p>;

  const stats = calculerStatsGlobales(projets, taches);
  const recentes = [...taches].sort((a, b) => new Date(b.creeLe) - new Date(a.creeLe)).slice(0, 5);
  const maximum = Math.max(stats.aFaire, stats.enCours, stats.terminees, 1);

  return (
    <div className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bonjour {utilisateur?.prenom || utilisateur?.nom || "!"}, voici l'état de vos projets.</p>
        </div>
        <Link className="dashboard-button" to="/projets?nouveau=1"><span aria-hidden="true">+</span> Nouveau projet</Link>
      </header>

      <section className="dashboard-kpis" aria-label="Indicateurs clés">
        <CarteStat title="Projets" value={stats.totalProjets} detail={`${projets.filter((projet) => taches.some((tache) => String(tache.projetId) === String(projet.id) && tache.statut !== "terminee")).length} actifs`} color="#2d7c82" />
        <CarteStat title="Total tâches" value={stats.totalTaches} detail="tous projets confondus" color="#e08a4a" />
        <CarteStat title="En cours" value={stats.enCours} detail="à terminer bientôt" color="#d98252" />
        <CarteStat title="Terminées" value={stats.terminees} detail={`${stats.pourcentageGlobal}% du total`} color="#3b9b78" />
      </section>

      <section className="dashboard-panels">
        <div className="dashboard-panel">
          <h2>Répartition des tâches par statut</h2>
          <div className="status-chart">
            {[['a_faire', stats.aFaire], ['en_cours', stats.enCours], ['terminee', stats.terminees]].map(([statut, valeur]) => (
              <div className="status-bar" key={statut}>
                <strong>{valeur}</strong>
                <span className={`status-bar-fill ${statut}`} style={{ height: `${(valeur / maximum) * 118}px` }} />
                <small>{libelleStatut[statut]}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-panel">
          <h2>Avancement par projet</h2>
          <div className="project-progress-list">
            {projets.map((projet) => {
              const statistiques = calculerStatsProjet(taches.filter((tache) => String(tache.projetId) === String(projet.id)));
              return <div key={projet.id} className="project-progress"><div><Link to={`/projets/${projet.id}`}>{projet.nom}</Link><span>{statistiques.pourcentage}%</span></div><i><b style={{ width: `${statistiques.pourcentage}%`, background: projet.couleur || "var(--accent)" }} /></i></div>;
            })}
          </div>
        </div>
      </section>

      <section className="dashboard-panel dashboard-recent">
        <div className="dashboard-section-title"><h2>Tâches récentes</h2><Link to="/projets">Voir les projets</Link></div>
        {recentes.length === 0 ? <p className="muted">Aucune tâche à afficher.</p> : <div className="table-scroll"><table><thead><tr><th>Tâche</th><th>Projet</th><th>Priorité</th><th>Échéance</th><th>Statut</th></tr></thead><tbody>{recentes.map((tache) => {
          const projet = projets.find((item) => String(item.id) === String(tache.projetId));
          return <tr key={tache.id}><td><Link to={`/projets/${tache.projetId}`}>{tache.titre}</Link></td><td>{projet?.nom || "—"}</td><td><span className={`priority-badge ${tache.priorite}`}>{libellePriorite[tache.priorite]}</span></td><td>{tache.echeance?.split("-").reverse().join("/") || "—"}</td><td><span className={`status-badge ${tache.statut}`}>{libelleStatut[tache.statut]}</span></td></tr>;
        })}</tbody></table></div>}
      </section>
    </div>
  );
};

const CarteStat = ({ title, value, detail, color }) => <article className="dashboard-stat" style={{ borderTopColor: color }}><span>{title}</span><strong style={{ color }}>{value}</strong><small>{detail}</small></article>;
