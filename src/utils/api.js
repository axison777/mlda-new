import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('mdla-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('mdla-token');
            localStorage.removeItem('mdla-user');
            window.location.href = '/connexion';
        }
        return Promise.reject(error);
    }
);

// Helper for file uploads
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

export default api;
