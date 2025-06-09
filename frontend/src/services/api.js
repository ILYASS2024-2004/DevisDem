import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Service de gestion des clients
export const clientService = {
    getAll: () => api.get('/clients'),
    getById: (id) => api.get(`/clients/${id}`),
    create: (clientData) => api.post('/clients', clientData),
    update: (id, clientData) => api.put(`/clients/${id}`, clientData),
    delete: (id) => api.delete(`/clients/${id}`),
    search: (query) => api.get(`/clients/search?q=${query}`)
};

// Service de gestion des devis
export const quoteService = {
    getAll: () => api.get('/quotes'),
    getById: (id) => api.get(`/quotes/${id}`),
    create: (quoteData) => api.post('/quotes', quoteData),
    update: (id, quoteData) => api.put(`/quotes/${id}`, quoteData),
    delete: (id) => api.delete(`/quotes/${id}`),
    getByClient: (clientId) => api.get(`/quotes/client/${clientId}`),
    updateStatus: (id, status) => api.patch(`/quotes/${id}/status`, { status })
};

// Service d'authentification
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Service de gestion des utilisateurs
export const userService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    updatePassword: (passwordData) => api.put('/users/password', passwordData),
    getAll: () => api.get('/users'),
    create: (userData) => api.post('/users', userData),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`)
};

// Service de géolocalisation
export const geolocationService = {
    getDistance: (origin, destination) => api.post('/geolocation/distance', { origin, destination }),
    getCoordinates: (address) => api.post('/geolocation/coordinates', { address })
};

// Gestion des erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export { api }; 