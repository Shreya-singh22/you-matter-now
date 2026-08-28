import axios from 'axios';

// Point at a local backend during development, the deployed one otherwise.
// Override with VITE_API_URL in .env when you need a different target.
const baseURL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
        ? 'http://localhost:8000'
        : 'https://you-matter-now.onrender.com');

const api = axios.create({ baseURL });

export const TOKEN_KEY = 'ymn_token';

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// A 401 means the token is missing, expired or invalid. Clear it so the app
// stops pretending to be signed in; AuthContext reacts to the storage change.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.dispatchEvent(new Event('ymn:unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default api;
