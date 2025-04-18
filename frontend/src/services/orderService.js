// src/services/orderService.js
import api from '../services/api';

// Récupérer toutes les commandes
export const getAllOrders = async () => {
    try {
        const response = await api.get('/api/orders');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        throw error;
    }
};

// Récupérer une commande par son ID
export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/api/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la commande ${orderId}:`, error);
        throw error;
    }
};

// Créer une nouvelle commande
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
    }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/api/orders/${orderId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut de la commande ${orderId}:`, error);
        throw error;
    }
};

// Mettre à jour le statut de paiement
export const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
        const response = await api.patch(`/api/orders/${orderId}/payment`, { paymentStatus });
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut de paiement de la commande ${orderId}:`, error);
        throw error;
    }
};

// Générer une facture
export const generateInvoice = async (orderId) => {
    try {
        const response = await api.get(`/api/orders/${orderId}/invoice`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la génération de la facture pour la commande ${orderId}:`, error);
        throw error;
    }
};

// Télécharger une facture
export const getInvoiceDownloadUrl = (orderId) => {
    return `${api.defaults.baseURL}/api/orders/${orderId}/invoice/download`;
};


