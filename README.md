
# TaskFlow

TaskFlow-react est une interface React de gestion de projets et de tâches. L'application utilise Vite pour le frontend et `json-server` comme API locale de démonstration.

## État actuel

Le parcours d'authentification est opérationnel : connexion, inscription, persistance de l'utilisateur dans `localStorage`, protection des routes et déconnexion. Les écrans Dashboard et Projets sont encore des points d'intégration temporaires ; les données de projets et de tâches sont toutefois présentes dans `db.json` pour préparer les prochains écrans.

## Prérequis

- Node.js 18 ou version ultérieure
- npm

## Installation

Depuis le dossier du projet :

```bash
npm install
```

## Lancer l'application

L'application et l'API doivent tourner dans deux terminaux séparés :

```bash
npm run api
```

```bash
npm run dev
```

Vite affiche ensuite l'URL locale, généralement `http://localhost:5173`.

Un autre endpoint peut être utilisé avec la variable `VITE_API_URL`.

Sous PowerShell :

```powershell
$env:VITE_API_URL = "https://example.test"; npm run dev
```

## Scripts disponibles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run api` | Démarre `json-server` sur le port 3000 |
| `npm run build` | Génère le build de production dans `dist/` |
| `npm run preview` | Sert localement le build de production |
| `npm run lint` | Analyse le code avec Oxlint |

## Organisation

```text
src/
├── api/          appels HTTP d'authentification
├── components/   layout, navigation et protection des routes
├── context/      état global de session
├── hooks/        hooks métier à compléter
├── pages/        écrans de l'application
└── utils/        fonctions de statistiques à compléter
```

Les données locales sont définies dans `db.json` avec les collections `utilisateurs`, `projets` et `taches`.

## Vérification

Avant une modification, lancer :

```bash
npm run lint
npm run build
```



## Limites de la démo

Les mots de passe sont stockés en clair dans `db.json` et les requêtes d'authentification sont destinées à un environnement local. Pour une mise en production, il faudra déléguer l'authentification à un backend sécurisé, hacher les mots de passe et ajouter une vraie stratégie de session.
