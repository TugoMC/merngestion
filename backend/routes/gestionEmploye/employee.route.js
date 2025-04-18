import express from 'express';
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees
} from '../../controllers/gestionEmploye/employee.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

// Routes protégées par verifyToken
router.get('/', verifyToken, getAllEmployees);
router.get('/search', verifyToken, searchEmployees);
router.get('/:id', verifyToken, getEmployeeById);
router.post('/', verifyToken, createEmployee);
router.put('/:id', verifyToken, updateEmployee);
router.delete('/:id', verifyToken, deleteEmployee);

export default router;