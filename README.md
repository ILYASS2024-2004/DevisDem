# DevisDem - Application de Gestion de Devis

Application web complète pour la gestion de devis et de clients, avec authentification sécurisée et interface moderne.

## Technologies utilisées

### Frontend
- React (Vite)
- Zustand (State Management)
- React Router DOM
- Material-UI
- CSS personnalisé
- Leaflet (Cartes)

### Backend
- Node.js
- Express.js
- MySQL
- JWT (Authentification)
- Bcrypt (Hachage des mots de passe)

## Fonctionnalités principales

- Authentification sécurisée avec JWT
- Gestion des clients et des devis
- Tableau de bord interactif
- Interface responsive (mobile/desktop)
- Mode sombre/clair
- Géolocalisation
- Calcul automatique des prix
- Gestion des paiements

## Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### Installation du Frontend
```bash
cd frontend
npm install
npm run dev
```

### Installation du Backend
```bash
cd backend
npm install
# Créer un fichier .env basé sur .env.example
npm run dev
```

### Configuration de la base de données
1. Créer une base de données MySQL
2. Exécuter le script `database/schema.sql`
3. Configurer les variables d'environnement dans le fichier `.env`

## Structure du projet

Voir le fichier `project-structure.md` pour la structure détaillée du projet.

## Variables d'environnement

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=devisdem
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Développement

### Scripts disponibles

Frontend:
- `npm run dev`: Démarre le serveur de développement
- `npm run build`: Crée une version de production
- `npm run preview`: Prévisualise la version de production

Backend:
- `npm run dev`: Démarre le serveur de développement avec nodemon
- `npm start`: Démarre le serveur en mode production

## Licence

MIT 