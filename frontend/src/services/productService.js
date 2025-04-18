// src/services/productService.js
import api from '../services/api.js';

// Récupérer tous les produits
export const getAllProducts = async () => {
    try {
        const response = await api.get('/api/products');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        throw error;
    }
};

// Récupérer un produit par son ID
export const getProductById = async (productId) => {
    try {
        const response = await api.get(`/api/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération du produit ${productId}:`, error);
        throw error;
    }
};