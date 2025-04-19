import axios from 'axios';

const API_URL = 'https://merngestion-backend.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // pour gérer les cookies
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Fonction pour vérifier l'état de l'API
export const checkApiStatus = async () => {
    try {
        const response = await api.get('/api/health');
        return response.data.status === 'ok';
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
};

export default api;
