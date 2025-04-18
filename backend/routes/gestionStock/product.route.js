import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    updateProductQuantity,
    getLowStockProducts
} from '../../controllers/gestionStock/product.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

// Routes protégées par verifyToken
router.get('/', verifyToken, getAllProducts);
router.get('/search', verifyToken, searchProducts);
router.get('/low-stock', verifyToken, getLowStockProducts);
router.get('/:id', verifyToken, getProductById);
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.patch('/:id/quantity', verifyToken, updateProductQuantity);
router.delete('/:id', verifyToken, deleteProduct);

export default router;