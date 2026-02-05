import axios from 'axios';

// Hardcoding URL for debugging - Environment variable seems flaky
const API_URL = 'https://mlda-backend.onrender.com/api';
console.log('📢 Frontend API_URL (Hardcoded):', API_URL);



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
        // Build the login URL path to check against
        const loginUrl = '/auth/login';

        // Check if the error is 401 AND it's NOT a login request
        // (Login requests should be handled by the component to show "Wrong password")
        if (error.response?.status === 401 && !error.config.url.includes(loginUrl)) {
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
