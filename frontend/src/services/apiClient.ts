import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // For successful API responses with our structure {success, data, message}
        if (response.data && response.data.success && response.data.data) {
          return {
            ...response,
            data: response.data.data,
          };
        }
        // For other responses, return as-is
        return response;
      },
      async (error) => {
        const { response } = error;

        if (response?.status === 401) {
          // Token expired or invalid
          // Try to refresh token
          const refreshToken = localStorage.getItem('auth-refresh-token');
          if (refreshToken) {
            try {
              const refreshResponse = await this.client.post('/auth/refresh', {
                refreshToken: refreshToken,
              });

              // Update stored tokens
              localStorage.setItem('auth-token', refreshResponse.data.token);
              localStorage.setItem('auth-refresh-token', refreshResponse.data.refreshToken);

              // Retry the original request
              error.config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.removeItem('auth-token');
              localStorage.removeItem('auth-refresh-token');
              localStorage.removeItem('auth-user');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token, redirect to login
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-refresh-token');
            localStorage.removeItem('auth-user');
            window.location.href = '/login';
          }
        }

        // Extract error message from response
        const errorMessage = response?.data?.error || 
                           response?.data?.message || 
                           error.message || 
                           'An unexpected error occurred';

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  // Method to set auth token manually
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to remove auth token
  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

export const apiClient = new ApiClient();
