import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../lib/constants';

// Create axios instance with custom config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and refresh tokens
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Here you could implement token refresh logic if needed
        // const refreshToken = localStorage.getItem('refresh_token');
        // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        // const { token } = response.data;
        // localStorage.setItem(AUTH_TOKEN_KEY, token);
        // originalRequest.headers.Authorization = `Bearer ${token}`;
        // return apiClient(originalRequest);
        
        // For now, just redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth data and redirect to login
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;