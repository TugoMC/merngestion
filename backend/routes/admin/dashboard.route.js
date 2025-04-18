import express from 'express';
import { getPublicDashboardStats } from '../../controllers/admin/dashboard.controller.js';

const router = express.Router();

// Route publique pour le tableau de bord
router.get('/dashboard', getPublicDashboardStats);

export default router;