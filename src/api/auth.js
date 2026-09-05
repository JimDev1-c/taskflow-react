const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Interroge l'API locale avec les identifiants fournis par le formulaire.
export const connecterUtilisateur = async (email, motDePasse) => {
  const parametres = new URLSearchParams({ email, motDePasse });
  const reponse = await fetch(`${API_URL}/utilisateurs?${parametres}`);
  if (!reponse.ok) throw new Error("Erreur serveur lors de la connexion");
  
  const utilisateurs = await reponse.json();
  if (utilisateurs.length === 0) {
    throw new Error("E-mail ou mot de passe incorrect");
  }
  
  return utilisateurs[0]; // Renvoie l'utilisateur trouvé
};

// Verifie l'unicite de l'e-mail puis cree le nouvel utilisateur.
export const inscrireUtilisateur = async (donneesUtilisateur) => {
  // Vérifier si l'email existe déjà
  const parametres = new URLSearchParams({ email: donneesUtilisateur.email });
  const check = await fetch(`${API_URL}/utilisateurs?${parametres}`);
  if (!check.ok) throw new Error("Erreur serveur lors de la vérification de l'e-mail");
  const existants = await check.json();
  if (existants.length > 0) throw new Error("Cet e-mail est déjà utilisé");

  const reponse = await fetch(`${API_URL}/utilisateurs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donneesUtilisateur),
  });

  if (!reponse.ok) throw new Error("Erreur lors de la création du compte");
  return await reponse.json();
};