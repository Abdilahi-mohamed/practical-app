import axios from 'axios';
import { getToken } from '../utils/storage';

// Change this to your backend URL
// For development: use your computer's IP address (not localhost)
// Example: http://192.168.1.100:5000/api
// Use your computer's IP address for physical devices
const API_BASE_URL = 'http://192.168.123.51:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (username, email, password) =>
        api.post('/auth/register', { username, email, password }),

    login: (email, password) =>
        api.post('/auth/login', { email, password }),
};

// Personalities APIs
export const personalitiesAPI = {
    getAll: () => api.get('/personalities'),

    unlock: (personalityId) =>
        api.post(`/personalities/unlock/${personalityId}`),
};

// Chat APIs
export const chatAPI = {
    getHistory: (personalityId) =>
        api.get(`/chat/history/${personalityId}`),

    sendMessage: (personalityId, message) =>
        api.post('/chat/message', { personalityId, message }),
};

export default api;
