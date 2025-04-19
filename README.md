# Documentation Backend - Système de Gestion d'Entreprise

URL : https://merngestion-frontend.onrender.com/

## Table des matières

- [Introduction](#introduction)
- [Architecture du système](#architecture-du-système)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure des dossiers](#structure-des-dossiers)
- [API Reference](#api-reference)
  - [Authentification et gestion des utilisateurs](#authentification-et-gestion-des-utilisateurs)
  - [Gestion des employés](#gestion-des-employés)
  - [Gestion des stocks](#gestion-des-stocks)
  - [Gestion des ventes](#gestion-des-ventes)
  - [Tableau de bord](#tableau-de-bord)
- [Sécurité](#sécurité)
- [Modèles de données](#modèles-de-données)
- [Middlewares](#middlewares)
- [Fonctionnalités clés](#fonctionnalités-clés)
- [Intégration avec le frontend](#intégration-avec-le-frontend)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Contrôle de version](#contrôle-de-version)
- [Auteur](#auteur)
- [Licence](#licence)

## Introduction

Ce projet implémente une API RESTful pour un système complet de gestion d'entreprise, conçu pour gérer efficacement les employés, les stocks, les ventes et l'administration des utilisateurs. Cette API sert de backend pour une application React qui offre une interface utilisateur intuitive pour toutes ces fonctionnalités.

Le système est conçu pour être modulaire, sécurisé et performant, avec une séparation claire des préoccupations entre les différentes parties du système (utilisateurs, employés, stocks, ventes). L'API est documentée de manière exhaustive pour faciliter son utilisation et son extension.

### Objectifs du projet

- Fournir une solution robuste pour la gestion d'entreprise
- Offrir une API RESTful complète et bien documentée
- Implémenter des mesures de sécurité solides avec authentification JWT
- Permettre une gestion efficace des employés, des stocks et des ventes
- Fournir des statistiques et analyses pour la prise de décision
- Intégrer la génération de documents (factures en PDF)

## Architecture du système

Le backend est organisé selon une architecture MVC (Modèle-Vue-Contrôleur) adaptée aux API REST :

- **Modèles** : Définissent la structure des données et interagissent avec MongoDB
- **Contrôleurs** : Contiennent la logique métier et gèrent les requêtes/réponses
- **Routes** : Définissent les points d'entrée de l'API et dirigent les requêtes vers les contrôleurs appropriés
- **Middlewares** : Gèrent l'authentification, l'autorisation et d'autres fonctionnalités transversales

L'architecture est modulaire, avec une séparation claire entre les différents domaines fonctionnels (gestion des utilisateurs, des employés, des stocks, des ventes).

## Technologies utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript côté serveur
- **Express.js** - Framework web pour Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM (Object Data Modeling) pour MongoDB
- **JWT (JSON Web Tokens)** - Pour l'authentification et la sécurité
- **Bcrypt** - Pour le hachage sécurisé des mots de passe
- **PDFKit** - Pour la génération de factures PDF

### Outils de développement
- **ES Modules** - Système de modules JavaScript moderne
- **Dotenv** - Pour la gestion des variables d'environnement
- **Cors** - Pour gérer les requêtes cross-origin

## Installation

Pour installer et exécuter le backend, suivez ces étapes :

1. Clonez le dépôt :
```bash
git clone https://github.com/TugoMC/merngestion
cd merngestion/backend
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du dossier backend avec les variables suivantes :
```
PORT=5000
MONGO_URI=votre_uri
JWT_SECRET=votre_clef_secrete_jwt
```

4. Démarrez le serveur de développement :
```bash
npm run dev
```

## Configuration

Le système utilise des variables d'environnement pour la configuration, stockées dans un fichier `.env` :

| Variable    | Description                                      | Valeur par défaut |
|-------------|--------------------------------------------------|-------------------|
| PORT        | Port sur lequel le serveur écoute                | 5000              |
| MONGO_URI   | URI de connexion à la base de données MongoDB    | -                 |
| JWT_SECRET  | Clé secrète pour signer les tokens JWT           | -                 |

## Structure des dossiers

```
backend/
├── controllers/            # Logique métier
│   ├── admin/              # Contrôleurs pour l'administration  
│   ├── gestionEmploye/     # Contrôleurs pour la gestion des employés
│   ├── gestionStock/       # Contrôleurs pour la gestion des stocks
│   ├── gestionUser/        # Contrôleurs pour la gestion des utilisateurs
│   └── gestionVentes/      # Contrôleurs pour la gestion des ventes
├── middleware/             # Middleware d'authentification et d'autorisation
├── models/                 # Schémas et modèles Mongoose
│   ├── gestionEmploye/     # Modèles pour les employés
│   ├── gestionStock/       # Modèles pour les produits
│   ├── gestionUser/        # Modèles pour les utilisateurs
│   └── gestionVentes/      # Modèles pour les ventes
├── routes/                 # Définitions des routes API
│   ├── admin/              # Routes d'administration
│   ├── gestionEmploye/     # Routes pour la gestion des employés
│   ├── gestionStock/       # Routes pour la gestion des stocks
│   ├── gestionUser/        # Routes pour la gestion des utilisateurs
│   └── gestionVentes/      # Routes pour la gestion des ventes
├── invoices/               # Dossier pour stocker les factures générées
├── .env                    # Variables d'environnement
├── package.json            # Dépendances et scripts
└── server.js              # Point d'entrée de l'application
```

## API Reference

### Authentification et gestion des utilisateurs

| Méthode | Endpoint               | Description                                | Authentification requise | Rôle requis |
|---------|------------------------|--------------------------------------------|--------------------------|-------------|
| POST    | /api/auth/register     | Inscription d'un nouvel utilisateur        | Non                      | -           |
| POST    | /api/auth/login        | Connexion utilisateur                      | Non                      | -           |
| GET     | /api/users/me          | Obtenir le profil utilisateur courant      | Oui                      | -           |
| GET     | /api/users             | Obtenir tous les utilisateurs              | Oui                      | Admin       |
| GET     | /api/users/:id         | Obtenir un utilisateur par ID              | Oui                      | Admin       |
| PUT     | /api/users/:id         | Mettre à jour un utilisateur               | Oui                      | Admin       |
| DELETE  | /api/users/:id         | Supprimer un utilisateur                   | Oui                      | Admin       |

#### Exemple de demande d'authentification

```json
// POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Exemple de réponse

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Gestion des employés

| Méthode | Endpoint                 | Description                           | Authentification requise | Rôle requis |
|---------|--------------------------|---------------------------------------|--------------------------|-------------|
| GET     | /api/employees           | Obtenir tous les employés             | Oui                      | -           |
| GET     | /api/employees/:id       | Obtenir un employé par ID             | Oui                      | -           |
| POST    | /api/employees           | Créer un nouvel employé               | Oui                      | Admin       |
| PUT     | /api/employees/:id       | Mettre à jour un employé              | Oui                      | Admin       |
| DELETE  | /api/employees/:id       | Supprimer un employé                  | Oui                      | Admin       |
| GET     | /api/employees/search    | Rechercher des employés               | Oui                      | -           |

#### Exemple de demande de création d'employé

```json
// POST /api/employees
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+33612345678",
  "position": "Développeur Full Stack",
  "department": "IT",
  "hireDate": "2023-01-15",
  "salary": 45000
}
```

### Gestion des stocks

| Méthode | Endpoint                    | Description                      | Authentification requise | Rôle requis |
|---------|-----------------------------|---------------------------------|--------------------------|-------------|
| GET     | /api/products               | Obtenir tous les produits        | Oui                      | -           |
| GET     | /api/products/:id           | Obtenir un produit par ID        | Oui                      | -           |
| POST    | /api/products               | Créer un nouveau produit         | Oui                      | Admin       |
| PUT     | /api/products/:id           | Mettre à jour un produit         | Oui                      | Admin       |
| DELETE  | /api/products/:id           | Supprimer un produit             | Oui                      | Admin       |
| GET     | /api/products/search        | Rechercher des produits          | Oui                      | -           |
| GET     | /api/products/low-stock     | Obtenir les produits à stock bas | Oui                      | -           |
| PATCH   | /api/products/:id/quantity  | Mettre à jour la quantité        | Oui                      | -           |

#### Exemple de demande de création de produit

```json
// POST /api/products
{
  "name": "Écran 27\" 4K",
  "description": "Écran haute résolution pour professionnels",
  "category": "Électronique",
  "price": 349.99,
  "quantity": 15,
  "lowStockThreshold": 3,
  "supplier": "TechSupplier",
  "sku": "SCR-4K-27"
}
```

### Gestion des ventes

| Méthode | Endpoint                          | Description                      | Authentification requise | Rôle requis |
|---------|-----------------------------------|----------------------------------|--------------------------|-------------|
| GET     | /api/orders                       | Obtenir toutes les commandes     | Oui                      | -           |
| GET     | /api/orders/:id                   | Obtenir une commande par ID      | Oui                      | -           |
| POST    | /api/orders                       | Créer une nouvelle commande      | Oui                      | -           |
| PATCH   | /api/orders/:id/status            | Mettre à jour le statut          | Oui                      | -           |
| PATCH   | /api/orders/:id/payment           | Mettre à jour le statut de paiement | Oui                  | -           |
| GET     | /api/orders/:id/invoice           | Générer une facture PDF          | Oui                      | -           |
| GET     | /api/orders/:id/invoice/download  | Télécharger une facture          | Oui                      | -           |

#### Exemple de demande de création de commande

```json
// POST /api/orders
{
  "customer": {
    "name": "Entreprise ABC",
    "email": "contact@entrepriseabc.com",
    "address": "123 Rue du Commerce, 75001 Paris",
    "phone": "+33123456789"
  },
  "items": [
    {
      "product": "60d21b4667d0d8992e610c85",
      "quantity": 2
    },
    {
      "product": "60d21b4667d0d8992e610c86",
      "quantity": 5
    }
  ],
  "paymentMethod": "bank_transfer",
  "notes": "Livraison urgente requise"
}
```

### Tableau de bord

| Méthode | Endpoint             | Description                            | Authentification requise | Rôle requis |
|---------|----------------------|----------------------------------------|--------------------------|-------------|
| GET     | /api/dashboard       | Obtenir les statistiques du dashboard  | Oui                      | -           |
| GET     | /api/public/dashboard | Obtenir les statistiques publiques     | Non                      | -           |

#### Exemple de réponse du tableau de bord

```json
{
  "sales": {
    "totalOrders": 156,
    "totalSales": 45628.75,
    "ordersByStatus": {
      "pending": 12,
      "processing": 18,
      "shipped": 25,
      "delivered": 95,
      "cancelled": 6
    },
    "salesByDay": [
      {
        "_id": "2023-09-01",
        "totalAmount": 1250.85,
        "count": 5
      },
      // autres jours...
    ]
  },
  "products": {
    "totalProducts": 75,
    "lowStockCount": 8,
    "lowStockPercentage": 10.67,
    "productsByCategory": {
      "Électronique": 25,
      "Mobilier": 15,
      "Fournitures": 35
    }
  },
  "employees": {
    "totalEmployees": 24,
    "newEmployees": 3,
    "employeesByDepartment": {
      "IT": 8,
      "Ventes": 6,
      "Comptabilité": 4,
      "RH": 3,
      "Marketing": 3
    }
  },
  "users": {
    "totalUsers": 30,
    "usersByRole": {
      "admin": 5,
      "employe": 25
    },
    "newUsers": 4
  }
}
```

## Sécurité

Le système implémente plusieurs mesures de sécurité pour protéger les données et assurer que seuls les utilisateurs autorisés peuvent accéder à certaines fonctionnalités :

### Authentification JSON Web Token (JWT)

L'API utilise JWT pour l'authentification. Lorsqu'un utilisateur se connecte, un token JWT est généré et signé avec une clé secrète. Ce token doit être inclus dans l'en-tête `Authorization` de chaque requête à un endpoint protégé.

Exemple d'en-tête d'authentification :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Contrôle d'accès basé sur les rôles

Le système implémente un contrôle d'accès basé sur les rôles (RBAC), avec deux rôles principaux :
- **admin** : Accès complet à toutes les fonctionnalités
- **employe** : Accès limité aux opérations de lecture et aux fonctionnalités non administratives

### Hachage des mots de passe

Les mots de passe des utilisateurs sont hachés à l'aide de bcrypt avant d'être stockés dans la base de données, garantissant que même en cas de violation de données, les mots de passe ne peuvent pas être récupérés.

### Protection CORS

L'API est configurée avec des restrictions CORS pour limiter les domaines autorisés à communiquer avec le backend.

## Modèles de données

### Utilisateur (User)
```javascript
{
  name: String,          // Nom complet de l'utilisateur
  email: String,         // Email unique
  password: String,      // Mot de passe haché
  role: String,          // 'admin' ou 'employe'
  createdAt: Date,       // Date de création
  updatedAt: Date        // Date de dernière mise à jour
}
```

### Employé (Employee)
```javascript
{
  firstName: String,     // Prénom
  lastName: String,      // Nom de famille
  email: String,         // Email unique
  phone: String,         // Numéro de téléphone
  position: String,      // Poste occupé
  department: String,    // Département
  hireDate: Date,        // Date d'embauche
  salary: Number,        // Salaire
  createdAt: Date,       // Date de création
  updatedAt: Date        // Date de dernière mise à jour
}
```

### Produit (Product)
```javascript
{
  name: String,          // Nom du produit
  description: String,   // Description
  category: String,      // Catégorie
  price: Number,         // Prix unitaire
  quantity: Number,      // Quantité en stock
  lowStockThreshold: Number, // Seuil d'alerte de stock bas
  supplier: String,      // Fournisseur
  sku: String,           // Code produit unique
  isLowStock: Boolean,   // Indicateur virtuel de stock bas
  createdAt: Date,       // Date de création
  updatedAt: Date        // Date de dernière mise à jour
}
```

### Commande (Order)
```javascript
{
  customer: {
    name: String,        // Nom du client
    email: String,       // Email du client
    address: String,     // Adresse de livraison
    phone: String        // Téléphone du client
  },
  items: [{
    product: ObjectId,   // Référence au produit
    quantity: Number,    // Quantité commandée
    price: Number        // Prix au moment de la commande
  }],
  totalAmount: Number,   // Montant total
  status: String,        // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  paymentMethod: String, // 'cash', 'credit_card', 'bank_transfer'
  paymentStatus: String, // 'pending', 'paid', 'refunded'
  invoiceNumber: String, // Numéro de facture unique
  notes: String,         // Notes additionnelles
  createdAt: Date,       // Date de création
  updatedAt: Date        // Date de dernière mise à jour
}
```

## Middlewares

### Authentification (auth.js)
Vérifie la présence et la validité du token JWT dans l'en-tête de la requête.

```javascript
// Exemple d'utilisation
router.get('/protected-route', verifyToken, controller.method);
```

### Contrôle des rôles (checkRole.js)
Vérifie si l'utilisateur authentifié a le rôle requis pour accéder à une ressource.

```javascript
// Exemple d'utilisation
router.post('/admin-only', verifyToken, isAdmin, controller.method);
```

## Fonctionnalités clés

### Génération de factures PDF

Le système peut générer des factures au format PDF à l'aide de PDFKit. Les factures incluent :
- Informations sur l'entreprise
- Détails du client
- Liste des produits achetés
- Prix unitaires et quantités
- Montant total

Les factures sont générées sur demande et stockées dans le dossier `invoices/` pour un téléchargement ultérieur.

### Alertes de stock faible

Le système surveille automatiquement les niveaux de stock et signale les produits dont la quantité est inférieure ou égale au seuil défini (`lowStockThreshold`). Cela permet de prévenir les ruptures de stock.

### Statistiques du tableau de bord

Le tableau de bord fournit des statistiques en temps réel sur :
- Les ventes (totales, par statut, par jour)
- Les produits (total, par catégorie, pourcentage de stock faible)
- Les employés (total, par département, nouveaux employés)
- Les utilisateurs (total, par rôle, nouveaux utilisateurs)

Ces statistiques sont utilisées pour générer des visualisations dans l'interface utilisateur React.

## Intégration avec le frontend

Le backend est conçu pour s'intégrer parfaitement avec une application React qui utilise Vite comme bundler. Les principales considérations d'intégration sont :

- Configuration CORS pour accepter les requêtes de `http://localhost:5173` (port par défaut de Vite)
- API RESTful cohérente pour faciliter l'intégration avec des bibliothèques comme Axios ou fetch
- Réponses JSON structurées pour un traitement facile côté client
- Gestion des erreurs standardisée pour une meilleure expérience utilisateur

L'application frontend utilise :
- React pour l'interface utilisateur
- React Router pour la navigation
- État global (Context API ou Redux) pour gérer les données
- Axios pour les appels API
- Recharts ou D3.js pour les visualisations de données

## Tests

Des tests unitaires et d'intégration peuvent être ajoutés en utilisant Jest et Supertest. Ces tests assurent que :
- Les endpoints API fonctionnent comme prévu
- Les contrôleurs traitent correctement les données
- Les modèles valident correctement les données
- Les middlewares d'authentification et d'autorisation fonctionnent correctement

Pour exécuter les tests :
```bash
npm test
```

## Déploiement

Le backend peut être déployé sur diverses plateformes :

### Déploiement sur un VPS ou un serveur dédié
1. Cloner le dépôt
2. Installer les dépendances avec `npm install --production`
3. Configurer les variables d'environnement
4. Utiliser PM2 pour gérer le processus Node.js :
   ```bash
   npm install -g pm2
   pm2 start server.js --name "gestion-entreprise-api"
   ```

### Déploiement sur des plateformes cloud
Le système est compatible avec les plateformes comme :
- Heroku
- AWS Elastic Beanstalk
- Google App Engine
- Azure App Service

## Contrôle de version

Ce projet utilise [Git](https://git-scm.com/) pour le contrôle de version. Vous pouvez consulter l'historique des commits pour suivre l'évolution du projet.

## Auteur

Ouattara kouakou junior - ouattarajunior418@gmail.com

Portfolio: ...
LinkedIn: https://www.linkedin.com/in/kouakou-junior-ouattara-aa9b36322/
GitHub: https://github.com/TugoMC

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

© 2025 Ouattarajr. Tous droits réservés.
