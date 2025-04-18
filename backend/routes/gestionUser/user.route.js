import express from 'express';
import {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser
} from '../../controllers/gestionUser/user.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { isAdmin } from '../../middleware/checkRole.js';

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées - nécessitent authentification
router.get('/me', verifyToken, getCurrentUser);

// Routes d'administration - nécessitent authentification et rôle admin
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, isAdmin, getUserById);
router.put('/:id', verifyToken, isAdmin, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;