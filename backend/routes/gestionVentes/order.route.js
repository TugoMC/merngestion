import express from 'express';
import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    generateInvoice,
    downloadInvoice
} from '../../controllers/gestionVentes/order.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

// Routes protégées par verifyToken
router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrderById);
router.post('/', verifyToken, createOrder);
router.patch('/:id/status', verifyToken, updateOrderStatus);
router.patch('/:id/payment', verifyToken, updatePaymentStatus);
router.get('/:id/invoice', verifyToken, generateInvoice);
router.get('/:id/invoice/download', verifyToken, downloadInvoice);

export default router;