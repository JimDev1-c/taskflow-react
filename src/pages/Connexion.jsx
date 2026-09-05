import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Connexion = () => {
  // Les champs sont controles localement avant l'appel au contexte d'authentification.
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  
  const { connexion } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      // Une connexion reussie ouvre l'espace protege de l'application.
      await connexion(email, motDePasse);
      navigate("/dashboard");
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
      <h2>Connexion à TaskFlow</h2>
      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={motDePasse} 
          onChange={(e) => setMotDePasse(e.target.value)} 
          required 
        />
        <button type="submit">Se connecter</button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
      </p>
    </div>
  );
};