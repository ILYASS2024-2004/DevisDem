# Devis Déménagement - Frontend

Application de gestion de devis de déménagement développée avec React, Vite, et Material-UI.

## Fonctionnalités

- Authentification sécurisée avec JWT
- Tableau de bord interactif
- Gestion des clients
- Gestion des devis
- Interface responsive
- Thème sombre/clair
- Géolocalisation

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Backend API (voir le dossier `backend`)

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/devis-dem.git
cd devis-dem/frontend
```

2. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

3. Créer un fichier `.env` à la racine du projet :
```env
VITE_API_URL=http://localhost:3000
```

4. Démarrer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173).

## Scripts disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run format` : Formate le code avec Prettier

## Structure du projet

```
frontend/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── store/          # État global (Zustand)
│   ├── styles/         # Fichiers CSS
│   ├── utils/          # Utilitaires
│   ├── App.jsx         # Composant racine
│   └── main.jsx        # Point d'entrée
├── .env                # Variables d'environnement
├── .eslintrc.cjs       # Configuration ESLint
├── .gitignore          # Fichiers ignorés par Git
├── index.html          # Template HTML
├── package.json        # Dépendances et scripts
└── vite.config.js      # Configuration Vite
```

## Technologies utilisées

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add some amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
