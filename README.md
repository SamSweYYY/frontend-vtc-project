# VTC Manager - Frontend

Application web de gestion de VTC (Véhicules de Tourisme avec Chauffeur) permettant aux clients de réserver des trajets, aux chauffeurs de gérer leurs courses et aux administrateurs de superviser la plateforme.

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [Règles de Gestion](#-règles-de-gestion)
- [Contribuer](#-contribuer)

---

## 🎯 Vue d'ensemble

**VTC Manager** est une plateforme de réservation de trajets en VTC avec trois rôles principaux :

- **👤 Client** : Créer des réservations, consulter l'historique, gérer son profil
- **🚗 Chauffeur** : Accepter des réservations, gérer sa position GPS, consulter ses courses
- **⚙️ Admin** : Gérer les chauffeurs, les catégories de service, consulter les statistiques

---

## ✨ Fonctionnalités

### Client
- ✅ Inscription et connexion sécurisée
- ✅ Créer une réservation (départ, arrivée, date, catégorie de service)
- ✅ Consulter ses réservations en temps réel (statut : en_attente, confirmée, en_cours, terminée, annulée)
- ✅ Voir les réservations passées
- ✅ Annuler une réservation
- ✅ Modifier son profil

### Chauffeur
- ✅ Inscription et connexion
- ✅ Consulter les réservations disponibles
- ✅ Accepter/Refuser une réservation
- ✅ Mettre à jour sa position GPS (latitude, longitude)
- ✅ Changer de statut (disponible, en_course, en_pause, hors_service)
- ✅ Consulter ses courses et l'historique
- ✅ Gérer son profil (véhicule, catégorie de service)

### Admin
- ✅ Consulter tous les chauffeurs et clients
- ✅ Créer/Modifier/Supprimer des chauffeurs
- ✅ Gérer les catégories de service (eco, confort, van)
- ✅ Consulter les réservations et courses
- ✅ Voir les statistiques de la plateforme
- ✅ Gérer les utilisateurs

---

## 🛠️ Stack Technique

### Frontend
- **React 18** - Librairie UI
- **TypeScript** - Typage statique
- **Vite** - Bundler et dev server
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Bootstrap 5** - Composants UI
- **React Bootstrap** - Composants Bootstrap pour React
- **Google Maps API** - Cartographie et localisation

### DevOps & Tools
- **Axios** - Client HTTP
- **ESLint** - Linting
- **TypeScript Compiler** - Compilation TS
- **PostCSS & Autoprefixer** - Traitement CSS
- **GitHub Pages** - Déploiement

### Backend (API)
- **Node.js** - Runtime
- **Express.js** (supposé) - Framework web
- **MongoDB** - Base de données
- **Mongoose** - ODM MongoDB

---

## 📦 Installation

### Prérequis système

#### Obligatoire
- **Node.js** 16.0.0 ou supérieur
  - Vérifier : `node --version`
  - [Télécharger Node.js](https://nodejs.org/)
- **npm** 8.0.0 ou supérieur (inclus avec Node.js)
  - Vérifier : `npm --version`
- **MongoDB** 4.0 ou supérieur (pour le backend)
  - Vérifier : `mongod --version`
  - [Télécharger MongoDB Community](https://www.mongodb.com/try/download/community)
  - **Ou** utiliser [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud gratuit)

#### Recommandé
- **Git** pour cloner le repository
  - [Télécharger Git](https://git-scm.com/)
- **Visual Studio Code** pour le développement
  - [Télécharger VS Code](https://code.visualstudio.com/)
- **Postman** ou **Insomnia** pour tester l'API
  - [Postman](https://www.postman.com/downloads/)
- **MongoDB Compass** pour gérer la base de données
  - [Télécharger Compass](https://www.mongodb.com/products/compass)

#### Configuration requise
- **Backend VTC Manager** en cours d'exécution (voir section backend)
- **Base de données MongoDB** accessible
- **Clé API Google Maps** (gratuite)
- **Connexion Internet** pour les CDN et APIs externes

### Étapes d'installation

#### 1️⃣ Cloner le repository

```bash
git clone https://github.com/SamSweYYY/frontend-vtc-project.git
cd frontend-vtc-project
```

#### 2️⃣ Installer les dépendances

```bash
npm install
```

**Durée estimée** : 2-5 minutes selon votre connexion Internet

Vérifier que tout s'est bien installé :
```bash
npm list
```

#### 3️⃣ Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```bash
# Linux/Mac
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

**Ou créer le fichier manuellement** : Créer `.env.local` à la racine et ajouter :

```env
# API Backend
VITE_API_BASE_URL=http://localhost:3000/api

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE

# Environnement
VITE_APP_ENV=development
```

**Variables détaillées** :

| Variable | Description | Valeur par défaut | Exemple |
|----------|-------------|-------------------|---------|
| `VITE_API_BASE_URL` | URL de l'API backend | `http://localhost:3000/api` | `http://localhost:3000/api` ou `https://api.example.com` |
| `VITE_GOOGLE_MAPS_API_KEY` | Clé API Google Maps | - | `AIzaSyD...` |
| `VITE_APP_ENV` | Environnement (dev/prod) | `development` | `development` ou `production` |

**Comment obtenir la clé Google Maps API** :
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer les APIs : Maps JavaScript API, Geolocation API
4. Créer une clé API (Web)
5. Copier la clé dans `VITE_GOOGLE_MAPS_API_KEY`

#### 4️⃣ Vérifier l'installation

```bash
# Vérifier les dépendances
npm list

# Vérifier les configs
npm run lint

# Vérifier que tout compile
npm run build
```

#### 5️⃣ Lancer le serveur de développement

```bash
npm run dev
```

**Résultat attendu** :
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

L'application s'ouvrira automatiquement sur `http://localhost:5173` 🎉

### Configuration supplémentaire

#### 🔧 Installation et démarrage du Backend

Le backend est un serveur Express.js qui doit être en cours d'exécution pour que le frontend fonctionne correctement.

##### Localisation du backend

```
c:\Users\samla\code\projet-vtc-express\backend
```

##### Prérequis backend

- **Node.js** 16+
- **MongoDB** 4.0+ (local ou MongoDB Atlas)
  - **Local** : Service MongoDB doit être en cours d'exécution
  - **Atlas** : Créer un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

##### Étapes d'installation du backend

1. **Naviguer vers le dossier backend**
```bash
cd c:\Users\samla\code\projet-vtc-express\backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement** (fichier `.env`)
```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/vtc_db

# Port du serveur
PORT=3000
```

**Options pour MONGO_URI** :
- **Local** : `mongodb://localhost:27017/vtc_db`
- **MongoDB Atlas** : `mongodb+srv://username:password@cluster.mongodb.net/vtc_db?retryWrites=true&w=majority`

4. **Démarrer le serveur backend**
```bash
npm start
```

**Résultat attendu** :
```
Server is running on port 3000
Connected to MongoDB
```

5. **Vérifier le backend**
```bash
# Tester l'API
curl http://localhost:3000/api/

# Ou utiliser Postman
GET http://localhost:3000/api/
```

##### Stack technique du backend

| Composant | Version | Description |
|-----------|---------|-------------|
| Express.js | 4.22.1 | Framework web |
| Mongoose | 8.23.0 | ODM MongoDB |
| MongoDB | 6.10.0 | Driver MongoDB |
| bcrypt | 6.0.0 | Chiffrement des mots de passe |
| CORS | 2.8.6 | Gestion CORS |
| dotenv | 17.3.1 | Variables d'environnement |

##### Architecture backend

```
backend/
├── server.js              # Point d'entrée
├── app.js                 # Configuration Express
├── chauffeurs.js          # Routes des chauffeurs
├── .env                   # Variables d'environnement
├── package.json           # Dépendances
└── node_modules/          # Dépendances installées
```

##### Endpoints API principaux

```
Base URL: http://localhost:3000/api

GET    /api/users          # Lister les utilisateurs
POST   /api/auth/login     # Connexion
POST   /api/auth/signup    # Inscription
GET    /api/drivers        # Lister les chauffeurs
GET    /api/reservations   # Lister les réservations
GET    /api/categories     # Lister les catégories
```

##### Troubleshooting backend

**❌ Erreur : `ECONNREFUSED` sur MongoDB**
```bash
# Vérifier que MongoDB est en cours d'exécution
mongod --version

# Ou utiliser MongoDB Atlas (cloud)
# Mettre à jour MONGO_URI dans .env
```

**❌ Erreur : `Port 3000 already in use`**
```bash
# Tuer le processus sur le port 3000
# Windows (PowerShell admin):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

**❌ Erreur : `Cannot find module`**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### MongoDB - Configuration locale

1. **Installer MongoDB Community** :
   - [Télécharger MongoDB](https://www.mongodb.com/try/download/community)
   - Suivre le guide d'installation

2. **Vérifier l'installation** :
```bash
mongod --version
```

3. **Démarrer MongoDB** (selon votre OS) :

**Windows (avec MongoDB installé) :**
```bash
# MongoDB se lance automatiquement comme service
# Ou manuellement :
mongod --dbpath "C:\data\db"
```

**Linux/Mac** :
```bash
mongod
```

4. **Vérifier la connexion** :
```bash
# Depuis une autre terminal
mongosh
# Ou ancienne version
mongo
```

#### MongoDB Atlas - Configuration cloud

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Créer un utilisateur de base de données
4. Copier la chaîne de connexion
5. Mettre à jour dans `.env` du backend :
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vtc_db?retryWrites=true&w=majority
```

#### Démarrer le frontend ET le backend

**Option 1 : Deux terminaux**
```bash
# Terminal 1 - Backend
cd c:\Users\samla\code\projet-vtc-express\backend
npm start

# Terminal 2 - Frontend
cd c:\Users\samla\OneDrive\Documents\code\frontend-vtc-project
npm run dev
```

**Option 2 : Avec concurrently (si installé)**
```bash
npm install --save-dev concurrently

# Dans package.json du frontend
"dev": "concurrently \"cd ../backend && npm start\" \"vite\""

npm run dev
```

#### Utilisateurs de test

Des comptes de test sont disponibles pour tester rapidement :

- **Client** : `client@test.com` / `password123`
- **Chauffeur** : `driver@test.com` / `password123`
- **Admin** : `admin@test.com` / `password123`

Accéder à la page de sélection : [localhost:5173/test-users](http://localhost:5173/test-users)

### Troubleshooting Installation

#### ❌ Erreur : `node: command not found`
**Solution** : Node.js n'est pas installé ou n'est pas dans le PATH
```bash
node --version   # Vérifier l'installation
# Installer depuis https://nodejs.org/
```

#### ❌ Erreur : `npm ERR! code ERESOLVE`
**Solution** : Conflit de dépendances
```bash
# Forcer l'installation
npm install --force

# Ou nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Erreur : `EADDRINUSE: address already in use :::5173`
**Solution** : Le port 5173 est déjà utilisé
```bash
# Utiliser un autre port
npm run dev -- --port 5174
```

#### ❌ Erreur : `Cannot find module`
**Solution** : Réinstaller les dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Erreur : `Google Maps n'affiche pas`
**Solution** : Vérifier la clé API
```bash
# Dans le fichier .env.local
VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY
# Vérifier dans Google Cloud Console que les APIs sont activées
```

### Installation pour la production

#### Build optimisé

```bash
npm run build
```

Cela crée un dossier `dist/` avec les fichiers optimisés.

#### Prévisualiser la build

```bash
npm run preview
```

#### Déployer sur GitHub Pages

```bash
npm run deploy
```

### Variables d'environnement par environnement

**Développement** (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

**Production** (`.env.production`)
```env
VITE_API_BASE_URL=https://api.production.com
VITE_APP_ENV=production
```

---

## 🚀 Utilisation

### Commandes disponibles

```bash
# Développement
npm run dev              # Lancer le serveur Vite en mode dev

# Production
npm run build            # Compiler TypeScript et builder l'app
npm run preview          # Prévisualiser la build

# Linting
npm run lint             # Vérifier le code avec ESLint

# Déploiement
npm run deploy           # Déployer sur GitHub Pages
```

### Utilisateurs de test

Des utilisateurs de test sont disponibles dans `src/utils/testUsers.ts` :

```typescript
// Client
email: "client@test.com"
password: "password123"

// Chauffeur
email: "driver@test.com"
password: "password123"

// Admin
email: "admin@test.com"
password: "password123"
```

---

## 📁 Structure du Projet

```
frontend-vtc-project/
├── src/
│   ├── components/              # Composants React réutilisables
│   │   ├── Home.tsx             # Page d'accueil
│   │   ├── Landing.tsx          # Landing page
│   │   ├── LoginDriver.tsx       # Connexion chauffeur
│   │   ├── SignUp.tsx           # Inscription
│   │   ├── ClientHome.tsx       # Dashboard client
│   │   ├── DriverHome.tsx       # Dashboard chauffeur
│   │   ├── AdminDashboard.tsx   # Dashboard admin
│   │   ├── Reservation.tsx      # Créer/voir réservations
│   │   ├── MesReservations.tsx  # Mes réservations
│   │   ├── DriverList.tsx       # Liste des chauffeurs (admin)
│   │   ├── FleetMap.tsx         # Carte des chauffeurs
│   │   ├── Localisation.tsx     # Localisation GPS
│   │   ├── Profile.tsx          # Gestion du profil
│   │   ├── AddDriver.tsx        # Ajouter un chauffeur (admin)
│   │   ├── UpdateDriver.tsx     # Modifier un chauffeur
│   │   ├── DeleteDriver.tsx     # Supprimer un chauffeur
│   │   ├── Header.tsx           # En-tête/navigation
│   │   └── TestUsers.tsx        # Sélectionneur d'utilisateurs test
│   ├── utils/
│   │   ├── api.ts               # Client Axios et fonctions API
│   │   └── testUsers.ts         # Utilisateurs de test
│   ├── types.ts                 # Types TypeScript globaux
│   ├── App.tsx                  # Composant racine
│   ├── App.css                  # Styles globaux
│   ├── Home.css                 # Styles Home
│   ├── index.css                # Styles de base
│   ├── main.tsx                 # Point d'entrée React
│   └── vite-env.d.ts            # Types Vite
├── public/                      # Fichiers statiques
├── docs/
│   └── mcd.md                   # Modèle Conceptuel de Données
├── index.html                   # HTML de base
├── vite.config.ts               # Configuration Vite
├── tsconfig.json                # Configuration TypeScript
├── tailwind.config.js           # Configuration Tailwind CSS
├── postcss.config.js            # Configuration PostCSS
├── eslint.config.js             # Configuration ESLint
├── package.json                 # Dépendances et scripts
└── README.md                    # Ce fichier
```

---

## 📊 Modèle de Données

Voir [docs/mcd.md](docs/mcd.md) pour le diagramme complet.

### Entités principales

**UTILISATEUR**
```
- idUtilisateur (PK)
- nom, prenom, email (unique), motDePasse
- telephone, role (admin | chauffeur | client)
```

**CLIENT** (spécialisation UTILISATEUR)
```
- idClient (PK, FK UTILISATEUR)
```

**CHAUFFEUR** (spécialisation UTILISATEUR)
```
- idChauffeur (PK, FK UTILISATEUR)
- vehicule, disponible, statut
- latitude, longitude, lastUpdate
```

**RESERVATION**
```
- idReservation (PK)
- idClient (FK), idChauffeur (FK, nullable)
- depart, arrivee, dateCourse
- passagers, prix, statut
- idCategorie (FK)
```

**COURSE**
```
- idCourse (PK)
- idChauffeur (FK), idReservation (FK)
- date, depart, arrivee, distance, duree, prix
- statut
```

**CATEGORIE_SERVICE**
```
- idCategorie (PK)
- code (eco|confort|van), libelle, description
- passagers, prixBase, prixKm
```

---

## 📋 Règles de Gestion

- Un utilisateur possède un compte avec un rôle : client, chauffeur ou admin
- Un client peut créer aucune, une ou plusieurs réservations
- Une réservation appartient toujours à un seul client
- Une réservation peut être en attente, confirmée, en cours, terminée ou annulée
- Une réservation peut ne pas encore avoir de chauffeur assigné
- Un chauffeur peut accepter aucune, une ou plusieurs réservations
- Une réservation demande une catégorie de service : eco, confort ou van
- Un chauffeur peut être rattaché à une catégorie de service
- Un chauffeur peut avoir une position géographique : latitude, longitude
- Une course est réalisée par un chauffeur
- Une réservation peut donner lieu à une course lorsque le trajet est effectué
- Seuls les utilisateurs authentifiés peuvent accéder aux fonctionnalités
- L'admin gère toutes les données du système

---

## 🔌 API Endpoints (Backend)

### Authentification
- `POST /auth/signup` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion

### Clients
- `GET /clients/:id` - Récupérer un client
- `PUT /clients/:id` - Modifier un client
- `GET /clients/:id/reservations` - Mes réservations

### Chauffeurs
- `GET /chauffeurs` - Lister les chauffeurs
- `GET /chauffeurs/:id` - Récupérer un chauffeur
- `POST /chauffeurs` - Créer un chauffeur (admin)
- `PUT /chauffeurs/:id` - Modifier un chauffeur
- `DELETE /chauffeurs/:id` - Supprimer un chauffeur
- `PUT /chauffeurs/:id/position` - Mettre à jour la position GPS
- `PUT /chauffeurs/:id/statut` - Changer le statut

### Réservations
- `GET /reservations` - Lister les réservations
- `POST /reservations` - Créer une réservation
- `GET /reservations/:id` - Récupérer une réservation
- `PUT /reservations/:id` - Modifier une réservation
- `PUT /reservations/:id/statut` - Changer le statut
- `DELETE /reservations/:id` - Annuler une réservation

### Courses
- `GET /courses` - Lister les courses
- `GET /courses/:id` - Récupérer une course
- `PUT /courses/:id/statut` - Changer le statut

### Catégories
- `GET /categories` - Lister les catégories
- `POST /categories` - Créer une catégorie (admin)
- `PUT /categories/:id` - Modifier une catégorie (admin)
- `DELETE /categories/:id` - Supprimer une catégorie (admin)

---

## 🐛 Troubleshooting

### L'API n'est pas accessible

**❌ Erreur : `ECONNREFUSED` ou `ERR_CONNECTION_REFUSED`**

1. **Vérifier que le backend est en cours d'exécution** :
```bash
# Vérifier le port 3000
curl http://localhost:3000/api/

# Ou vérifier dans une autre terminal
netstat -ano | findstr :3000  # Windows
lsof -i :3000               # Linux/Mac
```

2. **Démarrer le backend s'il ne l'est pas** :
```bash
cd c:\Users\samla\code\projet-vtc-express\backend
npm install
npm start
# Devrait afficher: "Server is running on port 3000"
```

3. **Vérifier `VITE_API_BASE_URL` dans `.env.local`** :
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. **Vérifier la CORS sur le backend** :
   - Le backend doit avoir la CORS activée pour `http://localhost:5173`
   - Voir la configuration dans `backend/app.js`

5. **Vérifier MongoDB** :
   - Si le backend démarre mais l'API retourne une erreur :
   ```bash
   # Vérifier que MongoDB est en cours d'exécution
   mongod --version
   # Ou utiliser MongoDB Atlas (voir section MongoDB)
   ```

### Google Maps ne s'affiche pas
- Vérifier que `VITE_GOOGLE_MAPS_API_KEY` est défini dans `.env.local`
- Vérifier les restrictions de clé API dans Google Cloud Console
- Vérifier que les APIs sont activées : Maps JavaScript API, Geolocation API
- Vérifier la géolocalisation du navigateur est activée
- Vérifier les erreurs dans la console du navigateur (F12 > Console)

### Erreurs de build
```bash
npm run lint              # Vérifier les erreurs ESLint
npm run build             # Voir les erreurs TypeScript
```

### Frontend et Backend s'affichent mal
```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json dist

# Réinstaller
npm install

# Reconstruire
npm run build
npm run preview
```

### Besoin d'aide complémentaire ?

Consulter les logs détaillés :
- **Frontend** : Ouvrir la console du navigateur (F12)
- **Backend** : Regarder les logs du terminal npm start
- **MongoDB** : Utiliser MongoDB Compass ou mongosh

---

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est privé. Tous droits réservés © 2024.

---

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.

**Repository** : https://github.com/SamSweYYY/frontend-vtc-project
