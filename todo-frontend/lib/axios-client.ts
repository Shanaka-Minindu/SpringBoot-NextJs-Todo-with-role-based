/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from 'axios';

// export const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // Enterprise response/error interceptor structure
// apiClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     // Handle 401 Unauthorized globally
//     if (error.response?.status === 401) {
//       // Clear auth storage if needed and redirect to login
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('auth-storage'); // Clears your Zustand auth store
//         window.location.href = '/login';
//       }
//     }

//     const message = error.response?.data?.message || 'An unexpected error occurred with the backend.';
//     return Promise.reject(new Error(message));
//   }
// );


import axios from 'axios';
import { useAuthStore } from '@/store/userAuthStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 1. Request Interceptor: Attach Access Token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variables to manage queued requests during a token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

  // 2. Response Interceptor: Catch 401 or 403, refresh token, and retry request
apiClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;
  
      // FIXED: Listen for both 401 Unauthorized and 403 Forbidden
      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
  
        originalRequest._retry = true;
        isRefreshing = true;
  
        const refreshToken = useAuthStore.getState().refreshToken;
  
        try {
          // Call backend refresh endpoint
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/refresh-token`,
            { refreshToken }
          );
  
          const newAccessToken = response.data.token;
  
          // Save new access token to Zustand store
          useAuthStore.getState().setAccessToken(newAccessToken);
  
          // Process queued requests
          processQueue(null, newAccessToken);
          isRefreshing = false;
  
          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
  
          // Refresh token has expired or is invalid — log out user
          useAuthStore.getState().clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
  
          return Promise.reject(refreshError);
        }
      }
  
      const message = error.response?.data?.message || 'An unexpected error occurred with the backend.';
      return Promise.reject(new Error(message));
    }
  );