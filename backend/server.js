// Importation des modules avec la syntaxe ES6
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/gestionUser/user.route.js';
import employeeRoutes from './routes/gestionEmploye/employee.route.js';
import productRoutes from './routes/gestionStock/product.route.js';
import orderRoutes from './routes/gestionVentes/order.route.js';
import dashboardRoutes from './routes/admin/dashboard.route.js';
import publicDashboardRoutes from './routes/admin/dashboard.route.js';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Créer l'application Express
const app = express();

// Middleware pour gérer les CORS avec configuration spécifique
app.use(cors({
    origin: 'http://localhost:5173', // Remplacer par l'URL de votre frontend
    credentials: true // Nécessaire pour les cookies
}));

// Middleware pour parser les données JSON
app.use(express.json());

// Routes publiques (sans authentification)
app.use('/api/public', publicDashboardRoutes);

// Routes d'authentification
app.use('/api/auth', userRoutes);

// Routes de gestion des utilisateurs
app.use('/api/users', userRoutes);

// Routes de gestion des employés
app.use('/api/employees', employeeRoutes);

// Routes de gestion des stocks
app.use('/api/products', productRoutes);

// Routes de gestion des commandes
app.use('/api/orders', orderRoutes);

// Routes du tableau de bord administratif
app.use('/api/dashboard', dashboardRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Erreur de connexion à MongoDB:', err));

// Définir une route simple pour tester le serveur
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Route pour vérifier l'état de l'API
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is working' });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Lancer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});