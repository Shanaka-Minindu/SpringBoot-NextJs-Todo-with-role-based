import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Enterprise response/error interceptor structure
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      // Clear auth storage if needed and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage'); // Clears your Zustand auth store
        window.location.href = '/login';
      }
    }

    const message = error.response?.data?.message || 'An unexpected error occurred with the backend.';
    return Promise.reject(new Error(message));
  }
);