# Structure du Projet DevisDem

```
devisdem/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   └── common/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── database/
│   │   └── schema.sql
│   └── package.json
│
└── README.md
```

## Description des dossiers

### Frontend
- `assets/`: Images, icônes et autres ressources statiques
- `components/`: Composants React réutilisables
  - `auth/`: Composants liés à l'authentification
  - `layout/`: Composants de mise en page (Sidebar, Navbar)
  - `dashboard/`: Composants du tableau de bord
  - `clients/`: Composants liés aux clients
  - `common/`: Composants communs (boutons, inputs, etc.)
- `pages/`: Pages principales de l'application
- `store/`: État global avec Zustand
- `styles/`: Fichiers CSS
- `utils/`: Fonctions utilitaires

### Backend
- `config/`: Configuration (base de données, variables d'environnement)
- `controllers/`: Logique métier
- `middleware/`: Middleware Express (auth, validation)
- `models/`: Modèles de données
- `routes/`: Routes API
- `utils/`: Fonctions utilitaires
- `database/`: Scripts SQL et migrations 