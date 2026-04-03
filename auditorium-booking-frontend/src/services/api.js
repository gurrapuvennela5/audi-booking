import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('aura_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('aura_token');
            localStorage.removeItem('aura_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
