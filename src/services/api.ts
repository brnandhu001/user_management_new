import axios from 'axios';

// ✅ Use environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;


const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired — logging out...');

      try {
        // Optional logout API call
        await axios.post(`${baseURL}/logout`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (logoutError) {
        console.error('Logout API failed:', logoutError);
      }

      // Clear and redirect
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
