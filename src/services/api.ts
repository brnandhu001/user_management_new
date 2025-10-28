import axios from 'axios';
import CryptoJS from 'crypto-js';

// ✅ Load environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const SECRET_KEY = import.meta.env.VITE_TOKEN_SECRET || 'fallback-secret';

// 🔐 Helper: decrypt token from sessionStorage
const getDecryptedToken = (): string | null => {
  const encrypted = sessionStorage.getItem('authToken');
  if (!encrypted) return null;

  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const token = decrypted.toString(CryptoJS.enc.Utf8);
    return token || null;
  } catch (error) {
    console.error('Token decryption failed:', error);
    return null;
  }
};

// ✅ Create Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  },
});

// ✅ Request interceptor — add decrypted token
api.interceptors.request.use((config) => {
  const token = getDecryptedToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor — handle session expiry (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired — logging out...');

      try {
        // Optional logout API call
        const token = getDecryptedToken();
        if (token) {
          await axios.post(
            `${baseURL}/logout`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (logoutError) {
        console.error('Logout API failed:', logoutError);
      }

      // Clear token and redirect
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
